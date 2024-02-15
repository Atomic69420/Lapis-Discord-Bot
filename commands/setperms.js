"use strict";
const { userSchema, userDefaults } = require("../database.js");
const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')

module.exports = {
    register_command: new SlashCommandBuilder()
        .setName('setperms')
        .setDescription('Gives Perms To A User')
        .addStringOption(option =>
            option.setName('user_id')
                .setDescription('The User Id Of The User To Give Or Take Perms From')
                .setRequired(true))
                .addStringOption(option =>
                    option.setName('status')
                        .setDescription('Give or Take Perms From The User (Input Give to give perms input Take to take perms)')
                        .setRequired(true)),
    async execute(client, interaction) {
        const userId = interaction.options.getString('user_id');
        const state = interaction.options.getString('status');
        const embed = new EmbedBuilder()
        .setTitle('Gave Perms To')
        .setDescription(`<@${interaction.options.getString('user_id')}>`)
        const embede = new EmbedBuilder()
        .setTitle('Took Perms From')
        .setDescription(`<@${interaction.options.getString('user_id')}>`)
        const embedee = new EmbedBuilder()
        .setTitle('You Cant Give Perms To A User Who Already Has Perms\nYou Cant Take Perms From A User Who Does Not Have Perms')
        const user = await userSchema.findOne({ userid: interaction.user.id })
        if (user.perms) {
            const setUser = await userSchema.findOne({ userid: userId }) ?? userDefaults({ userid: userId })
            user.save()
            if (state === "Give" && !setUser.perms) {
            setUser.perms = true
            setUser.save()
            return await interaction.reply({embeds: [embed],ephemeral :true})
            }
            if (state === "Take" && setUser.perms) {
                setUser.perms = false
                setUser.save()
                return await interaction.reply({embeds: [embede],ephemeral :true})
                }
                else {
                    return await interaction.reply({embeds: [embedee],ephemeral :true})
                }
             
        }
    }
}