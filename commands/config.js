"use strict";
const { userSchema, userDefaults } = require("../database.js");
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const axios = require('axios');
const fs = require('fs');
module.exports = {
    register_command: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Configures The Modules Of The Bot.')
            .addBooleanOption(option =>
                option.setName('edit')
                    .setDescription('Define whether or not you want to edit the module')),
    async execute(client, interaction) {
        const starting = new EmbedBuilder()
        .setTitle('Config')
        .setDescription(`Starting Process...`)
        let authFiles;
        try {
            authFiles = await fs.readdirSync(`./Database/${interaction.guild.id}/Auth`);
            } catch (err) {
            }
            let authFilesBot;
            try {
            authFilesBot = await fs.readdirSync(`./Database/${interaction.guild.id}/AuthBot`)
            } catch (err) {
                
            }
            const notsetupmain = new EmbedBuilder()
        .setTitle('Config')
        .setDescription(`You Are Currently Not Linked With A Main Account. Use /setup To Setup A Main Account.`)
        const notsetupbot = new EmbedBuilder()
        .setTitle('Config')
        .setDescription(`You Are Currently Not Linked With A Bot Account. Use /setup To Setup A Bot Account.`)
       await interaction.reply({embeds: [starting],ephemeral :true})
       if (authFiles === undefined || authFiles.length === 0) {
        return interaction.editReply({ embeds: [notsetupmain], ephemeral: true });
    }
    if (authFilesBot === undefined || authFilesBot.length === 0) {
        return interaction.editReply({ embeds: [notsetupbot], ephemeral: true });
    }
    const configSelectMenu = new StringSelectMenuBuilder()
            .setCustomId('config')
            .setPlaceholder('Select Config Type')
            .addOptions([
                {
                    label: 'Logs Config',
                    value: 'logs'
                },
                {
                    label: 'Bot Config',
                    value: 'bot'
                }
            ]);
            const configSelectModuleLogs = new StringSelectMenuBuilder()
            .setCustomId('configLogs')
            .setPlaceholder('Select Module To Configure For Logs')
            .addOptions([
                {
                    label: 'Ban Logs',
                    value: 'banlog'
                },
                {
                    label: 'Kick Logs',
                    value: 'kicklog'
                },
                {
                    label: 'Automod Logs',
                    value: 'automodlog'
                },
                {
                    label: 'Realm Open/Close Logs',
                    value: 'o-c-logs'
                },
                {
                    label: 'Backup Logs',
                    value: 'backuplog'
                },
                {
                    label: 'Realm Chat Logs',
                    value: 'chatlog'
                },
                {
                    label: 'Realm Rename Logs',
                    value: 'renamelog'
                },
            ]);
            const configSelectModuleBot = new StringSelectMenuBuilder()
            .setCustomId('configBot')
            .setPlaceholder('Select Module To Configure For Bot')
            .addOptions([
                {
                    label: 'Device Ban',
                    value: 'deviceban'
                },
                {
                    label: 'Anti Invalid Skin',
                    value: 'skin'
                },
                {
                    label: 'Anti Invalid Device',
                    value: 'device'
                },
                {
                    label: 'Anti Alt',
                    value: 'antialt'
                },
            ]);
            const configmenulogs = new ActionRowBuilder()
            .addComponents(
                configSelectModuleLogs,
            );
            const configmenubot = new ActionRowBuilder()
            .addComponents(
                configSelectModuleBot,
            );
            const configmenu = new ActionRowBuilder()
            .addComponents(
                configSelectMenu,
            );
            const select = new EmbedBuilder()
            .setTitle('Config')
            .setDescription(`Please Select An Config Type`)
            await interaction.editReply({embeds: [select],components: [configmenu] });
            const filter = i => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
            collector.on('collect', async i => {
                if (i.isStringSelectMenu()) {
                    const selectedValue = i.values[0];
                    if (selectedValue === "logs") {
                        const selectLogs = new EmbedBuilder()
            .setTitle('Config')
            .setDescription(`Select Module To Configure For Logs`)
            await interaction.editReply({embeds: [selectLogs],components: [configmenulogs] });
            const filter = i => i.user.id === interaction.user.id;
            const collectorLogs = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
            collectorLogs.on('collect', async i => {
                if (i.isStringSelectMenu()) {
                    let sv
                    sv = i.values[0];
                    const channels = interaction.guild.channels.cache
                    .filter(channel => channel.type == 0)
                    .map(channel => ({
                        label: channel.name,
                        value: channel.id
                    }));
                    const channelSelect = new StringSelectMenuBuilder()
            .setCustomId('configLC')
            .setPlaceholder(`Select A Logs Channel For ${sv}`)
            .addOptions(channels)
            const channelSMenu = new ActionRowBuilder()
            .addComponents(
                channelSelect,
            );
            const selectChannel = new EmbedBuilder()
            .setTitle('Config')
            .setDescription(`Select A Logs Channel For ${sv}`);
        await interaction.editReply({ embeds: [selectChannel], components: [channelSMenu] });
        const filter = i => i.user.id === interaction.user.id;
        const collectorChannel = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
        collectorChannel.on('collect', async i => {
            if (i.isStringSelectMenu()) {
                const selectedValue = i.values[0];
                try {
                    const data = fs.readFileSync(`./Database/${interaction.guild.id}/Config/config.json`, 'utf8');

                    const config = JSON.parse(data);
                    if (config.logs[sv] === selectedValue) {
                        const selectChannelFail = new EmbedBuilder()
                            .setTitle('Config')
                            .setDescription(`Failed to edit the logs for ${sv} since its value was already set as the channel selected.`);
                            return await interaction.editReply({ embeds: [selectChannelFail], components: [] });
                    }
                    config.logs[sv] = selectedValue;
                    fs.writeFileSync(`./Database/${interaction.guild.id}/config/config.json`, JSON.stringify(config, null, 4));
                    const selectChannelSuccess = new EmbedBuilder()
                        .setTitle('Config')
                        .setDescription(`Successfully edited the logs for ${sv}.`);
                    await interaction.editReply({ embeds: [selectChannelSuccess], components: [] });
                } catch (error) {
                }
            }
        });
                }
            })
                    }
                }
            })
    }
}