<script>
	import Server from "$lib/components/Server.svelte";
	import { auth, db, getUser } from "$lib/utils/firebase";
	import { doc, setDoc } from "@firebase/firestore";
	import {
		getAdditionalUserInfo,
		GoogleAuthProvider,
		signInWithPopup,
		onAuthStateChanged,
		signOut,
	} from "@firebase/auth";

	let user = null;
	let serverID;
	let serverIDRef;

	const provider = new GoogleAuthProvider();

	onAuthStateChanged(auth, async (_user) => {
		if (_user) {
			user = await getUser(_user.uid);
		} else {
			user = null;
		}
	});

	const joinServer = function () {
		if (serverIDRef) {
			serverID = serverIDRef;
			serverIDRef = null;
		}
	};

	const signIn = function () {
		signInWithPopup(auth, provider)
			.then(async (result) => {
				const { user } = result;
				console.log(getAdditionalUserInfo(result).isNewUser);

				const userObj = {
					createdAt: user.metadata.creationTime || null,
					email: user.email,
					pfp: user.photoURL,
					signedInAt: user.metadata.lastSignInTime,
					uid: user.uid,
					username: user.displayName || "null",
				};

				await setDoc(doc(db, "users", user.uid), userObj, {
					merge: true,
				});
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const leaveServer = function (e) {
		console.log(`Leaving server... (${e.detail.reason})`);
		serverID = null;
	};
</script>

<main>
	<h1>Squidcord</h1>
	<div>
		<label for="server-id">Server ID:</label>
		<input type="text" id="server-id" bind:value={serverIDRef} />

		<button on:click={joinServer}>Join</button>
	</div>
	<hr />
	{#if user}
		<button on:click={() => signOut(auth)}>Sign Out</button>
		{#if serverID}
			{#key serverID}
				<Server {serverID} {user} on:leave={leaveServer} />
			{/key}
		{/if}
	{:else}
		<button on:click={signIn}>Sign In</button>
	{/if}
</main>

<style>
	:global(#server-area *) {
		box-sizing: border-box;
	}

	input {
		border: 1px solid black;
		border-radius: 3px;
	}
</style>
