const { getChannel } = require('../config/rabbitmq');
const Auth = require('../models/Auth');

const setupConsumers = async () => {
    try {
        const channel = getChannel();
        
        // Setup user cleanup consumer
        await channel.assertExchange('user_delete_event', 'fanout', { durable: true });
        const q = await channel.assertQueue('auth_cleanup', { durable: true });
        await channel.bindQueue(q.queue, 'user_delete_event', '');
        
        channel.consume(q.queue, async (msg) => {
            if(msg !== null) {
                const id = JSON.parse(msg.content.toString()).authId;
                try {
                    await Auth.findByIdAndDelete(id);
                    console.log(`[RabbitMQ] Deleted Auth record for ${id}`);
                } catch(err) {
                    console.error("Error in deleting auth", err);
                }
                channel.ack(msg);
            }
        });
        
        console.log("RabbitMQ Consumers setup in Auth Service");
    } catch (error) {
        console.error("Error setting up consumers in Auth Service", error);
    }
};

module.exports = { setupConsumers };
