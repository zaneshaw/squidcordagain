<script>
	import { generate } from "$lib/utils/randID";
	import { db } from "$lib/utils/firebase";
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

	let serverID;
	let message;
	let messageInput;
	let messagesOutput;

	onMount(() => {
		const q = query(
			collection(db, "servers", "abcdef", "messages"),
			orderBy("sentAt", "asc")
		);
		onSnapshot(q, async (snap) => {
			const msgs = Array.from(snap.docs, (doc) => doc.data()); // Extract documents as array
			const msgsText = Array.from(msgs, (msg) => msg.msg); // Extract messages as array

			messagesOutput.innerHTML = msgsText.join("<br />"); // Join messages with line breaks
			messagesOutput.scrollTop = messagesOutput.scrollHeight; // Scroll to bottom of messages div
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
		setDoc(ref, { msg: message, sentAt: serverTimestamp() });
	};
</script>

<main>
	<h1>Squidcord</h1>
	<div>
		<label for="server-id">Server ID:</label>
		<input type="text" id="server-id" bind:value={serverID} />

		<button on:click={joinServer}>Join</button>
	</div>
	<hr />
	<div>
		<h1>Server name</h1>
		<div id="server-area">
			<div
				id="messages-output"
				rows="10"
				placeholder="Server messages"
				bind:this={messagesOutput}
				disabled
			/>
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
