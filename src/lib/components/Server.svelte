<script>
	import { generate } from "$lib/utils/randID";
	import { auth, db } from "$lib/utils/firebase";
	import {
		doc,
		getDoc,
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

	export let serverID;
	export let user;

	let serverName;
	let message;
	let messages = [];
	let messageInput;
	let loaded;

	const dispatch = createEventDispatcher();
	const serverRef = doc(db, "servers", serverID);

	onMount(async () => {
		const snap = await getDoc(serverRef);
		if (!snap.exists()) {
			leaveServer({ reason: "bad_id" });
			return;
		}

		serverName = snap.data().name;

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

	const leaveServer = function (data = { reason: null }) {
		dispatch("leave", data);
	};
</script>

{#if loaded}
	<div>
		<h1>{serverName}</h1>
		<span
			style="cursor: pointer; text-decoration: underline; color: blue;"
			on:click={() => leaveServer({ reason: "user" })}>Leave</span
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
