<script>
	import { generate } from "$utils/randID";
	import { db } from "$utils/firebase";
	import { doc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";

	let serverID;
	let message;
	let messages = [];
	let messagesOutput;
	let messageInput;

	onSnapshot(doc(db, "servers", "abcdef"), async (doc) => {
		messages = await doc.data().messages;
		messagesOutput.innerHTML = Array.from(
			messages,
			(msg) => msg.text
		).join("<br />");
		messagesOutput.scrollTop = messagesOutput.scrollHeight;
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
