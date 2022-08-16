const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js')

const gifs = [
    'https://c.tenor.com/X-dsWnwJkZAAAAAd/succulent-chinese-meal-democracy-manifest.gif',
    'https://c.tenor.com/p2nzLP2fqdgAAAAd/charles-dozsa-under-arrest.gif',
    'https://c.tenor.com/0xnVtnrCJnAAAAAd/charles-dozsa-succulent-chinese-meal.gif',
]

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
                .setRequired(false)
        ),

    async execute(client, interaction, cache) {
        var member = interaction.options.getUser('user');

        if (member === undefined || member === null || member === NaN)
            member = interaction.member

        var checkCache = cache.get(member.id);
        if (checkCache === undefined || checkCache === null || checkCache === NaN)
            checkCache = 0;

        var res = new MessageEmbed()
        .setDescription(`${member.username} has **${checkCache}** succulent points!\n`)

        interaction.channel.send({
            content: `<@${member.id}>`,
            embeds: [res]
        })
    }
}