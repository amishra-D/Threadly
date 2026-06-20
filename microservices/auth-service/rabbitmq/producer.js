const { getChannel } = require('../config/rabbitmq');

const publishToQueue = async (queueName, data) => {
    try {
        const channel = getChannel();
        await channel.assertQueue(queueName, { durable: true });
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    } catch (error) {
        console.error(`Error publishing to queue ${queueName}`, error);
    }
};

const publishToExchange = async (exchangeName, routingKey, data) => {
    try {
        const channel = getChannel();
        await channel.assertExchange(exchangeName, 'fanout', { durable: true });
        channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(data)));
    } catch (error) {
        console.error(`Error publishing to exchange ${exchangeName}`, error);
    }
};

module.exports = { publishToQueue, publishToExchange };
