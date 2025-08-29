// src/lib/mongo.ts
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

if (!uri) throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
if (!dbName) throw new Error('Invalid/Missing environment variable: "DB_NAME"');

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Use global variable in development for HMR
if (process.env.NODE_ENV === 'development') {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, {
      serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
    });
    globalWithMongo._mongoClient = client;
    globalWithMongo._mongoClientPromise = client.connect();
  }

  client = globalWithMongo._mongoClient!;
  clientPromise = globalWithMongo._mongoClientPromise!;
} else {
  // Production: no global, just create a new client
  client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
  });
  clientPromise = client.connect();
}

// Helper function to get the connected client
export async function getClient() {
  return clientPromise;
}

// Helper function to get the default DB
export async function getDb() {
  const c = await getClient();
  return c.db(dbName);
}
