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
	import MessageList from "$lib/components/MessageList.svelte";
	import { createEventDispatcher } from "svelte";

	export let server;
	export let user;

	let message;
	let messages = [];
	let messageInput;
	let loaded;

	const dispatch = createEventDispatcher();
	const serverRef = doc(db, "servers", server.id);

	onMount(async () => {
		const q = query(
			collection(serverRef, "messages"),
			orderBy("sentAt", "asc")
		);
		onSnapshot(q, async (snap) => {
			messages = Array.from(snap.docs, (doc) => doc.data()); // Extract documents as array
		});

		loaded = true;
	});

	const sendMessage = function () {
		const id = generate("0123456789", 20);
		const docRef = doc(serverRef, "messages", id);
		const userRef = doc(db, "users", user.uid);
		setDoc(docRef, {
			authorRef: userRef,
			edited: false,
			msg: message,
			sentAt: serverTimestamp(),
		});
	};

	const onInput = function (e) {
		if (
			e.key !== "Enter" ||
			messageInput.value === null ||
			messageInput.value.trim() === ""
		) {
			return;
		}

		sendMessage();
		messageInput.value = "";
	};

	const leaveServer = function () {
		dispatch("leave", { serverID: server.id });
	};
</script>

{#if loaded}
	<div>
		<h1>{server.data.name}</h1>
		<span
			style="cursor: pointer; text-decoration: underline; color: blue;"
			on:click={() => leaveServer()}>Leave</span
		>
		<div id="server-area">
			<MessageList {messages} />
			<div id="message-area">
				<input
					type="text"
					placeholder="Message"
					bind:this={messageInput}
					bind:value={message}
					on:keydown={onInput}
				/>
			</div>
		</div>
	</div>
{/if}

<style>
	#server-area {
		width: 1000px;
	}

	#message-area input {
		width: 100%;
		height: 30px;
		padding-left: 10px;

		border: 1px solid black;
		border-radius: 3px;
	}
</style>
