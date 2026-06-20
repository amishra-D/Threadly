const { getChannel } = require('../config/rabbitmq');
const Profile = require('../models/Profile');

const setupConsumers = async () => {
    try {
        const channel = getChannel();

        await channel.assertQueue('user_created');
        channel.consume('user_created', async (msg) => {
            if (msg !== null) {
                try {
                    const data = JSON.parse(msg.content.toString());
                    
                    const existingProfile = await Profile.findOne({ authId: data.authId });
                    if (!existingProfile) {
                        const newProfile = new Profile({
                            authId: data.authId,
                            username: data.username,
                            email: data.email
                        });
                        await newProfile.save();
                        console.log(`[RabbitMQ] Profile successfully created for ${data.username}`);
                    }
                    channel.ack(msg);
                } catch (err) {
                    console.error("Error processing user_created message:", err.message);
                    channel.nack(msg, false, false);
                }
            }
        });

        console.log("RabbitMQ Consumers setup in User Service");
    } catch (error) {
        console.error("Error setting up consumers in User Service", error);
    }
};

module.exports = { setupConsumers };
