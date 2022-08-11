<script>
	import { getDoc } from "firebase/firestore";
	import { onMount } from "svelte";
	
	export let data;
	let author;

	onMount(async () => {
		//! OMFG PLEASE FIX THIS. CACHE IT OR SMTHN WTF
		const snap = await getDoc(data.authorRef);
		
		author = snap.exists() ? snap.data().username : "Deleted user";
	});
</script>

{#if author}
	<div style="overflow: auto;">
		<span style="font-weight: bold;">{author}:</span>
		<span>{data.msg}</span>
	</div>
{/if}
