const { Kafka } = require('kafkajs');
const kafka = new Kafka({ clientId: 'manual-producer', brokers: ['localhost:9092'] });
const producer = kafka.producer();

const run = async () => {
  await producer.connect();
  await producer.send({
    topic: 'api-usage',
    messages: [{ value: 'manual kafka message test' }],
  });
  console.log("✅ Kafka message sent.");
  await producer.disconnect();
};

run();
