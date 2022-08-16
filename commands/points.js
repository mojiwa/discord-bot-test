const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js')

module.exports = {
    name: "points",
    timeout: 5,
    data: new SlashCommandBuilder()
        .setName('points')
        .setDescription('Get points')
        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('Who do you want to see points for?')
                .setRequired(true)
        ),

    async execute(client, interaction, cache) {
        var member = interaction.options.getUser('user');

        var checkCache = cache.get(member.id);
        if (checkCache === undefined || checkCache === null || checkCache === NaN)
            checkCache = 0;

        return interaction.reply({
            content: `${member.username} has **${checkCache}** succulent points!\n`
        });
    }
}