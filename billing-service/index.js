const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync("../proto/billing.proto");
const grpcObject = grpc.loadPackageDefinition(packageDef);
const billingPackage = grpcObject.BillingService;

function charge(call, callback) {
  const { userId, amount } = call.request;
  const transactionId = `txn_${Math.floor(Math.random() * 10000)}`;
  console.log(`Charged ${userId} for ${amount}`);
  callback(null, { success: true, transactionId });
}

const server = new grpc.Server();
server.addService(billingPackage.service, { Charge: charge });
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  server.start();
  console.log('Billing Service running on port 50051');
});
