const { createClient } = require("bedrock-protocol");
function createPartbp(realm, guildId) {
	const options = {
		host: realm.ip,
		port: realm.port,
        profilesFolder: `./Database/${guildId}/Auth`,
		skipPing: true,
        conLog: process.env.NODE_ENV === "development" ? console.log : null,
		skinData: {
			CurrentInputMode: 3,
			DefaultInputMode: 3,
			DeviceModel: "Xbox Series X",
			DeviceOS: 11,
		}
	};
    const client = createClient(options)
    client.on("kick", (data) => {
	});
    client.on("error", (error) => {
	});
    client.on("close", () => {
	});
    client.command = (cmd) => {
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
    client.text = (msg) => {
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