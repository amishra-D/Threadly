const { getChannel } = require('../config/rabbitmq');
const Report = require('../models/Report');

const setupConsumers = async () => {
    try {
        const channel = getChannel();

        await channel.assertExchange('post_deleted_event', 'fanout', { durable: true });
        const q1 = await channel.assertQueue('moderation_post_cleanup', { durable: true });
        await channel.bindQueue(q1.queue, 'post_deleted_event', '');
        channel.consume(q1.queue, async (msg) => {
            if(msg !== null) {
                const postId = JSON.parse(msg.content.toString()).postId;
                try {
                    await Report.deleteMany({ contentId: postId });
                    console.log(`[RabbitMQ] Deleted reports for post ${postId}`);
                } catch(err) {
                    console.error("Error in deleting post reports", err);
                }
                channel.ack(msg);
            }
        });

        await channel.assertExchange('user_delete_event', 'fanout', { durable: true });
        const q2 = await channel.assertQueue('moderation_user_cleanup', { durable: true });
        await channel.bindQueue(q2.queue, 'user_delete_event', '');
        channel.consume(q2.queue, async (msg) => {
            if(msg !== null) {
                const authId = JSON.parse(msg.content.toString()).authId;
                try {
                    await Report.deleteMany({ reportedBy: authId });
                    console.log(`[RabbitMQ] Deleted reports for user ${authId}`);
                } catch(err) {
                    console.error("Error in deleting user reports", err);
                }
                channel.ack(msg);
            }
        });

        console.log("RabbitMQ Consumers setup in Moderation Service");
    } catch (error) {
        console.error("Error setting up consumers in Moderation Service", error);
    }
};

module.exports = { setupConsumers };
