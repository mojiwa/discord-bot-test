const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

const mysql = require('mysql');

const dotenv = require('dotenv');
// import config IDs
dotenv.config();
const USER = process.env.SQL_USER;
const PASSWORD = process.env.SQL_PASSWORD

var connection = mysql.createPool({
    connectionLimit: 10,
    host: 'remotemysql.com',
    database: 'tFfU8HAy43',
    user: USER,
    password: PASSWORD
});

const gifs = [
    'https://c.tenor.com/X-dsWnwJkZAAAAAd/succulent-chinese-meal-democracy-manifest.gif',
    'https://c.tenor.com/p2nzLP2fqdgAAAAd/charles-dozsa-under-arrest.gif',
    'https://c.tenor.com/0xnVtnrCJnAAAAAd/charles-dozsa-succulent-chinese-meal.gif',
    'https://c.tenor.com/GiEE0XXYT2gAAAAd/succulent-chinese-meal-paul-charles-dozsa.gif',
    'https://c.tenor.com/1FAEq7NOiiYAAAAC/limp-penis.gif'
];

const postGif = async (interaction) => {
    var embed = new MessageEmbed()
                    .setColor('#FFDB69');
    const index = Math.floor(Math.random() * 5);
    embed.setImage(gifs[index]);
    interaction.reply({
        embeds: [embed]
    });
}

module.exports = {
    name: "succ",
    timeout: 5,
    data: new SlashCommandBuilder()
        .setName('succ')
        .setDescription('Award succulent points to a member of chat')
        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('Who do you want to award succulent points to?')
                .setRequired(true)
        ),

    async execute(client, interaction, cache) {
        const member = interaction.member;
        const targetMember = interaction.options.getUser('user');
        var op = await client.users.fetch(member.id);

        if (member.id === targetMember.id) {
            return interaction.reply({
                content: `You are being cheeky. You cannot give yourself points... that's not very succulent of you.`
            });
        } else {
            
            await postGif(interaction).then(() => {    
                var newScore = 1;                         
                connection.getConnection(function(err) {
                    if (err)
                        return;
                    console.log("Connected");                    
                                        
                    connection.query(`SELECT score FROM succubot WHERE user = ? AND guild = ?`, [String(targetMember.id), String(interaction.guildId)], function (err, result) {
                        if (err)
                            console.log(err);  
                        else {                                            
                            if (result[0] === undefined) {                                
                                console.log("Inserting new record");
                                connection.query(`INSERT INTO succubot (user, username, guild, score) VALUES ("${targetMember.id}", "${targetMember.username}", "${interaction.guildId}", ${newScore})`, function (err, result) {
                                    if (err)
                                        console.log(err);                                    
                                });
                            } else {
                                newScore = result[0].score + 1;
                                console.log("Updating existing record");
                                connection.query('UPDATE succubot SET score = ? WHERE user = ? AND guild = ?', [newScore, String(targetMember.id), String(interaction.guildId)], function (err, result) {
                                    if (err)
                                        console.log(err);                                    
                                });
                            }
                        }                        
                        var res = new MessageEmbed()
                            .setDescription(`${op.username} just gave you a succulent point.\nYou now have **${newScore}** succulent ${newScore < 2 ? "point" : "points"}!\n`);

                        interaction.channel.send({
                            content: `<@${targetMember.id}>`,
                            embeds: [res]
                        });
                    });                    
                });                
            });
        }
    }
}