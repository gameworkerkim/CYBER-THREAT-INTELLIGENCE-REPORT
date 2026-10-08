import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ?? "postgres://user:pass@localhost:5432/heimdallr";

const client = neon(connectionString);

export const db = drizzle(client, { schema });

export { schema };
