<script>
	import { onMount } from "svelte";
	import { inCache, users } from "$lib/stores/userCache";
	import { getUser } from "$lib/utils/firebase";

	export let msg;
	let author;
	let loaded = false;

	onMount(async () => {
		const ref = msg.data.authorRef;
		const cached = inCache(ref.id);
		author = inCache(ref.id) ? cached.username : (await addToCache(ref)).username;

		loaded = true;
	});

	const addToCache = async function (userRef) {
		//! Unnecessary duplicate read
		const user = await getUser(userRef.id);

		// Late check
		if (!inCache(userRef.id)) {
			console.log(`Caching '${user.username}'...`);
			$users.push(user);
		}

		return user;
	};
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
