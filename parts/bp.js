const { createClient } = require("bedrock-protocol");
const { isValidPlatformChatId } = require('./functions')
const config = require("./config.json");
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
	client.on("player_list", async (data) => {
		if (data.records.type === "add") {
			data.records.records.forEach((packet) => {
				if (packet.build_platform != 12 && packet.platform_chat_id.length != 0) {
					// console.log(`[${packet.xbox_user_id}] Not on NintendoSwitch & has Platform Chat ID. [T1]`);
					client.command(`kick "${packet.xbox_user_id}" [${config.prefix}]\nInvaild information sent. (0x3f1)`, 0)
				}
				if (!isValidPlatformChatId(packet.platform_chat_id) && packet.build_platform === 12) {
					// console.log(`[${packet.xbox_user_id}] Invaild Platform Chat ID. [T2]`);
					client.command(`kick "${packet.xbox_user_id}" [${config.prefix}]\nInvaild information sent. (0x3f2)`, 0)
				}
				if (!packet.skin_data.skin_id.includes(packet.skin_data.play_fab_id)) {
					// console.log(`[${packet.xbox_user_id}] Bad skin information [T1]`);
					client.command(`kick "${packet.xbox_user_id}" [${config.prefix}]\nInvaild skin information sent.\nThis could be because\n- You haven't connected to PlayFab API correctly.\n- You are using classic skin (Change skin)\nTry relaunching Minecraft to fix this. (0x3f3)`, 0);
				}
	

				if (packet.skin_data.full_skin_id != packet.skin_data.skin_id) {
					// console.log(`[${packet.xbox_user_id}] Full Skin ID & Skin ID do not match. [T2]`);
					client.command(`kick "${packet.xbox_user_id}" [${config.prefix}]\nInvaild skin information sent. (0x3f4)`, 0);
				}
				
				
				if ((packet.skin_data.skin_data.width > 512 || packet.skin_data.skin_data.width < 64)) {
					// console.log(`[${packet.xbox_user_id}] Bad skin information [T3]`);
					client.command(`kick "${packet.xbox_user_id}" [${config.prefix}]\nInvaild skin information sent. (0x3f5)`, 0);
				}
				
				
				if ((packet.skin_data.skin_data.height > 512 || packet.skin_data.skin_data.height < 64)) {
					// console.log(`[${packet.xbox_user_id}] Bad skin information [T4]`);
					client.command(`kick "${packet.xbox_user_id}" [${config.prefix}]\nInvaild skin information sent. (0x3f6)`, 0);
				}
				
				
				if (!packet.skin_data.skin_resource_pack.includes(packet.skin_data.play_fab_id)) {
					// console.log(`[${packet.xbox_user_id}] Bad skin information [T5]`);
					client.command(`kick "${packet.xbox_user_id}" [${config.prefix}]\nInvaild skin information sent.\nThis could be because\n- You haven't connected to PlayFab API correctly.\n- You are using classic skin (Change skin)\nTry relaunching Minecraft to fix this. (0x3f7)`, 0);
				}
				
				
				if ((packet.skin_data.play_fab_id > 16 || packet.skin_data.play_fab_id < 16)) {
					// console.log(`[${packet.xbox_user_id}] Bad skin information [T6]`);
					client.command(`kick "${packet.xbox_user_id}" [${config.prefix}]\nInvaild skin information sent. (0x3f8)`, 0);
				}
				
				
				if ((packet.skin_data.premium === true && packet.skin_data.skin_resource_pack.includes('"default" : "geometry.n3"\n') || packet.skin_data.skin_id.includes('#'))) {
					// console.log(`[${packet.xbox_user_id}] Bad skin information [T7]`);
					client.command(`kick "${packet.xbox_user_id}" [${config.prefix}]\nInvaild skin information sent.\nThis could be because you are using a custom skin.\nTry changing to steve. (0x3f9)`, 0);
				}
				
				
				if ((!packet.skin_data.skin_resource_pack.includes(packet.skin_data.play_fab_id) || !packet.skin_data.skin_id.includes(packet.skin_data.play_fab_id) || !packet.skin_data.full_skin_id.includes(packet.skin_data.play_fab_id) || !packet.skin_data.geometry_data.includes(packet.skin_data.play_fab_id))) {
					// console.log(`[${packet.xbox_user_id}] Bad skin information [T8]`);
					client.command(`kick "${packet.xbox_user_id}" [${config.prefix}]\nInvaild skin information sent.\nThis could be because\n- You haven't connected to PlayFab API correctly.\n- You are using classic skin (Change skin)\nTry relaunching Minecraft to fix this. (0x3f11)`, 0);
				}
				
				
				if ((packet.skin_data.geometry_data_version.length < 5 || packet.skin_data.geometry_data_version.length > 6)) {
					// console.log(`[${packet.xbox_user_id}] Bad skin information [T9]`);
					client.command(`kick "${packet.xbox_user_id}" [${config.prefix}]\nInvaild skin information sent. (0x3f11)`, 0);
				}
				
				
				if (packet.skin_data.skin_resource_pack.includes(' "default" : "geometry.humanoid"\n')) {
					// console.log(`[${packet.xbox_user_id}] Bad skin information [T10]`);
					client.command(`kick "${packet.xbox_user_id}" [${config.prefx}]\nInvaild skin information sent.\nThis could be becuase\nYou are wearing a corrupt skin or invisible skin.\nTry changing skins to fix this. (0x3f12)`, 0);
				}
				
				if (!packet.skin_data.skin_resource_pack.includes("default")) {
					// console.log(`[${packet.xbox_user_id}] Bad skin information [T11]`);
					client.command(`kick "${packet.xbox_user_id}" [${config.prefix}]\nInvaild skin information sent.\nThis could be becuase\nYou are wearing a corrupt skin.\nTry changing skins to fix this. (0x3f13)`, 0);
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