import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";

const production = !process.env.ROLLUP_WATCH;

const onwarn = ({ message }) =>
	message.includes("@rollup/plugin-typescript TS2315");

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require("child_process").spawn(
				"npm",
				["run", "start", "--", "--dev"],
				{
					stdio: ["ignore", "inherit", "inherit"],
					shell: true,
				}
			);

			process.on("SIGTERM", toExit);
			process.on("exit", toExit);
		},
	};
}

export default [
	{
		input: "src/main.ts",
		output: {
			sourcemap: true,
			format: "iife",
			name: "app",
			file: "public/build/bundle.js",
		},
		plugins: [
			svelte({
				dev: !production,
				css: (css) => {
					css.write("bundle.css");
				},
				preprocess: sveltePreprocess(),
			}),

			resolve({
				browser: true,
				dedupe: ["svelte"],
			}),
			commonjs(),
			typescript(),
			!production && serve(),
			!production && livereload("public"),
		],
		watch: {
			clearScreen: false,
		},
		onwarn,
	},
	{
		input: "src/worker.ts",
		output: {
			sourcemap: true,
			format: "esm",
			name: "app",
			file: "public/worker.js",
		},
		plugins: [
			resolve({
				browser: true,
				dedupe: ["svelte"],
			}),
			commonjs(),
			typescript(),
		],
		watch: {
			clearScreen: false,
		},
		onwarn,
	},
];
