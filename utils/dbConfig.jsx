import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon(
  // "postgresql://neondb_owner:lFYd3OnKoJ9Q@ep-weathered-recipe-a13zose9.ap-southeast-1.aws.neon.tech/krishi?sslmode=require",
  "postgresql://neondb_owner:npg_iWkA2FVNygG7@ep-square-bread-a5yacjti-pooler.us-east-2.aws.neon.tech/krishiniyojak?sslmode=require",
);
export const db = drizzle(sql, { schema });
