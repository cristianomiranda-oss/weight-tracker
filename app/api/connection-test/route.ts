import { MongoClient, ServerApiVersion } from "mongodb";

const dbUserName = process.env.DB_USERNAME
const dbPass = process.env.DB_PASSWORD;
const mongoDbUri = `mongodb://${dbUserName}:${dbPass}@ac-udfeevm-shard-00-00.a0yqeq4.mongodb.net:27017,ac-udfeevm-shard-00-01.a0yqeq4.mongodb.net:27017,ac-udfeevm-shard-00-02.a0yqeq4.mongodb.net:27017/?ssl=true&replicaSet=atlas-t9numu-shard-0&authSource=admin&appName=Weight-Tracking-Data`;

export async function GET(request: Request) {
  const client = new MongoClient(mongoDbUri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // Connects to the database and pings it before closing
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    client.close();

    return new Response("Ping", {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Connection Test GET: ", error);
    return new Response(JSON.stringify({ message: "POST Failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    client.close();
  }
}
