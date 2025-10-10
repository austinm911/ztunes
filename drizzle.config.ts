import { defineConfig } from "drizzle-kit";
import { must } from "./shared/must";
import "./shared/env";

const pgURL = must(process.env.PG_URL, "PG_URL is required");
console.log("🚀 ~ pgURL:", pgURL);

export default defineConfig({
	out: "./db/migrations",
	schema: "./db/schema.ts",
	dialect: "postgresql",
	verbose: true,
	strict: true,
	dbCredentials: {
		url: pgURL,
	},
});
