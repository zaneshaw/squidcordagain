<script>
	import { onMount } from "svelte";
	import { inCache } from "$lib/stores/userCache";

	export let data;
	let author;
	let loaded = false;

	onMount(async () => {
		const ref = data.authorRef;

		author = inCache(ref.id).username || "Deleted user";

		loaded = true;
	});
</script>

<div
	style="overflow-wrap: break-word; min-height: 20px; margin-top: 20px; margin-bottom: 20px;"
>
	{#if loaded}
		<span style="font-weight: bold;">{author}</span>
		<span>{data.msg}</span>
	{/if}
</div>
