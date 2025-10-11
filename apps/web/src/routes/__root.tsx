/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: <explanation> */

import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { must } from "@ztunes/core/shared/must";
import type { ReactNode } from "react";
import type { RouterContext } from "../router";

export const Route = createRootRouteWithContext<RouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "ztunes",
			},
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	);
}

const serverURL = must(
	import.meta.env.VITE_PUBLIC_SERVER,
	"VITE_PUBLIC_SERVER is required",
);

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href={serverURL} />
				<style
					dangerouslySetInnerHTML={{
						__html: `
          html {
            font-family: sans-serif;
            font-optical-sizing: auto;
            font-weight: 400;
            font-style: normal;
          }
        `,
					}}
				/>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
