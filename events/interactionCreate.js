const Discord = require("discord.js")
const { EmbedBuilder } = require("discord.js")
const { userSchema, userDefaults } = require("../database.js");
const log = new require('../utils/logger.js')
const logger = new log("interactionCreate") 
const interaction_handler = require('../handlers/interaction_handler')
require('dotenv').config();
module.exports = {
    event: Discord.Events.InteractionCreate,
    type: "on",
    async call(client, interaction) {
            if(interaction.isChatInputCommand()) {
                const embed = new EmbedBuilder()
                .setTitle('Command Received')
                .setDescription(`Used By: ${interaction.user.username}\nUsed In: ${interaction.guild.name}\nCommand Used: ${interaction.commandName}`)

                
                client.channels.cache.get(process.env.cmdlogs).send({embeds: [embed]})
             
              const user = await userSchema.findOne({ userid: interaction.user.id }) ?? userDefaults({ userid: interaction.user.id })
              user.save()
              if (!user.perms) interaction.reply({ content: "You Are Not Authorized To Use This Command",ephemeral :true });
              
                if(!Object.keys(client.commands).includes(interaction.commandName)) {logger.warn(`Command ${interaction.commandName} not found or loaded`); return interaction.reply({ephemeral: true, content:`Command not found please report this!`})}
                const command = client.commands[interaction.commandName]
                try{
                    return await command.execute(client, interaction)
                }
                catch(error){
                    logger.error(error)
                    console.log(error)
                    return interaction.reply({ephemeral: true, content:`Error executing command! Please try again, if error persists please report to a developer`})
                        .catch(() => "")
                }
            }
            else{
                return await interaction_handler(client,interaction)
                    .catch((err) => {
                        logger.error(`Interaction handler had issue handling interaction ${interaction.customID} ${err}`)
                    })
            }      
        
    }
}