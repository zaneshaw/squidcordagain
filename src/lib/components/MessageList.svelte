<script>
	import { afterUpdate } from "svelte";
	import Message from "$lib/components/Message.svelte";

	export let messages;
	let list;

	afterUpdate(() => {
		list.scrollTo(0, list.scrollHeight);
	});
</script>

<div id="messages-output" bind:this={list}>
	{#each messages as msg}
		<Message data={msg} />
	{/each}
</div>

<style>
	#messages-output {
		width: 100%;
		height: 500px;
		padding-left: 10px;
		overflow-y: scroll;

		margin-bottom: 4px;

		border: 1px solid black;
		border-radius: 3px;
	}
</style>
