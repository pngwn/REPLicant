<script lang="ts">
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
</script>
