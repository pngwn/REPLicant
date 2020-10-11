<script lang="ts">
	import type { Tab } from "./types";

	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher<{ select: number }>();

	export let tabs: Tab[] = [];
	export let current: number = 0;
</script>

<ul>
	{#each tabs as { name, type, id }}
		<li class:active={id === current} on:click={() => dispatch('select', id)}>
			{name}.{type}
		</li>
	{/each}
</ul>

<style>
	.active {
		font-weight: 900;
		text-decoration: underline;
	}
</style>
