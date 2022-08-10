<script>
	import { generate } from "$lib/utils/randID";
	import { auth, db } from "$lib/utils/firebase";
	import {
		getAdditionalUserInfo,
		GoogleAuthProvider,
		signInWithPopup,
	} from "@firebase/auth";
	import {
		doc,
		onSnapshot,
		collection,
		query,
		orderBy,
		setDoc,
		serverTimestamp,
	} from "firebase/firestore";
	import { onMount } from "svelte";
	import Message from "$lib/components/Message.svelte";

	const provider = new GoogleAuthProvider();

	let serverID;
	let message;
	let messages = [];
	let messageInput;
	let messagesOutput;

	onMount(() => {
		const q = query(
			collection(db, "servers", "abcdef", "messages"),
			orderBy("sentAt", "asc")
		);
		onSnapshot(q, async (snap) => {
			messages = Array.from(snap.docs, (doc) => doc.data()); // Extract documents as array

			if (messagesOutput) {
				messagesOutput.scrollTop = messagesOutput.scrollHeight; // Scroll to bottom of messages div
			}
		});
	});

	const joinServer = function () {
		if (serverID) {
			alert(`Joining \`${serverID}\`...`);
		}
	};

	const sendMessage = function () {
		messageInput.value = "";

		const id = generate("0123456789", 20);
		const ref = doc(db, "servers", "abcdef", "messages", id);
		setDoc(ref, {
			author: auth.currentUser.displayName,
			edited: false,
			msg: message,
			sentAt: serverTimestamp(),
		});
	};

	const signIn = function () {
		signInWithPopup(auth, provider)
			.then((result) => {
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

				setDoc(doc(db, "users", user.uid), userObj, { merge: true });
			})
			.catch((error) => {
				console.error(error);
			});
	};
</script>

<main>
	<h1>Squidcord</h1>
	<button on:click={signIn}>Sign In</button>
	<div>
		<label for="server-id">Server ID:</label>
		<input type="text" id="server-id" bind:value={serverID} />

		<button on:click={joinServer}>Join</button>
	</div>
	<hr />
	<div>
		<h1>Server name</h1>
		<div id="server-area">
			<div id="messages-output" bind:this={messagesOutput}>
				{#each messages as msg}
					<Message data={msg} />
				{/each}
			</div>
			<div id="message-area">
				<form on:submit|preventDefault={sendMessage}>
					<input
						type="text"
						placeholder="Message"
						bind:this={messageInput}
						bind:value={message}
					/>
				</form>
			</div>
		</div>
	</div>
</main>

<style>
	#messages-output {
		height: 250px;
		overflow-y: scroll;

		margin-bottom: 4px;
	}

	#server-area * {
		width: 500px;
		box-sizing: border-box;
	}

	#message-area input {
		width: 100%;
	}

	input,
	#messages-output {
		border: 1px solid black;
		border-radius: 3px;
	}
</style>
