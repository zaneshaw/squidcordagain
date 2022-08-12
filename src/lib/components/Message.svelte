<script>
	import { getDoc } from "firebase/firestore";
	import { onMount } from "svelte";
	import { users, timeout } from "$lib/stores/cache";

	// onMount(async () => {
	// 	if ($posts.length < 1 || $timeout == true) {
	// 		const res = await fetch(apiBaseUrl + "/blogposts");
	// 		$posts = await res.json();
	// 	}
	// });

	export let data;
	let author;
	let loaded = false;

	onMount(async () => {
		const ref = data.authorRef;

		const user = inCache(ref.id);
		if (user) {
			// Load from cache
			author = user.username;
		} else {
			const snap = await getDoc(ref);
			const username = snap.data().username;
			author = snap.exists() ? username : "Deleted user";

			// Save user to cache
			$users.push({
				uid: ref.id,
				username: username,
			});
		}

		loaded = true;
	});

	const inCache = function (uid) {
		return $users.find((x) => x.uid === uid);
	};
</script>

<div
	style="overflow-wrap: break-word; min-height: 20px; margin-top: 20px; margin-bottom: 20px;"
>
	{#if loaded}
		<span style="font-weight: bold;">{author}</span>
		<span>{data.msg}</span>
	{/if}
</div>
