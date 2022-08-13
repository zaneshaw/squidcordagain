<script>
	import { createEventDispatcher } from "svelte";

	export let servers;
	const dispatch = createEventDispatcher();

	const toggleServer = function (server) {
		dispatch("toggleServer", server);
	};
</script>

{#each servers as s}
	<div>
		<button on:click={() => toggleServer(s)}>{s.data.name} ({s.id})</button>
	</div>
{:else}
	<p>Not in any servers</p>
{/each}
