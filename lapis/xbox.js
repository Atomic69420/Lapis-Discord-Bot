const { accountsModel, createAccountDefaults } = require("./database.js");
const { Authflow, Titles } = require("prismarine-auth");
const { v4: uuidv4 } = require("uuid");

async function getXboxLiveToken() {
	const flow = new Authflow(undefined, "./authCache", {
		flow: "live",
		authTitle: Titles.MinecraftNintendoSwitch,
		deviceType: "Nintendo",
		doSisuAuth: true
	});

	const authToken = await flow.getXboxToken()
		.catch((err) => {
			console.log(err);
			process.exit(0);
		});

	return authToken;
}

async function getXboxLiveComToken() {
	const flow = new Authflow(undefined, "./authCache", {
		flow: "live",
		authTitle: Titles.MinecraftNintendoSwitch,
		deviceType: "Nintendo",
		doSisuAuth: true
	});

	const authToken = await flow.getXboxToken(`http://xboxlive.com`)
		.catch((err) => {
			console.log(err);
			process.exit(0);
		});

	return authToken;
}

async function getXboxUserData(xuid) {
	const authToken = await getXboxLiveToken();

	if (authToken.errorMsg) return authToken;

	const response = await fetch(`https://peoplehub.xboxlive.com/users/me/people/xuids(${xuid})/decoration/detail,preferredColor,presenceDetail`, {
		method: "GET",
		headers: {
			"x-xbl-contract-version": 4,
			"Accept-Encoding": "gzip, deflate",
			"Signature": "",
			"Accept": "application/json",
			"MS-CV": "unkV+2EFWDGAoQN9",
			"User-Agent": "WindowsGameBar/5.823.1271.0",
			"Accept-Language": "en-US",
			"Authorization": `XBL3.0 x=${authToken.userHash};${authToken.XSTSToken}`,
			"Host": "peoplehub.xboxlive.com",
			"Connection": "Keep-Alive"
		}
	});

	if (response.status === 400) return null;
	if (response.status !== 200) console.log({ errorMsg: `${response.status} ${response.statusText} ${await response.text()}` });

	const user = (await response.json()).people[0];

	user.hexXuid = `000${parseInt(xuid, 10).toString(16).toUpperCase()}`;

	await logXboxUserData(user, "getXboxUserData");

	return user;
}

async function getXboxAccountDataBulk(xuids = []) {
	if (xuids.length === 0) return [];

	const authToken = await getXboxLiveToken();

	const body = JSON.stringify({ xuids: xuids });

	const response = await fetch("https://peoplehub.xboxlive.com/users/me/people/batch/decoration/detail,presenceDetail", {
		method: "POST",
		headers: {
			"x-xbl-contract-version": 4,
			"Accept-Encoding": "gzip, deflate",
			"Signature": "",
			"Accept": "application/json",
			"MS-CV": "unkV+2EFWDGAoQN9",
			"User-Agent": "WindowsGameBar/5.823.1271.0",
			"Accept-Language": "en-US",
			"Authorization": `XBL3.0 x=${authToken.userHash};${authToken.XSTSToken}`,
			"Host": "peoplehub.xboxlive.com",
			"Connection": "Keep-Alive"
		},
		body: body
	});

	if (response.status !== 200) console.log({ errorMsg: `${response.status} ${response.statusText} ${await response.text()}` });

	const users = (await response.json()).people;

	// collect all sorts of user data
	for (const user of users) {
		logXboxUserData(user, "get bulk xbox data");
	}

	return users;
}

async function logXboxUserData(user, source) {
	if (!user || user.errorMsg) return;

	const { xuid, gamertag } = user;

	if (source.includes("Retry")) {
		await logXboxUserData(await getXboxUserData(undefined, xuid), `${source}Retry`);
		return;
	}

	let dbAccount = await accountsModel.findOne({ xuid });

	if (!dbAccount) {
		dbAccount = createAccountDefaults({
			xuid,
			gamertags: [gamertag],
			didLink: false,
			linkData: {},
		});
	} else if (!dbAccount.gamertags.includes(gamertag)) {
		dbAccount.gamertags.push(gamertag);
	}

	await dbAccount.save();
}

module.exports = {
	getXboxAccountDataBulk
}