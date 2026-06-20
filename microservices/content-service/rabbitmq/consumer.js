const { getChannel } = require('../config/rabbitmq');
const Posts = require('../models/Post');

const setupConsumers = async () => {
    try {
        const channel = getChannel();

        await channel.assertExchange('user_delete_event', 'fanout', { durable: true });
        const q = await channel.assertQueue('content_cleanup', { durable: true });
        await channel.bindQueue(q.queue, 'user_delete_event', '');
        
        channel.consume(q.queue, async (msg) => {
            if(msg !== null) {
                const id = JSON.parse(msg.content.toString()).authId;
                try {
                    await Posts.deleteMany({ userId: id });
                    console.log(`[RabbitMQ] Deleted posts for user ${id}`);
                } catch(err) {
                    console.error("Error in deleting posts", err);
                }
                channel.ack(msg);
            }
        });

        await channel.assertQueue('post_comments_count', { durable: true });
        channel.consume('post_comments_count', async (msg) => {
            if(msg !== null) {
                const { postId, increment } = JSON.parse(msg.content.toString());
                try {
                    await Posts.findByIdAndUpdate(postId, { $inc: { commentsCount: increment } });
                    console.log(`[RabbitMQ] Updated commentsCount by ${increment} for post ${postId}`);
                } catch(err) {
                    console.error("Error updating commentsCount", err);
                }
                channel.ack(msg);
            }
        });

        await channel.assertQueue('post_reports_count', { durable: true });
        channel.consume('post_reports_count', async (msg) => {
            if(msg !== null) {
                const { postId, increment } = JSON.parse(msg.content.toString());
                try {
                    await Posts.findByIdAndUpdate(postId, { $inc: { reportsCount: increment } });
                    console.log(`[RabbitMQ] Updated reportsCount by ${increment} for post ${postId}`);
                } catch(err) {
                    console.error("Error updating reportsCount", err);
                }
                channel.ack(msg);
            }
        });

        console.log("RabbitMQ Consumers setup in Content Service");
    } catch (error) {
        console.error("Error setting up consumers in Content Service", error);
    }
};

module.exports = { setupConsumers };
