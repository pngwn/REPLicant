<script lang="ts">
	import Input from "./Input.svelte";
	import Output from "./Output.svelte";
	import type { Component } from "./types";

	let components: Component[] = [
		{
			id: 0,
			name: "App",
			type: "svelte",
			source: `<script>
  import Component from './Component1.svelte';
<\/script>

<Component />
	`,
		},
		{
			id: 1,
			name: "Component1",
			type: "svelte",
			source: "<h1>Hello</h1>",
		},
	];

	let current: number = 0;

	const worker = new Worker("./worker.js");

	let compiled;

	worker.addEventListener("message", (event) => {
		compiled = event.data;
	});

	function compile(_components: Component[]): void {
		worker.postMessage(_components);
	}

	$: compile(components);
</script>

<main>
	<Input bind:components bind:current />
	<Output {compiled} />
</main>
