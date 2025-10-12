import { env as cloudflareEnv } from "cloudflare:workers";
import {
	PostgresJSConnection,
	PushProcessor,
	ZQLDatabase,
} from "@rocicorp/zero/pg";
import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { auth } from "@ztunes/core/auth/auth";
import { must } from "@ztunes/core/shared/must";
import { createMutators } from "@ztunes/core/zero/mutators";
import { schema } from "@ztunes/core/zero/schema";
import * as jose from "jose";
import postgres from "postgres";
import type { frontend } from "../../../../alchemy.run";

// Need to use env vars process through alchemy.run. Not sure why there's a type error  here.
const env = cloudflareEnv as frontend.Env;
// This doesn't log  when `Error: Cannot find module 'cloudflare:workers' ` throws
console.log("🚀 ~ env:", env);

const pgURL = must(env.PG_URL, "PG_URL is required");

const processor = new PushProcessor(
	new ZQLDatabase(new PostgresJSConnection(postgres(pgURL)), schema),
);

export const Route = createFileRoute("/api/zero/mutate")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const userID = await getUserID(request);
				if (typeof userID === "object") {
					return userID;
				}

				try {
					const result = await processor.process(
						createMutators(userID ? { sub: userID } : undefined),
						request,
					);
					return json(result);
				} catch (_err) {
					return json({ error: "Invalid token" }, { status: 401 });
				}
			},
		},
	},
});

async function getUserID(request: Request) {
	const authHeader = request.headers.get("authorization");
	if (!authHeader) {
		return undefined;
	}

	const prefix = "Bearer ";
	if (!authHeader.startsWith(prefix)) {
		return json(
			{ error: "Missing or invalid authorization header" },
			{ status: 401 },
		);
	}

	const token = authHeader.slice(prefix.length);
	const set = await auth.api.getJwks();
	const jwks = jose.createLocalJWKSet(set);

	try {
		const { payload } = await jose.jwtVerify(token, jwks);
		return must(payload.sub, "Empty sub in token");
	} catch (err) {
		console.info(`Could not verify token: ${err.message ?? String(err)}`);
		return json({ error: "Invalid token" }, { status: 401 });
	}
}
