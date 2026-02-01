import { MongoClient } from 'mongodb';

const DEFAULT_URI = 'mongodb://oracle-vm:27017/swiss';
const DEFAULT_DB = 'swiss';

declare global {
  // eslint-disable-next-line no-var
  var __swissMongoClient: MongoClient | undefined;
}

export function getMongoUri(): string {
  return process.env.MONGODB_URI || DEFAULT_URI;
}

export function getMongoDbName(): string {
  return process.env.MONGODB_DB || DEFAULT_DB;
}

export async function getMongoClient(): Promise<MongoClient> {
  if (global.__swissMongoClient) return global.__swissMongoClient;

  const uri = getMongoUri();
  const client = new MongoClient(uri);
  await client.connect();
  global.__swissMongoClient = client;
  return client;
}

export async function getMongoDb() {
  const client = await getMongoClient();
  return client.db(getMongoDbName());
}
