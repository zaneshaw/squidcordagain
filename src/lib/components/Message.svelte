<script>
	import { onMount } from "svelte";
	import { inCache } from "$lib/stores/userCache";
	import { getUser } from "$lib/utils/firebase";

	export let msg;
	let author;
	let loaded = false;

	onMount(async () => {
		const ref = msg.data.authorRef;
		const cached = inCache(ref.id);
		author = cached ? cached.username : (await getUser(ref.id)).username;

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
