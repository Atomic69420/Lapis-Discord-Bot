"use strict";
const { userSchema, userDefaults } = require("../database.js");
const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { Authflow } = require("prismarine-auth")
const filedit = require('edit-json-file');
const fs = require('fs');
const Discord = require('discord.js')
const path = require('path');

module.exports = {
    register_command: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Starts a setup with the bot'),
    async execute(client, interaction) {
        const user = await userSchema.findOne({ userid: interaction.user.id })
        if (user.perms) {
            const dirpath = path.join(`Database/${interaction.guild.id}/`, "Setup");
            fs.mkdir(dirpath, { recursive: true }, (err) => {
                if (err) {
                    console.log(`error creating directory on ${dirpath}\n${err}`)
                    return;
                }
            })
            const flow = new Authflow(undefined, `Database/${interaction.guild.id}/Auth`, {
				flow: "msal",
				authTitle: "bc98e2f6-87ff-4dfb-84d5-7b1e07e8c5ef"
			}, async (auethflow) => {
                const embed = new EmbedBuilder()
                .setTitle('Setup')
                .setDescription(`Please Click This [Link](${auethflow.verificationUri}?otc=${auethflow.userCode}) and sign into your account.\n Do This Within <t:${Math.floor(Date.now() / 1000) + auethflow.expiresIn}:R>`)
                let realmauthdata
                realmauthdata = await flow.getXboxToken("https://pocket.realms.minecraft.net/");
                fs.writeFile(`${dirpath}setup.json`, '', (err) => {
                    if (err) {
                        console.log(`error creating file on ${dirpath}\n${err}`)
                        return;
                    }
                })
               const database = filedit(`./Database/${interaction.guild.id}/Setup/setup.json`);
               database.set(`${interaction.guild.id}`, {
                setup: true
            });
            database.save();
               return await interaction.reply({embeds: [embed],ephemeral :true})
        })
    }
    }
}