"use strict";
const { userSchema, userDefaults } = require("../database.js");
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('@discordjs/builders');
const { Authflow } = require('prismarine-auth');
const filedit = require('edit-json-file');
const fs = require('fs').promises;
const fsExtra = require('fs-extra');
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
       await interaction.reply({embeds: [starting],ephemeral :true})
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
        const dirpath = path.join(`Database/${interaction.guild.id}/`, "Setup");
        fs.mkdir(dirpath, { recursive: true }, (err) => {
        })
        const accountSelectMenu = new StringSelectMenuBuilder()
            .setCustomId('accounts')
            .setPlaceholder('Select Account Type')
            .addOptions([
                {
                    label: 'Main Account',
                    value: 'main'
                },
                {
                    label: 'Bot Account',
                    value: 'bot'
                }
            ]);

        const accounts = new ActionRowBuilder()
            .addComponents(
                accountSelectMenu,
            );
            const select = new EmbedBuilder()
            .setTitle('Setup')
            .setDescription(`Please Select An Account Type`)
            await interaction.editReply({embeds: [select],components: [accounts] });
            const filter = i => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
            collector.on('collect', async i => {
                if (i.isStringSelectMenu()) {
                    const selectedValue = i.values[0];
                    if (selectedValue === 'main') {
                        interaction.editReply({ components: [] });
                        const alrlink = new EmbedBuilder()
        .setTitle('Setup')
        .setDescription(`Your Main Account Is Already Linked. You Can Use /disconnect To Unlink It`)
        try {
        if (authFiles.length > 0) {
            return  interaction.editReply({embeds: [alrlink],components: [],ephemeral :true})
        }
    } catch (err) {
    }
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
                           interaction.editReply({embeds: [embed],components: [],ephemeral :true})
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
            let realmnames = []
            for (const realms of realmsowned) {
                realmids.push(realms.id)
                realmnames.push(realms.name)
            }
if (realmsowned.length === 0) {
    const norealms = new EmbedBuilder()
        .setTitle('Setup')
        .setDescription(`You Do Not Own Any Realms.`)
        fsExtra.remove(`Database/${interaction.guild.id}/Auth`)
        fsExtra.remove(`Database/${interaction.guild.id}/Realm`)
        fs.unlink(`Database/${interaction.guild.id}/Setup/setup.json`)
        return interaction.editReply({embeds: [norealms],components: [],ephemeral :true})
}
databaseRealm.set(`${interaction.guild.id}`, {
    ownsrealms: true,
    realmid: realmids,
    realmnames: realmnames,
});
databaseRealm.save()
               database.set(`${interaction.guild.id}`, {
                setup: true
            });
            database.save();
            const donelink = new EmbedBuilder()
            .setTitle('Setup')
            .setDescription(`You Have Successfully Linked Your Main Account.\nTo Unlink You Can Use /Disconnect`)
            return interaction.editReply({embeds: [donelink],ephemeral :true})
                    } else if (selectedValue === 'bot') {
                        interaction.editReply({ components: [] });
                        const alrlink = new EmbedBuilder()
        .setTitle('Setup')
        .setDescription(`Your Bot Account Is Already Linked. You Can Use /disconnect To Unlink It`)
        try {
        if (authFilesBot.length > 0) {
            return interaction.editReply({embeds: [alrlink],components: [],ephemeral :true})
        }
    } catch (err) {
    }
                        const flow = new Authflow("", `Database/${interaction.guild.id}/AuthBot`, {
                            flow: "live",
                            relyingParty: "http://xboxlive.com",
                            authTitle: "00000000441cc96b",
                            deviceType: 'Nintendo'
                        }, async (auethflow) => {
                            const embed = new EmbedBuilder()
                            .setTitle('Setup')
                            .setDescription(`Please Click This [Link](${auethflow.verification_uri}?otc=${auethflow.user_code}) and sign into your account.\n Do This Within <t:${Math.floor(Date.now() / 1000) + auethflow.expires_in}:R>\nThis Is For A Bot Account Do Not Link Your Account That Owns The Realms.`)
                            fs.writeFile(`./Database/${interaction.guild.id}/Setup/setupBot.json`, '', (err) => {
                                if (err) {
                                    console.log(`error creating file on ${dirpath}\n${err}`)
                                    return;
                                }
                            })
                           interaction.editReply({embeds: [embed],components: [],ephemeral :true})
                    })
                    const database = filedit(`./Database/${interaction.guild.id}/Setup/setupBot.json`);
        let realmauthdata
        realmauthdata = await flow.getXboxToken("https://pocket.realms.minecraft.net/")
        let xboxauthdata;
        xboxauthdata = await flow.getXboxToken()
               database.set(`${interaction.guild.id}`, {
                setup: true
            });
            database.save();
            const donelink = new EmbedBuilder()
            .setTitle('Setup')
            .setDescription(`You Have Successfully Linked Your Bot Account.\nTo Unlink You Can Use /Disconnect`)
            return interaction.editReply({embeds: [donelink],components: [],ephemeral :true})
                    }
                }
            });
    
            collector.on('end', collected => {
                if (collected.size === 0) {
                    collector.stop()
                    return interaction.editReply({content: "You Did Not Make A Selection Wihtin 15 Seconds", components: [],ephemeral:true});
                }
            });
    }
}