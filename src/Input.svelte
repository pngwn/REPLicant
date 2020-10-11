<script lang="ts">
	import Tabs from "./Tabs.svelte";

	import type { Component } from "./types";

	export let components: Component[] = [];
	export let current: number = 0;

	$: current_component = components.findIndex(({ id }) => id === current);
	$: tabs = components.map(({ id, name, type }) => ({ id, name, type }));
</script>

<section>
	<Tabs {tabs} {current} on:select={({ detail }) => (current = detail)} />
	<textarea bind:value={components[current_component].source} />
</section>
