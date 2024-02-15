"use strict";
require('dotenv').config();
const log = new require('./utils/logger.js')
const logger = new log("database") 
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
	userid: String,
    perms: Boolean,
});
const discordUser = mongoose.model("discordUser", userSchema);

mongoose.set("strictQuery", true);
logger.info('DB connection established')
mongoose.connect(process.env.MONGODB)
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
        function userDefaults(data) {
        return new discordUser({
             _id: data._id,
             userid: data.userid,
             perms: false ?? false
        });
    }
module.exports = {
    userDefaults: userDefaults,
    userSchema: discordUser

}