const amqp = require('amqplib');

let channel = null;

const connectRabbitMQ = async () => {
    try {
        const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
        const connection = await amqp.connect(rabbitUrl);
        channel = await connection.createChannel();
        console.log("RabbitMQ Connected in Auth Service");
        return channel;
    } catch (err) {
        console.error("Failed to connect to RabbitMQ in Auth Service, retrying...", err.message);
        await new Promise(resolve => setTimeout(resolve, 5000));
        return connectRabbitMQ();
    }
};

const getChannel = () => {
    if (!channel) throw new Error("RabbitMQ channel not initialized");
    return channel;
};

module.exports = { connectRabbitMQ, getChannel };
