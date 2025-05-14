const { Kafka } = require('kafkajs');

const kafka = new Kafka({ clientId: 'analytics', brokers: ['localhost:9092'] });
const consumer = kafka.consumer({
  groupId: 'analytics-group',
  sessionTimeout: 30000, // Increase session timeout
});

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'api-usage', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`API Usage Logged: ${message.value.toString()}`);
    },
  });
};

run().catch(console.error);
