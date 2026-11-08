import mongoose from 'mongoose';
import { buildApp } from './app.js';
import { readConfig } from './config.js';

const config = readConfig();
const app = buildApp(config);

async function main() {
  await mongoose.connect(config.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  await app.listen({ port: config.PORT, host: config.HOST });
}

let closing = false;
async function shutdown() {
  if (closing) return;
  closing = true;
  try {
    await app.close();
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

main().catch(async error => {
  app.log.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
