<script lang="ts">
	import type { Component } from "./types";

	export let components: Component[] = [];
	export let current: number = 0;

	$: current_component = components.findIndex(({ id }) => id === current);
</script>

<section>
	<textarea bind:value={components[current_component].source} />
</section>
