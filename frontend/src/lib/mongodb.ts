// src/lib/mongo.ts
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

if (!uri) throw new Error("MONGODB_URI is not set");
if (!dbName) throw new Error("DB_NAME is not set");

// Reuse the client across hot reloads in dev
let client: MongoClient | null = (global as any)._mongoClient ?? null;
let clientPromise: Promise<MongoClient> | null = (global as any)._mongoClientPromise ?? null;

if (!clientPromise) {
  client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
  });
  clientPromise = client.connect();
  (global as any)._mongoClient = client;
  (global as any)._mongoClientPromise = clientPromise;
}

export async function getClient() {
  return clientPromise!;
}

export async function getDb() {
  const c = await getClient();
  return c.db(dbName);
}
