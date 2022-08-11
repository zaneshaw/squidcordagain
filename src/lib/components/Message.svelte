<script>
	import { getDoc } from "firebase/firestore";
	import { onMount } from "svelte";

	export let data;
	let author = "";

	onMount(async () => {
		const snap = await getDoc(data.authorRef);

		author = snap.exists() ? snap.data().username : "Deleted user";
	});
</script>

<div style="overflow: auto;">
	<span style="font-weight: bold;">{author}:</span>
	<span>{data.msg}</span>
</div>
