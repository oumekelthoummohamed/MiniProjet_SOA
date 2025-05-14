const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDef = protoLoader.loadSync('../proto/billing.proto');
const grpcObject = grpc.loadPackageDefinition(packageDef);
const BillingService = grpcObject.BillingService;

const client = new BillingService('localhost:50051', grpc.credentials.createInsecure());

client.Charge({ userId: 'testUser', amount: 0.05 }, (err, response) => {
  if (err) console.error("❌ gRPC Error:", err);
  else console.log("✅ gRPC Response:", response);
});
