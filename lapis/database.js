"use strict";

const mongoose = require("mongoose");

require('dotenv').config();

const accountSchema = new mongoose.Schema({
	xuid: String,
	// list of gamertags ever used with the string
	gamertags: Array,
	// known user device IDs
	deviceIds: Array,
	// known user device OSes
	deviceOs: Array,
	// Xbox UUID (Invis Skin & Invaild Skin)
	xboxUUID: String,
	// Current Runtime ID
	runtimeID: BigInt,
	// Current User Permission
	permission: String,
	// Current Gamertag
	currentGamertag: String,
	// Current Gamemode
	currentGamemode: String
});

const account = mongoose.model("Account", accountSchema);

mongoose.set("strictQuery", true);

mongoose.connect(process.env.MONGO_URL)
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});

function createAccountDefaults(data) {
	if (!data.xuid) return TypeError("Missing XUID");

	return new account({
		_id: data._id,
		xuid: data.xuid,
		gamertags: data.gamertags ?? [],
		deviceIds: data.deviceIds ?? [],
		deviceOs: data.deviceOs ?? [],
		xboxUUID: data.xboxUUID ?? "N/A",
		runtimeID: data.runtimeID ?? 0n,
		permission: data.permission ?? "N/A",
		currentGamertag: data.currentGamertag ?? "N/A",
		currentGamemode: data.currentGamemode ?? "N/A"
	});
}

module.exports = {
	accountsModel: account,
	createAccountDefaults: createAccountDefaults
};