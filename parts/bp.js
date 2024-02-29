const { createClient } = require("bedrock-protocol");
const { isValidPlatformChatId } = require('./functions')
function createPartbp(realmcode, guildId) {
	const options = {
        profilesFolder: `./Database/${guildId}/AuthBot`,
		skipPing: true,
        conLog: process.env.NODE_ENV === "development" ? console.log : null,
		skinData: {
			CurrentInputMode: 3,
			DefaultInputMode: 3,
			DeviceModel: "Xbox Series X",
			DeviceOS: 11,
		},
		realms: {
			realmInvite: realmcode
		}
	};
    const client = createClient(options)
    client.on("kick", (data) => {
	});
    client.on("error", (error) => {
		console.log(`Got error on ${guildId}\n${error}`)
	});
    client.on("close", () => {
	});
	client.on("player_list", (data) => {
		if (data.records.type === "add") {
			data.records.records.forEach((packet) => {
				if (packet.build_platform != 12 && packet.platform_chat_id.length != 0) {
					//console.log(`[${packet.xbox_user_id}] Not on NintendoSwitch & has Platform Chat ID. [T1]`);
					client.command(`kick "${packet.xbox_user_id}" [Lapis Bot Automod]\nInvaild information sent. (0x3f1)`, 0)
				}
				if (!isValidPlatformChatId(packet.platform_chat_id) && packet.build_platform === 12) {
					//console.log(`[${packet.xbox_user_id}] Invaild Platform Chat ID. [T2]`);
					client.command(`kick "${packet.xbox_user_id}" [Lapis Bot Automod]\nInvaild information sent. (0x3f2)`, 0)
				}
			})
		}
	})
    client.command = async (cmd) => {
        client.write("command_request", {
			command: cmd,
			origin: {
				type: 0,
				uuid: "",
				request_id: ""
			},
			internal: false,
			version: 600
		});
	};
    client.text = async (msg) => {
        client.write("text", {
			type: "chat",
			needs_translation: false,
			source_name: "",
			message: msg,
			xuid: "",
			platform_chat_id: ""
		});
    }
    return client;
}
module.exports = {
    createPartbp: createPartbp
}