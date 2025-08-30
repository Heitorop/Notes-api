import { defineConfig } from "drizzle-kit";
import "dotenv/config";

function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required env variable: ${key}`);
    }
    return value;
}

const dbUrl =
    process.env.DATABASE_URL ||
    `postgres://${requireEnv("DB_USER")}:${requireEnv("DB_PASSWORD")}@${requireEnv("DB_HOST")}:${requireEnv("DB_PORT")}/${requireEnv("DB_NAME")}`;

export default defineConfig({
    schema: "./db/schema.ts",
    out: "./migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: dbUrl,
    },
});
