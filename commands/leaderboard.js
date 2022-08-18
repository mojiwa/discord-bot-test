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

module.exports = {
    name: "leaderboard",
    timeout: 5,
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Find out who is the most succulent meal'),

    async execute(client, interaction, cache) {
        connection.query(`SELECT user, score FROM succubot WHERE user = ? AND guild = ? AND score IS NOT NULL`, [String(member.id), String(interaction.guildId)], function (err, result) {
            if (err)
                console.log(err);
            else {
              console.log(result);
            }
            
            return interaction.reply({
                content: `Nothing to see here...`
            });
        });
    }
}