import type { Component } from "./types";

import * as rollup from "rollup/dist/es/rollup.browser.js";

const CDN_URL = "https://cdn.jsdelivr.net/npm";
importScripts(`${CDN_URL}/svelte/compiler.js`);

const component_lookup: Map<string, Component> = new Map();

async function fetch_package(url: string): Promise<string> {
	return (await fetch(url)).text();
}

function generate_lookup(components: Component[]): void {
	components.forEach((component) => {
		component_lookup.set(`./${component.name}.${component.type}`, component);
	});
}

self.addEventListener(
	"message",
	async (event: MessageEvent<Component[]>): Promise<void> => {
		generate_lookup(event.data);

		const bundle = await rollup.rollup({
			input: "./App.svelte",
			plugins: [
				{
					name: "repl-plugin",
					async resolveId(importee: string, importer: string) {
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

						// repl components
						if (component_lookup.has(importee)) return importee;

						// relative imports from a remote package
						if (importee.startsWith("."))
							return new URL(importee, importer).href;

						// bare named module imports (importing an npm package)

						// get the package.json and load it into memory
						const pkg_url = `${CDN_URL}/${importee}/package.json`;
						const pkg = JSON.parse(await fetch_package(pkg_url));

						// get an entry point from the pkg.json - first try svelte, then modules, then main
						if (pkg.svelte || pkg.module || pkg.main) {
							// use the aobove url minus `/package.json` to resolve the URL
							const url = pkg_url.replace(/\/package\.json$/, "");
							return new URL(pkg.svelte || pkg.module || pkg.main, `${url}/`)
								.href;
						}

						// we probably missed stuff, pass it along as is
						return importee;
					},
					async load(id: string) {
						if (component_lookup.has(id))
							return component_lookup.get(id).source;

						return await fetch_package(id);
					},
					transform(code: string, id: string) {
						//@ts-ignore
						if (/.*\.svelte/.test(id)) return svelte.compile(code).js.code;
					},
				},
			],
		});

		const output: string = (await bundle.generate({ format: "esm" })).output[0]
			.code;

		self.postMessage(output);
	}
);
