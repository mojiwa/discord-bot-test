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
        connection.query(`SELECT user, score FROM succubot WHERE score IS NOT NULL`, function (err, result) {
            if (err)
                console.log(err);
            else {
              console.log(result);
            }

            result = result.sort((x, y) => x.score < y.score ? 1 : 0);

            var leaderboard = "";

            result.forEach((row) => {
                var member = client.users.fetch(row.user);
                var score = row.score;
                leaderboard.concat(`${member.username} - ${score}\n`);
            });

            var leader = client.users.fetch(result[0].user);

            leaderboard.concat(`Congratulations ${leader.username}! You are in the lead`);
            
            return interaction.reply({
                content: `${leaderboard}`
            });
        });
    }
}