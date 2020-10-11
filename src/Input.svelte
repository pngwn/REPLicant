<script lang="ts">
	import Tabs from "./Tabs.svelte";

	import type { Component } from "./types";

	export let components: Component[] = [];
	export let current: number = 0;

	let textarea: HTMLTextAreaElement;

	function get_max(_components: Component[]): number {
		const ids = _components.map(({ id }) => id);
		return Math.max(...ids);
	}

	function new_component() {
		const id = get_max(components) + 1;

		components = components.concat({
			id,
			name: `Component${id}`,
			type: "svelte",
			source: "",
		});

		current = id;
		textarea.focus();
	}

	$: current_component = components.findIndex(({ id }) => id === current);
	$: tabs = components.map(({ id, name, type }) => ({ id, name, type }));
</script>

<section>
	<Tabs
		{tabs}
		{current}
		on:select={({ detail }) => (current = detail)}
		on:new={new_component} />
	<textarea
		bind:value={components[current_component].source}
		bind:this={textarea} />
</section>
