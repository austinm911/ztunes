// vite.config.ts

import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import alchemy from "alchemy/cloudflare/tanstack-start";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

const dir = import.meta.dirname;
console.log("🚀 ~ dir:", dir);

export default defineConfig({
	envDir: "../..",
	server: {
		port: 3000,
	},
	plugins: [tsConfigPaths(), alchemy(), tanstackStart(), viteReact()],
});
