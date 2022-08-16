const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js')


module.exports = {
    name: "succ",
    timeout: 5,
    data: new SlashCommandBuilder()
        .setName('succ')
        .setDescription('succulent')
        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('Who do you want to succ')
                .setRequired(true)
        ),

    async execute(client, interaction, cache) {
        const member = interaction.member
        const targetMember = interaction.options.getUser('user');
        console.log(targetMember);

        var initCache = cache.get(member.id);

        var embed = new MessageEmbed()
            .setColor('#FFDB69')

        const quality = async function oven() {
            embed
                .setDescription('What is the charge?')
                .setImage('https://c.tenor.com/X-dsWnwJkZAAAAAd/succulent-chinese-meal-democracy-manifest.gif')
            interaction.reply({
                embeds: [embed]
            })

            var quality = 1

            return quality
        }

        await quality().then((value) => {
            const xp = initCache + 1;
            cache.set(targetMember.id, xp);

            var checkCache = cache.get(targetMember.id);
            var res = new MessageEmbed()
                .setDescription(`You have **${checkCache}** succulent points!\n`)

            interaction.channel.send({
                content: `<@${targetMember.id}>`,
                embeds: [res]
            })

        })
    }
}