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
                .setRequired(true)
        ),

    async execute(client, interaction, cache) {
        var member = interaction.options.getUser('user');

        var checkCache = cache.get(member.id);
        if (checkCache === undefined || checkCache === null || checkCache === NaN)
            checkCache = 0;

        var res = new MessageEmbed()
        .setDescription(`${member.username} has **${checkCache}** succulent points!\n`)

        interaction.channel.respond({
            content: `<@${interaction.member.id}>`,
            embeds: [res]
        })
    }
}