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

async function getLeaderboard(client, result) {
    let leaderboard = "";
    result.forEach(async (row) => {        
        var member = await client.users.fetch(row.user);        
        var score = row.score;        
        leaderboard.concat(`${member.username} - ${score}\n`);
    });

    var leader = client.users.fetch(result[0].user);

    leaderboard.concat(`Congratulations ${leader.username}! You are in the lead`);
    console.log(leaderboard);
    return leaderboard;
}

module.exports = {
    name: "leaderboard",
    timeout: 5,
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Find out who is the most succulent meal'),

    async execute(client, interaction, cache) {
        connection.query(`SELECT username, score FROM succubot WHERE score IS NOT NULL`, async function (err, result) {
            if (err)
                console.log(err);

            var leaderboard = [];

            let newResult = result.map(({username, score}) => ({username, score}));
            newResult = newResult.sort((x, y) => x.score < y.score ? 1 : -1);
            newResult.forEach((row) => {
                leaderboard.push(`\n${row.username} - ${row.score}`);
            });

            leaderboard.push(`\n\nCongratulations ${newResult[0].username}! You are in the lead.`);
            
            leaderboard = leaderboard.join('');

            return interaction.reply({
                content: `\n\n${leaderboard}`
            });                              
        });
    }
}