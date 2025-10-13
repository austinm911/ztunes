import { env as cloudflareEnv } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

import type { frontend } from "../../../alchemy.run";

const env = cloudflareEnv as typeof frontend.Env;

export const Route = createFileRoute("/api/test")({
	server: {
		handlers: {
			GET: async () => {
				return json(env);
			},
		},
	},
});
