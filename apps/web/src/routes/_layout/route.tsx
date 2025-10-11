import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { CookiesProvider } from "react-cookie";
import { SessionInit } from "../../components/session-init";
import { SiteLayout } from "../../components/site-layout";
import { ZeroInit } from "../../components/zero-init";

export const getAuthFromHeaders = createServerFn().handler(async () => {});

export const Route = createFileRoute("/_layout")({
	component: RouteComponent,
	staleTime: Infinity,
});

function RouteComponent() {
	return (
		<CookiesProvider>
			<SessionInit>
				<ZeroInit>
					<SiteLayout>
						<Outlet />
					</SiteLayout>
				</ZeroInit>
			</SessionInit>
		</CookiesProvider>
	);
}
