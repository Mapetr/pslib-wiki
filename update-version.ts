import { ConvexHttpClient } from "convex/browser";
import "dotenv/config";
import { api } from "./convex/_generated/api";

const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL);

const newVersion = new Date().toISOString();

try {
  await client.mutation(api.updateVersion.updateVersion, {
    hash: newVersion,
    token: process.env.VERSION_TOKEN,
  });
  console.log(`Deployed version updated to: ${newVersion}`);
} catch (error) {
  console.error("Error updating Convex version:", error);
}
