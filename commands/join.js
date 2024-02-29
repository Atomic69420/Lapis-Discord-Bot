"use strict";
const { userSchema, userDefaults } = require("../database.js");
const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('@discordjs/builders');
const { Authflow } = require('prismarine-auth');
const filedit = require('edit-json-file');
const Discord = require('discord.js');
const fs = require('fs').promises;
const axios = require('axios')

module.exports = {
    register_command: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Joins A Minecraft Bedrock Realm Owned By The Main Account')
        .addStringOption(option =>
            option.setName('realmcode')
                .setDescription('The Realm Code Of Your Realm')
                .setRequired(true)
                .setMinLength(11)
                .setMaxLength(11)),
    async execute(client, interaction) {
        const user = await userSchema.findOne({ userid: interaction.user.id });
        let authFiles;
        try {
            authFiles = await fs.readdir(`./Database/${interaction.guild.id}/Auth`)
            } catch (err) {
                
            }
            let authFilesBot;
            try {
            authFilesBot = await fs.readdir(`./Database/${interaction.guild.id}/AuthBot`)
            } catch (err) {
                
            }
            const notsetupmain = new EmbedBuilder()
        .setTitle('Realm Join')
        .setDescription(`You Are Currently Not Linked With A Main Account. Use /setup To Setup A Main Account.`)
        const notownedrealm = new EmbedBuilder()
        .setTitle('Realm Join')
        .setDescription(`The Realm Code You Intered Does Not Match The Realm You Selected.`)
        const invalidcode = new EmbedBuilder()
        .setTitle('Realm Join')
        .setDescription(`The Entered Realm Code Is Invalid.`)
        const notsetupbot = new EmbedBuilder()
        .setTitle('Realm Join')
        .setDescription(`You Are Currently Not Linked With A Bot Account. Use /setup To Setup A Bot Account.`)
        const starting = new EmbedBuilder()
            .setTitle('Realm Join')
            .setDescription(`Starting Process...`);
        await interaction.reply({ embeds: [starting], ephemeral: true });
const guildId = Math.floor(interaction.guild.id / 100) * 100;
        const databaseRealm = filedit(`./Database/${interaction.guild.id}/Realm/realm.json`);
        const realmNames = databaseRealm.get(`${guildId}`)?.realmnames || [];
        const realmIds = databaseRealm.get(`${guildId}`)?.realmid || [];
        const realmselectmenu = new StringSelectMenuBuilder()
            .setCustomId('realmenu')
            .setPlaceholder('Select Realm');
            const options = realmNames.map((realmName, index) => ({
                label: realmName,
                description: `Realm ID: ${realmIds[index]}`,
                value: realmIds[index].toString()
            }));
            
            realmselectmenu.addOptions(options);
            const realmselect = new ActionRowBuilder()
            .addComponents(
                realmselectmenu,
            );
        try {
            if (authFiles === undefined || authFiles.length === 0) {
                return interaction.editReply({ embeds: [notsetupmain], ephemeral: true });
            }
            if (authFilesBot === undefined || authFilesBot.length === 0) {
                return interaction.editReply({ embeds: [notsetupbot], ephemeral: true });
            }
            const select = new EmbedBuilder()
            .setTitle('Realm Join')
            .setDescription('Select A Realm')
            await interaction.editReply({ embeds: [select], components: [realmselect], ephemeral: true });
            const filter = i => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
            collector.on('collect', async i => {
                if (i.isStringSelectMenu()) {
                    const flow = new Authflow("", `Database/${interaction.guild.id}/Auth`, {
                        flow: "msal",
                        relyingParty: "http://xboxlive.com"
                    }, async (auethflow) => {
                })
                const flowBot = new Authflow("", `Database/${interaction.guild.id}/AuthBot`, {
                    flow: "live",
                    relyingParty: "http://xboxlive.com",
                    authTitle: "00000000441cc96b",
                    deviceType: 'Nintendo'
                }, async (auethflow) => {
            })
                let realmauthdata
        realmauthdata = await flow.getXboxToken("https://pocket.realms.minecraft.net/")
        let xboxauthdata;
        xboxauthdata = await flow.getXboxToken()
        let xboxauthdatabot;
        xboxauthdatabot = await flowBot.getXboxToken()
        const { userXUID: xuid } = xboxauthdatabot
        const response = await axios.get(`https://pocket.realms.minecraft.net/worlds/v1/link/${interaction.options.getString('realmcode')}`, {
        headers: {
            'Authorization': `XBL3.0 x=${realmauthdata.userHash};${realmauthdata.XSTSToken}`,
            "user-agent": "MCPE/UWP",
            "client-version": "1.20.61",
        }}).catch(error => {
           if (error.response.status === 404) {
            collector.stop()
            return interaction.editReply({ embeds: [invalidcode], components: [], ephemeral: true });
        }
        });
        if (response.data.id != i.values[0]) {
            return interaction.editReply({ embeds: [notownedrealm], components: [], ephemeral: true });
        }
        const joining = new EmbedBuilder()
        .setTitle('Realm Join')
        .setDescription(`Joining ${response.data.name}`)
        interaction.editReply({ embeds: [joining], components: [], ephemeral: true });
        const client = createPartbp(interaction.options.getString('realmcode'), interaction.guild.id)    
        client.on("error", async (error) => {
                        const errormsg = new EmbedBuilder()
        .setTitle('Realm Join')
        .setDescription(`The Bot Account Attempting To Join Ran Into A Error.\n${error}`)
        return interaction.editReply({ embeds: [errormsg], components: [], ephemeral: true });
        })
        client.on("play_status", (packet) => {
            const joined = new EmbedBuilder()
            .setTitle('Realm Join')
            .setDescription(`Successfully Joined ${response.data.name} As ${client.username}`)
            interaction.editReply({ embeds: [joined], components: [], ephemeral: true });
        })
                }

            })
            collector.on('end', collected => {
                if (collected.size === 0) {
                    collector.stop()
                    return interaction.editReply('You did not make a selection in time. Try Again');
                }
            });
        } catch (err) {
        }
    }
};
