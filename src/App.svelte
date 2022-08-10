<script>
	import { generate } from "$utils/randID";
	import { db } from "$utils/firebase";
	import { doc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";

	let serverID;
	let message;
	let messages = [];
	let messageInput;

	onSnapshot(doc(db, "servers", "abcdef"), (doc) => {
		messages = doc.data().messages;
	});

	const joinServer = function () {
		if (serverID) {
			alert(`Joining \`${serverID}\`...`);
		}
	};

	const sendMessage = function () {
		messageInput.value = "";

		const msg = {
			id: generate("0123456789", 20),
			text: message,
		};

		const ref = doc(db, "servers", "abcdef");
		updateDoc(ref, "messages", arrayUnion(msg));
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
			<textarea
				rows="10"
				placeholder="Server messages"
				value={Array.from(messages, (msg) => msg.text).join("\n")}
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
	textarea {
		resize: none;
	}

	#server-area > * {
		width: 500px;
		box-sizing: border-box;
	}

	#message-area {
		display: flex;
		column-gap: 4px;
	}

	#message-area > *:nth-child(1) {
		flex-grow: 1;
	}
</style>
