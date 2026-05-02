import { defineConfig } from "drizzle-kit";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

// drizzle-kit matches schema paths with globs — Windows backslashes and some
// absolute paths fail lookup; posix-style paths are reliable.
const schemaFile = path.join(root, "src", "schema", "index.ts").replace(/\\/g, "/");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  schema: schemaFile,
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
