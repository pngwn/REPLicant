<script lang="ts">
	import type { Tab } from "./types";

	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher<{ select: number; new: undefined }>();

	export let tabs: Tab[] = [];
	export let current: number = 0;
</script>

<ul>
	{#each tabs as { name, type, id }}
		<li class:active={id === current} on:click={() => dispatch('select', id)}>
			{name}.{type}
		</li>
	{/each}
	<li><button on:click={() => dispatch('new')}>+</button></li>
</ul>

<style>
	.active {
		font-weight: 900;
		text-decoration: underline;
	}
</style>
