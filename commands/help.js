"use strict";
const { userSchema, userDefaults } = require("../database.js");
const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')

module.exports = {
    register_command: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays all commands available to you !'),
    async execute(client, interaction) {
        const embed = new EmbedBuilder()
        .setTitle('Available Commands')
        .setDescription('Help (Displays all available to you)\nPing (Responds with the bots current response time)')
        const user = await userSchema.findOne({ userid: interaction.user.id })
        if (user.perms) return await interaction.reply({embeds: [embed],ephemeral :true})
    }
}