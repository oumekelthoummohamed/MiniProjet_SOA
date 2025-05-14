const express = require('express');
const axios = require('axios');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { Kafka } = require('kafkajs');

// EXPRESS APP
const app = express();
app.use(express.json());
const PORT = 3000;

// REST Config
const PRICING_URL = 'http://localhost:3001';

// gRPC Config
const packageDef = protoLoader.loadSync('../proto/billing.proto');
const grpcObj = grpc.loadPackageDefinition(packageDef);
const billingClient = new grpcObj.BillingService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// Kafka Producer Setup
const kafka = new Kafka({ clientId: 'gateway', brokers: ['localhost:9092'] });
const producer = kafka.producer();

(async () => {
  await producer.connect();

  // ➤ Endpoint REST
  app.post('/use-api/:apiName', async (req, res) => {
    const apiName = req.params.apiName;
    const userId = req.body.userId;

    try {
      // Get pricing
      const { data } = await axios.get(`${PRICING_URL}/pricing/${apiName}`);
      const price = data.price;

      // Call billing (gRPC)
      billingClient.Charge({ userId, amount: price }, async (err, response) => {
        if (err) return res.status(500).json({ error: err.message });

        // Send Kafka message
        await producer.send({
          topic: 'api-usage',
          messages: [{ value: `${userId} used ${apiName}` }],
        });

        res.json({ ...response, used: apiName });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ➤ GraphQL Schema
  const schema = buildSchema(`
    type Billing {
      success: Boolean
      transactionId: String
      used: String
    }

    type Query {
      useAPI(apiName: String!, userId: String!): Billing
    }
  `);

  // ➤ GraphQL Resolver
  const root = {
    useAPI: async ({ apiName, userId }) => {
      const { data } = await axios.get(`${PRICING_URL}/pricing/${apiName}`);
      const price = data.price;

      return new Promise((resolve, reject) => {
        billingClient.Charge({ userId, amount: price }, async (err, response) => {
          if (err) return reject(err);

          // Send Kafka message
          await producer.send({
            topic: 'api-usage',
            messages: [{ value: `${userId} used ${apiName}` }],
          });

          resolve({ ...response, used: apiName });
        });
      });
    },
  };

  // ➤ GraphQL Endpoint
  app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  }));

  // ➤ Start Server
  app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
  });

})();
