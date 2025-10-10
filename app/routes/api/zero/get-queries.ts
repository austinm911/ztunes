import { type ReadonlyJSONValue, withValidation } from "@rocicorp/zero";
import { handleGetQueriesRequest } from "@rocicorp/zero/server";
import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { getHomepageArtists } from "app/routes/_layout";
import { getArtistQuery } from "app/routes/_layout/artist";
import { getCartItemsQuery } from "app/routes/_layout/cart";
import { auth } from "auth/auth";
import * as jose from "jose";
import { must } from "shared/must";
import { schema } from "zero/schema";

const queries = Object.fromEntries(
	[getHomepageArtists, getCartItemsQuery, getArtistQuery].map((q) => [
		q.queryName,
		withValidation(q),
	]),
);

export const Route = createFileRoute("/api/zero/get-queries")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const userID = await getUserID(request);
				if (typeof userID === "object") {
					return userID;
				}

				return json(
					await handleGetQueriesRequest(
						(name, args) => getQuery(userID, name, args),
						schema,
						request,
					),
				);
			},
		},
	},
});

function getQuery(
	userID: string | undefined,
	name: string,
	args: readonly ReadonlyJSONValue[],
) {
	const q = queries[name];
	if (!q) {
		throw new Error(`Unknown query: ${name}`);
	}
	return { query: q(userID, ...args) };
}

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
