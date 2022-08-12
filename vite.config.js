import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte()],
	resolve: {
		alias: [
			{ find: "$lib", replacement: path.resolve(__dirname, "src/lib/") },
		],
	},
	server: {
		host: "172.18.20.16",
		port: 5173,
	}
})
