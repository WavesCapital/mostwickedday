import { neon } from "@neondatabase/serverless";
import { serverEnv } from "./server-env";

export const sql = neon(serverEnv().DATABASE_URL);
