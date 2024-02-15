"use strict";
const { userSchema, userDefaults } = require("../database.js");
const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const axios = require('axios');

module.exports = {
    register_command: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Shows the response time of the bot'),
    async execute(client, interaction) {
        const user = await userSchema.findOne({ userid: interaction.user.id })
        if (user.perms) {
            const startTime = Date.now();
            const response = await axios.get('https://www.google.com');
            const endTime = Date.now();
            const pingTime = endTime - startTime;
            const embed = new EmbedBuilder()
            .setTitle('Pong!')
            .setDescription(`${pingTime}ms`)
             return await interaction.reply({embeds: [embed],ephemeral :true})
        }
    }
}