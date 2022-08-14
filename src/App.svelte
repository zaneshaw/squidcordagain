<script>
	import Server from "$lib/components/Server.svelte";
	import ServerList from "$lib/components/ServerList.svelte";
	import { auth, db, getUser } from "$lib/utils/firebase";
	import {
		arrayRemove,
		arrayUnion,
		doc,
		getDoc,
		setDoc,
		updateDoc,
	} from "@firebase/firestore";
	import {
		getAdditionalUserInfo,
		GoogleAuthProvider,
		signInWithPopup,
		onAuthStateChanged,
		signOut,
	} from "@firebase/auth";

	let user;
	let openServer;
	let serverIDRef;
	let servers;
	let loading = true;

	const provider = new GoogleAuthProvider();

	onAuthStateChanged(auth, async (_user) => {
		if (_user) {
			syncUser(_user.uid)
		} else {
			user = null;
		}
		loading = false;
	});

	const joinServer = async function () {
		if (serverIDRef && user) {
			loading = true;

			const userRef = doc(db, "users", user.uid);
			const serverRef = doc(db, "servers", serverIDRef);
			const server = await getDoc(serverRef);

			if (server.exists()) {
				serverIDRef = null;

				await updateDoc(userRef, {
					servers: arrayUnion(serverRef),
				});
				await updateDoc(serverRef, {
					members: arrayUnion(userRef),
				});

				await syncUser();
			} else {
				console.error(`Server doesn't exist! (${serverIDRef})`);
			}

			loading = false;
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
					servers: [],
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

	const leaveServer = async function (e) {
		loading = true;

		const userRef = doc(db, "users", user.uid);
		const serverRef = doc(db, "servers", e.detail.serverID);
		await updateDoc(userRef, {
			servers: arrayRemove(serverRef),
		});
		await updateDoc(serverRef, {
			members: arrayRemove(userRef),
		});

		openServer = null;
		await syncUser();

		loading = false;
	};

	const getServers = async function () {
		const serversRef = user.servers;
		let _servers = [];

		if (serversRef) {
			for (let i = 0; i < serversRef.length; i++) {
				const server = serversRef[i];
				const test = await getDoc(server);

				_servers.push({ id: test.id, data: test.data() });
			}
		}
		servers = _servers;
	};

	const syncUser = async function (uid = user.uid) {
		user = await getUser(uid);
		await getServers();
	};

	const toggleServer = function (e) {
		const server = e.detail;

		if (openServer == server) {
			openServer = null;
		} else {
			openServer = e.detail;
		}
	};
</script>

<main>
	<h1>Squidcord</h1>
	{#if loading}
		<p>Loading...</p>
	{:else if user}
		<button on:click={() => signOut(auth)}>Sign Out</button>
		<br /><br />
		<div>
			<label for="server-id">Server ID:</label>
			<input type="text" id="server-id" bind:value={serverIDRef} />

			<button on:click={joinServer}>Join</button>
		</div>
		<hr />
		{#if servers}
			<h2>Server list</h2>
			<ServerList {servers} on:toggleServer={toggleServer} />
			<hr />
		{/if}

		{#if openServer}
			<Server server={openServer} {user} on:leave={leaveServer} />
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
