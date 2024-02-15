const { NIL, v3: uuidv3, v4: uuidv4, v5: uuidv5 } = require("uuid");

// Check for UUID version 3
function isUUIDv3(uuid) {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-3[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

// Check for UUID version 4
function isUUIDv4(uuid) {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

// Check for UUID version 4 without dashes
function isUUIDv4WithoutDashes(uuid) {
	return /^[0-9a-fA-F]{8}[0-9a-fA-F]{4}4[0-9a-fA-F]{3}[89abAB][0-9a-fA-F]{3}[0-9a-fA-F]{12}$/.test(uuid);
}

// Check for UUID version 5
function isUUIDv5(uuid) {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

function isValidPlatformChatId(platformChatId) {
	return typeof platformChatId === 'string' && /^\d{19}$/.test(platformChatId);
}

function generateRandomString(length, characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_-") {
	const charArray = Array.from(characters);

	let result = "";

	for (let i = 0; i < length; i++) {
		result += charArray[Math.floor(Math.random() * charArray.length)];
	}

	return result;
}

function getDeviceId(deviceOS) {
	const deviceIdMap = {
		1: uuidv4().replace(/-/g, ""),
		2: uuidv4().replace(/-/g, "").toUpperCase(),
		7: uuidv3(uuidv4(), NIL),
		8: uuidv3(uuidv4(), NIL),
		11: uuidv3(uuidv4(), NIL),
		12: uuidv5(uuidv4(), NIL),
		13: `${generateRandomString(43, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890/")}=`
	};

	return deviceIdMap[deviceOS] || uuidv4();
}

async function getInputMode(deviceOS) {
	if (deviceOS === 10 || deviceOS === 11 || deviceOS === 12 || deviceOS === 13) {
		return 3;
	} else if (deviceOS === 1 || deviceOS === 2 || deviceOS === 4 || deviceOS === 14) {
		return 2;
	} else if (deviceOS === 3 || deviceOS === 7 || deviceOS === 8 || deviceOS === 15) {
		return 1;
	} else if (deviceOS === 5 || deviceOS === 6) {
		return 4;
	} else if (deviceOS === 9 || deviceOS === 0) {
		return 0;
	}
}

module.exports = {
	generateRandomString,
	getDeviceId,
	getInputMode,
	isUUIDv3,
	isUUIDv4,
	isUUIDv4WithoutDashes,
	isUUIDv5,
	isValidPlatformChatId
};