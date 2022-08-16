const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js')

const api = require('../src/handlers/oven')
const rng = require('../src/handlers/rng')
const wait = require('util').promisify(setTimeout)

module.exports = {
    name: "succ",
    timeout: 5,
    data: new SlashCommandBuilder()
        .setName('succ')
        .setDescription('succulent')
        .addSubcommand(subcommand =>
            subcommand
                .setName('chinese')
                .setDescription('A Chinese meal?')),

    async execute(client, interaction, cache) {
        const member = interaction.member
        const guild = client.guilds.cache.get(interaction.guild.id)

        var initCache = cache.get(member.id);

        var embed = new MessageEmbed()
            .setColor('#FFDB69')

        const quality = async function oven() {
            console.log(interaction.options.content);
            switch (interaction.options.getSubcommand()) {
                // which bread subcommand was clicked
                case 'chinese':
                    embed
                        .setDescription('What is the charge?')
                        .setImage('https://tenor.com/view/succulent-chinese-meal-democracy-manifest-police-fake-gif-16970184')
                    interaction.reply({
                        embeds: [embed]
                    })

                    var quality = 1

                    return quality
                    break;
            }
        }
        await quality().then((value) => {
            const xp = initCache + 1;
            cache.set(member.id, xp);

            var checkCache = cache.get(member.id);
            var res = new MessageEmbed()
                .setDescription(`You have **${checkCache}** succulent points!\n`)

            interaction.channel.send({
                content: `<@${interaction.member.id}>`,
                embeds: [res]
            })

        })
    }
}