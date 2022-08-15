<script>
	import { onMount } from "svelte";
	import { inCache } from "$lib/stores/userCache";

	export let msg;
	let author;
	let loaded = false;

	onMount(async () => {
		const ref = msg.data.authorRef;

		author = inCache(ref.id).username || "Deleted user";

		loaded = true;
	});
</script>

<div
	title={msg.id}
	style="overflow-wrap: break-word; min-height: 20px; margin-top: 20px; margin-bottom: 20px;"
>
	{#if loaded}
		<span style="font-weight: bold;">{author}</span>
		<span>{msg.data.msg}</span>
	{/if}
</div>
