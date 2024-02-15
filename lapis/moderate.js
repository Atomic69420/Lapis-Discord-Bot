const {
	createClient
} = require("bedrock-protocol");

const {
	accountsModel
} = require("./database.js");

const {
	v4: uuidv4
} = require("uuid");

// File Imports
const config = require("./config.json");

const fs = require('fs');

const {
	generateRandomString,
	getDeviceId,
	getInputMode
} = require("./util.js");

const {
	getXboxAccountDataBulk
} = require("./xbox.js");

const {
	skinVaildate
} = require("./modules/skin.js");

const {
	deviceVaildate
} = require("./modules/device.js");

const {
	emoteVaildate
} = require("./modules/emote.js");

const {
	moveVaildate
} = require("./modules/move.js");

const {
	animateVaildate
} = require("./modules/animate.js");

const {
	handleFunctions
} = require("./handler.js");

module.exports.moderate = async (realmData) => {
	if (config.debug) console.log(`Debug mode is enabled. No players will be kicked or punished when enabled.`);

	console.log('Joining');

	let options = {
		host: realmData.ip,
		port: realmData.port,
		profilesFolder: "./authCache",
		skipPing: true,
		skinData: {
			CurrentInputMode: getInputMode(config.deviceOS),
			DefaultInputMode: getInputMode(config.deviceOS),
			DeviceId: getDeviceId(config.deviceOS),
			DeviceModel: 'xbox_series_x',
			DeviceOS: config.deviceOS,
			PlatformOnlineId: (config.deviceOS === 12) ? generateRandomString(19, "1234567890") : "",
			PlatformUserId: (config.deviceOS === 12) ? uuidv4() : "",
			PlayFabId: generateRandomString(16, "qwertyuiopasdfghjklzxcvbnm12345678901")
		}
	}

	const client = createClient(options);

	handleFunctions(client);

	let wasKicked;

	client.on("kick", (data) => {
		wasKicked = true;

		console.log(`Triggered! ${JSON.stringify(data)}`);

		process.exit(1);
	});

	client.on("error", (error) => {
		if (wasKicked) return;

		client.emit("kick", {
			message: String(error)
		});

		process.exit(1);
	});

	client.on("close", () => {
		if (wasKicked) return;

		client.emit("kick", {
			message: "Lost connection to server"
		});

		process.exit(1);
	});

	process.on("warning", (warning) => {
		console.warn(warning);
	});

	process.on("unhandledRejection", (error) => {
		console.error(error);
	});

	process.on("uncaughtException", (error, origin) => {
		console.error(`Error has occured: ${error}. Origin of error: ${origin}`);
	});

	const userMap = {};

	client.on("player_list", async (packet) => {
		if (packet.records.type === "remove") return;

		const records = packet.records.records;

		const xuids = [];

		for (const player of records) {
			const {
				xbox_user_id: xuid
			} = player;

			if (
				client.profile.xuid === xuid ||
				xuid?.length !== 16 ||
				!xuid?.startsWith("2")
			) continue;

			userMap[player.username] = xuid;

			xuids.push(xuid);

			getXboxAccountDataBulk(xuids);

			skinVaildate(player, null, client, "playerList");
			deviceVaildate(player, null, client, "playerList");
		}

		const dbAccount = await accountsModel.findOne({
			xuid: records.xbox_user_id
		});

		if (!dbAccount) return;
	});

	client.on("add_player", async (packet) => {
		const {
			username,
			device_id,
			device_os,
			uuid,
			runtime_id,
			permission_level,
			gamemode
		} = packet;

		console.log(`[${username}] Joined on ${device_os} (${device_id})`)

		const xuid = userMap[username];

		if (
			client.profile.xuid === xuid ||
			xuid?.length !== 16 ||
			!xuid?.startsWith("2")
		) return;

		const dbAccount = await accountsModel.findOne({
			xuid: xuid
		});

		if (!dbAccount) return;

		await deviceVaildate(packet, dbAccount, client, "playerAdd");

		if (!dbAccount.deviceOs) dbAccount.deviceOs = [];

		if (!dbAccount.deviceIds.includes(device_id)) dbAccount.deviceIds.push(device_id);

		if (!dbAccount.deviceOs.includes(device_os)) dbAccount.deviceOs.push(device_os);

		if (!dbAccount.xboxUUID) dbAccount.xboxUUID = uuid;

		if (!dbAccount.runtimeID) dbAccount.runtimeID = 0n;

		if (!dbAccount.permission) dbAccount.permission = 'member';

		if (!dbAccount.currentGamertag) dbAccount.currentGamertag = username;

		if (!dbAccount.currentGamemode) dbAccount.currentGamemode = gamemode;

		// These will need automatic updating...
		dbAccount.runtimeID = runtime_id;

		dbAccount.permission = permission_level;

		dbAccount.currentGamertag = username;

		dbAccount.currentGamemode = gamemode;

		dbAccount.save();
	});

	client.on('player_skin', async (packet) => {
		const dbAccount = await accountsModel.findOne({
			xboxUUID: packet.uuid
		});

		if (!dbAccount) return;

		vaildateSkinData(packet, dbAccount, client, "playerSkin");
	})

	client.on('emote', async (packet) => {
		const dbAccount = await accountsModel.findOne({
			xuid: packet.xuid
		});

		if (!dbAccount) return;

		emoteVaildate(packet, dbAccount, client);
	})

	client.on('animate', async (packet) => {
		const dbAccount = await accountsModel.findOne({
			runtimeID: packet.runtime_entity_id
		});

		if (!dbAccount) {
			console.log(`No account linked.`);
			return;
		};

		animateVaildate(packet, dbAccount, client);
	});

	client.on('move_player', async (packet) => {
		const dbAccount = await accountsModel.findOne({
			runtimeID: packet.runtime_id
		});

		if (!dbAccount) return;

		moveVaildate(packet, dbAccount, client);
	})

	client.on('start_game', async () => {
		console.log('Joined');
	})
}