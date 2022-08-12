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

	export let user;
	let message;
	let messages = [];
	let messageInput;

	onMount(() => {
		const q = query(
			collection(db, "servers", "abcdef", "messages"),
			orderBy("sentAt", "asc")
		);
		onSnapshot(q, async (snap) => {
			messages = Array.from(snap.docs, (doc) => doc.data()); // Extract documents as array
		});
	});

	const sendMessage = function () {
		const id = generate("0123456789", 20);
		const docRef = doc(db, "servers", "abcdef", "messages", id);
		const userRef = doc(db, "users", user.uid);
		setDoc(docRef, {
			authorRef: userRef,
			edited: false,
			msg: message,
			sentAt: serverTimestamp(),
		});
	};

	const onInput = (e) => {
		if (e.key !== "Enter" || messageInput.value === null || messageInput.value.trim() === "") {
			return;
		}

		sendMessage();
		messageInput.value = "";
	};
</script>

<div>
	<h1>Server name</h1>
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
