<script>
	import { generate } from "$utils/randID";

	let serverID;

	const joinServer = function () {
		if (serverID) {
			alert(`Joining \`${serverID}\`...`);
		}
	};

</script>

<main>
	<h1>Squidcord</h1>
	<div>
		<label for="server-id">Server ID:</label>
		<input type="text" id="server-id" bind:value={serverID} />

		<button on:click={joinServer}>Join</button>
	</div>
	<hr>
	<div>
		<h1>Server name</h1>
		<div id="server-area">
			<textarea rows="10" placeholder="Server messages" />
			<div id="message-area">
				<input
					type="text"
					bind:value={serverID}
					placeholder="Message"
				/>
				<button>Send</button>
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
