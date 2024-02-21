"use strict";
const { userSchema, userDefaults } = require("../database.js");
const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { Authflow } = require('prismarine-auth');
const filedit = require('edit-json-file');
const fs = require('fs').promises;
const Discord = require('discord.js')
const path = require('path');
const axios = require('axios');

module.exports = {
    register_command: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Starts a setup with the bot'),
    async execute(client, interaction) {
        const user = await userSchema.findOne({ userid: interaction.user.id })
        const starting = new EmbedBuilder()
        .setTitle('Setup')
        .setDescription(`Starting Process...`)
        interaction.reply({embeds: [starting],ephemeral :true})
        let authFiles;
        try {
        authFiles = await fs.readdir(`./Database/${interaction.guild.id}/Auth`)
        } catch (err) {
            
        }
        
        const alrlink = new EmbedBuilder()
        .setTitle('Setup')
        .setDescription(`You Are Already Linked Please Use /Disconnect To Unlink`)
        try {
        if (authFiles.length > 0) {
            return  interaction.editReply({embeds: [alrlink],ephemeral :true})
        }
    } catch (err) {
    }
            const dirpath = path.join(`Database/${interaction.guild.id}/`, "Setup");
            fs.mkdir(dirpath, { recursive: true }, (err) => {
            })
            const flow = new Authflow("", `Database/${interaction.guild.id}/Auth`, {
				flow: "msal"
			}, async (auethflow) => {
                const embed = new EmbedBuilder()
                .setTitle('Setup')
                .setDescription(`Please Click This [Link](${auethflow.verificationUri}?otc=${auethflow.userCode}) and sign into your account.\n Do This Within <t:${Math.floor(Date.now() / 1000) + auethflow.expiresIn}:R>`)
                fs.writeFile(`./Database/${interaction.guild.id}/Setup/setup.json`, '', (err) => {
                    if (err) {
                        console.log(`error creating file on ${dirpath}\n${err}`)
                        return;
                    }
                })
               interaction.editReply({embeds: [embed],ephemeral :true})
        })
        const database = filedit(`./Database/${interaction.guild.id}/Setup/setup.json`);
        let realmauthdata
        realmauthdata = await flow.getXboxToken("https://pocket.realms.minecraft.net/")
        let xboxauthdata;
        xboxauthdata = await flow.getXboxToken()


        const { userXUID: xuid } = xboxauthdata
        const response = await axios.get(`https://pocket.realms.minecraft.net/worlds`, {
        headers: {
            'Authorization': `XBL3.0 x=${realmauthdata.userHash};${realmauthdata.XSTSToken}`,
            "user-agent": "MCPE/UWP",
            "client-version": "1.20.61",
        }})
        const realmsowned = response.data.servers.filter(realmdata => realmdata.ownerUUID === xuid)
            fs.mkdir(`Database/${interaction.guild.id}/Realm`, { recursive: true }, (err) => {
            })
            fs.writeFile(`./Database/${interaction.guild.id}/Realm/realm.json`, '', (err) => {
            })
            const databaseRealm = filedit(`./Database/${interaction.guild.id}/Realm/realm.json`);
            let realmids = []
            for (const realms of realmsowned) {
                realmids.push(realms.id)
            }
if (realmsowned.length === 0) {
    const norealms = new EmbedBuilder()
        .setTitle('Setup')
        .setDescription(`You Do Not Own Any Realms.`)
        return interaction.editReply({embeds: [norealms],ephemeral :true})
}
databaseRealm.set(`${interaction.guild.id}`, {
    ownsrealms: true,
    realms: realmids
});
databaseRealm.save()
               database.set(`${interaction.guild.id}`, {
                setup: true
            });
            database.save();
            const donelink = new EmbedBuilder()
            .setTitle('Setup')
            .setDescription(`You Have Successfully Linked Your Account.\nTo Unlink You Can Use /Disconnect`)
            return interaction.editReply({embeds: [donelink],ephemeral :true})
    }
}
