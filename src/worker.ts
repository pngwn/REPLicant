import type { Component } from "./types";

import * as rollup from "rollup/dist/es/rollup.browser.js";

const CDN_URL = "https://cdn.jsdelivr.net/npm";

async function fetch_package(url: string): Promise<string> {
	return (await fetch(url)).text();
}

self.addEventListener(
	"message",
	async (event: MessageEvent<Component[]>): Promise<void> => {
		console.log(event.data);

		const bundle = await rollup.rollup({
			input: "./App.svelte",
			plugins: [
				{
					name: "repl-plugin",
					resolveId(importee: string, importer: string) {
						// import x from 'svelte'
						if (importee === "svelte") return `${CDN_URL}/svelte/index.mjs`;
						// import x from 'svelte/somewhere'
						if (importee.startsWith("svelte/")) {
							return `${CDN_URL}/svelte/${importee.slice(7)}/index.mjs`;
						}
						// import x from './file.js'
						if (importer && importer.startsWith(`${CDN_URL}/svelte`)) {
							const resolved = new URL(importee, importer).href;
							if (resolved.endsWith(".mjs")) return resolved;
							return `${resolved}/index.mjs`;
						}
					},
					async load(id: string) {
						return await fetch_package(id);
					},
					transform(code: string, id: string) {},
				},
			],
		});

		const output: string = (await bundle.generate({ format: "esm" })).output[0]
			.code;
	}
);
