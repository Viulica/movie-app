import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
  process.exit(1);
}

async function dumpDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully.");

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    const dumpDir = path.resolve(__dirname, "../db_dumps");
    if (!fs.existsSync(dumpDir)) {
      fs.mkdirSync(dumpDir, { recursive: true });
    }

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`Dumping collection: ${collectionName}`);

      const collection = db.collection(collectionName);
      const documents = await collection.find({}).toArray();

      const filePath = path.join(dumpDir, `${collectionName}.json`);
      fs.writeFileSync(filePath, JSON.stringify(documents, null, 2));

      console.log(`Dumped ${documents.length} documents to ${filePath}`);
    }

    console.log("Database dump completed.");
  } catch (error) {
    console.error("Error dumping database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

dumpDatabase();
