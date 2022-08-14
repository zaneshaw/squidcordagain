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
		getDoc,
	} from "firebase/firestore";
	import { onMount } from "svelte";
	import MessageList from "$lib/components/MessageList.svelte";
	import { createEventDispatcher } from "svelte";
	import { inCache, users } from "$lib/stores/userCache";

	export let server;
	export let user;

	let message;
	let messages = [];
	let messageInput;
	let members = [];
	let loaded;

	const dispatch = createEventDispatcher();
	const serverRef = doc(db, "servers", server.id);

	onMount(async () => {
		getMembers();

		const q = query(
			collection(serverRef, "messages"),
			orderBy("sentAt", "asc")
		);
		onSnapshot(q, async (snap) => {
			messages = Array.from(snap.docs, (doc) => doc.data()); // Extract documents as array
		});

		loaded = true;
	});

	const getMembers = async function () {
		const membersRef = server.data.members;

		if (membersRef) {
			for (let i = 0; i < membersRef.length; i++) {
				const memberRef = membersRef[i];
				let member;

				const cache = inCache(memberRef.id);
				if (!!cache) {
					member = cache;
				} else {
					// Save user to cache
					const user = (await getDoc(memberRef)).data();

					console.log(`Saving '${user.username}' to cache...`);
					$users.push(user);
					member = user;
				}

				// Push to 'members' array and trigger reactivity
				members = [...members, member];
			}
		}
	};

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
		<div style="display: flex; flex-direction: row;">
			<div id="message-area" style="flex-grow: 1;">
				<MessageList {messages} />
				<input
					type="text"
					placeholder="Message"
					id="message-input"
					bind:this={messageInput}
					bind:value={message}
					on:keydown={onInput}
				/>
			</div>
			<div style="width: 200px; margin-left: 20px;">
				<h2 style="margin-top: 0px;">Members</h2>
				<ul
					style="margin-top: 0px; padding-left: 0px; list-style-type: none;"
				>
					{#each members as member}
						<li>{member.username}</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
{/if}

<style>
	#message-area {
		width: 1000px;
	}

	#message-input {
		width: 100%;
		height: 30px;
		padding-left: 10px;

		border: 1px solid black;
		border-radius: 3px;
	}
</style>
