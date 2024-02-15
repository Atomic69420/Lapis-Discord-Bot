const {
	accountsModel
} = require("../database.js");

const {
	isUUIDv3,
	isUUIDv4WithoutDashes,
	isUUIDv5,
	isValidPlatformChatId
} = require("../util.js");

const config = require("../config.json");

async function deviceVaildate(packet, dbAccount, client, packetType) {
	if (packetType === "playerList") {
		if (packet.build_platform != 12 && packet.platform_chat_id.length != 0) {
			console.log(`[${packet.xbox_user_id}] Not on NintendoSwitch & has Platform Chat ID [T1] (plrListD)`);
			if (!config.debug) client.sendCommand(`kick "${packet.xbox_user_id}" Invaild information sent. [T1] (plrListD)`, 0)
		}

		if (!isValidPlatformChatId(packet.platform_chat_id) && packet.build_platform === 12) {
			console.log(`[${packet.xbox_user_id}] Invaild Platform Chat ID [T2] (plrListD)`);
			if (!config.debug) client.sendCommand(`kick "${packet.xbox_user_id}" Invaild information sent. [T2] (plrListD)`, 0)
		}
	} else if (packetType === "playerAdd") {
		const {
			device_id,
			device_os
		} = packet;

		const accounts = await accountsModel.find({}).exec();

		accounts.forEach(dbAccount2 => {
			const linkedDeviceIds = dbAccount2.deviceIds;
			const gamertags = dbAccount2.gamertags;
			const lastGamertag = gamertags[gamertags.length - 1];

			if (linkedDeviceIds && Array.isArray(linkedDeviceIds)) {
				if (linkedDeviceIds.length > 4 && lastGamertag === packet.username) {
					console.log(`[${dbAccount.xuid}] Had too many Device IDs. [T1] (plrAdd)`);
					if (!config.debug) client.sendCommand(`kick "${dbAccount.xuid}" You have been on this realm on too many device. [T1] (plrAdd)`, 0);
				}

				linkedDeviceIds.forEach(linkedDeviceId => {
					if (linkedDeviceId === device_id) {
						if (lastGamertag === packet.username) return;

						console.log(`[${dbAccount.xuid}] Had a duplicate Device ID(s). Last account was: ${lastGamertag}. (plrAdd)`);
						if (!config.debug) client.sendCommand(`kick "${dbAccount.xuid}" You had a account joined already. (Last Account: §b${lastGamertag}§r) [T2] (plrAdd)`, 0);
					}
				});
			}
		});

		if (dbAccount.deviceOs.length > 4) {
			console.log(`[${dbAccount.xuid}] Had too many device types in the database [T3]. (plrAdd)`);
			if (!config.debug) client.sendCommand(`kick "${dbAccount.xuid}" You have been on this realm on too many devices. [T3] (plrAdd)`, 0);
			return;
		}

		switch (device_os) {
			case "Xbox":
				if (!device_id.endsWith("=")) {
					console.log(`[${dbAccount.xuid}] User on Xbox without the right Device ID. [T4] (plrAdd)`);
					if (!config.debug) client.sendCommand(`kick "${dbAccount.xuid}" Invalid ID. [T4] (plrAdd)`, 0);
					return;
				}

				break;
			case "Android":
				if (!isUUIDv4WithoutDashes(device_id)) {
					console.log(`[${dbAccount.xuid}] User on Android without the right Device ID. [T4] (plrAdd)`);
					if (!config.debug) client.sendCommand(`kick "${dbAccount.xuid}" Invalid ID. [T4] (plrAdd)`, 0);
					return;
				}

				break;
			case "IOS":
				if (!isUUIDv4WithoutDashes(device_id) && /^[A-Z0-9]{32}$/.test(device_id)) {
					console.log(`[${dbAccount.xuid}] User on iOS without the right Device ID. [T4] (plrAdd)`);
					if (!config.debug) client.sendCommand(`kick "${dbAccount.xuid}" Invalid ID. [T4] (plrAdd)`, 0);
					return;
				}

				break;
			case "Orbis":
			case "Win10":
			case "Win32":
				if (!isUUIDv3(device_id)) {
					console.log(`[${dbAccount.xuid}] User with the wrong Device ID. [T4] (plrAdd)`);
					if (!config.debug) client.sendCommand(`kick "${dbAccount.xuid}" Invalid ID. [T4] (plrAdd)`, 0);
					return;
				}

				break;
			case "NintendoSwitch":
				if (!isUUIDv5(device_id)) {
					console.log(`[${dbAccount.xuid}] User on Nintendo Switch with the wrong Device ID. [T4] (plrAdd)`);
					if (!config.debug) client.sendCommand(`kick "${dbAccount.xuid}" Invalid ID. [T4] (plrAdd)`, 0);
					return;
				}

				if (!isValidPlatformChatId(packet.platform_chat_id)) {
					console.log(`[${dbAccount.xuid}] No Platform Chat ID [T5] (plrAdd)`);
					if (!config.debug) client.sendCommand(`kick "${dbAccount.xuid}" Invaild information sent. [T5] (plrAdd)`, 0)
				}

				break;
		}

		if (device_os === "Unknown" || device_os === "Dedicated" || device_os === "Linux") {
			console.log(`[${dbAccount.xuid}] Unsupported device [T6] (plrAdd)`);
			if (!config.debug) client.sendCommand(`kick "${dbAccount.xuid}" Unsupported device model. [T6] (plrAdd)`, 0);
			return;
		}

		if (device_os != 'NintendoSwitch' && packet.platform_chat_id.length != 0) {
			console.log(`[${dbAccount.xuid}] Not on NintendoSwitch & has Platform Chat ID [T7] (plrAdd)`);
			if (!config.debug) client.sendCommand(`kick "${dbAccount.xuid}" Invaild information sent. [T7] (plrAdd)`, 0)
		}
	}
}

module.exports = {
	deviceVaildate: deviceVaildate
};
