/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */

import alchemy from "alchemy";

import { TanStackStart } from "alchemy/cloudflare";

const app = await alchemy("web");

export const frontend = await TanStackStart("website", {
	compatibility: "node",
	bindings: {
		PG_URL: alchemy.secret(process.env.PG_URL!),
		VITE_SERVER_URL: process.env.VITE_PUBLIC_SERVER!,
		GITHUB_CLIENT_ID: alchemy.secret(process.env.GITHUB_CLIENT_ID!),
		GITHUB_CLIENT_SECRET: alchemy.secret(process.env.GITHUB_CLIENT_SECRET!),
	},
	dev: {
		command: "bun run vite dev --port=3000 ",
	},
});

await app.finalize();
