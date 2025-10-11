import { defineConfig } from "drizzle-kit";
import { must } from "./src/shared/must";
import "@ztunes/env";

const pgURL = must(process.env.PG_URL, "PG_URL is required");
console.log("🚀 ~ pgURL:", pgURL);

export default defineConfig({
	out: "./src/db/migrations",
	schema: "./src/db/schema.ts",
	dialect: "postgresql",
	verbose: true,
	strict: true,
	dbCredentials: {
		url: pgURL,
	},
});
