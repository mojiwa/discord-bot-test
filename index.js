// import requirements 
const {
    Client,
    Intents,
    MessageEmbed,
} = require('discord.js');

// starting in djs v13, we are required to specify which intents we are using in the client constructor
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

const mysql = require('mysql');

const dotenv = require('dotenv');
// import config IDs
dotenv.config();
const TOKEN = process.env.TOKEN;
const USER = process.env.SQL_USER;
const PASSWORD = process.env.SQL_PASSWORD

var connection = mysql.createPool({
    connectionLimit: 10,
    host: 'db-eu-03.sparkedhost.us',
    database: 's73880_succubot',
    user: USER,
    password: PASSWORD
});

const startup = require('./src/startup');
// run this script upon starting up the bot and pass in the client
startup(client);


var cache = new Map();
const { request } = require('./src/handlers/cache');

const responses = [
    "What is the charge? Eating a meal?",
    "Gentlemen, this is democracy manifest",
    "Get your hand off my penis",    
    "A succulent Chinese meal?",
    "And you sir, are you waiting to receive my limp penis?",
    "Ah yes, I see that you know your judo well",
    "I'm under what?!",
    "Tata... and farewell",
    "Get your hand off my succulent Chinese meal",
]

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        return await request(client, interaction, cache);

    }
});

client.on("messageCreate", (message) => {
    var bans = 1;
    if (message.content.toLowerCase().includes("!banbim")) {

        connection.query(`SELECT * FROM banbim`, function (err, result) {                
            if (err)
                console.log(err);  
        
        if (result[0].bans === undefined || result[0].bans === null) {
            bans = 1;
        } else {
            bans = result[0].bans + 1;
        
            connection.query('UPDATE banbim SET bans = ?', [bans], function (err, result) {
                if (err)
                    console.log(err);
            });
        }
        message.reply({
            content: `Bim has been a naughty boy ${bans} times`
        });
    });
    }
    const playOrNay = Math.floor(Math.random() * 10);
    // randomize whether or not the command is called
    if (playOrNay > 5) 
        return;
    const index = Math.floor(Math.random() * 9);
    if (message.content.toLowerCase().includes("succ") && message.author.username !== "Succubot") {     
        message.reply({
            content: responses[index]
        });
        connection.getConnection(function(err) {
            var targetMember = message.author;
            if (err)
                return;
            console.log("Connected");                    
                                
            connection.query(`SELECT messages FROM succubot WHERE user = ? AND guild = ?`, [String(targetMember.id), String(message.guildId)], function (err, result) {                
                if (err)
                    console.log(err);  
                else {                                            
                    if (result[0] === undefined || result[0] == null) {                                
                        console.log("Inserting new record");
                        connection.query(`INSERT INTO succubot (user, username, guild, messages) VALUES ("${targetMember.id}", "${targetMember.username}", "${message.guildId}", 1)`, function (err, result) {
                            if (err)
                                console.log(err);                            
                        });
                    } else {
                        var messageCount = result[0].messages + 1;
                        console.log(messageCount);
                        console.log("Updating existing record");
                        connection.query('UPDATE succubot SET messages = ? WHERE user = ? AND guild = ?', [messageCount, String(targetMember.id), String(message.guildId)], function (err, result) {
                            if (err)
                                console.log(err);
                        });
                        if (messageCount === 10 || messageCount === 20 || messageCount === 30 || messageCount === 40 || messageCount === 50 || messageCount === 60 || messageCount === 70 || messageCount === 80 || messageCount === 90 || messageCount === 100) {
                            connection.query(`SELECT score FROM succubot WHERE user = ? AND guild = ?`, [String(targetMember.id), String(message.guildId)], function (err, result) {                
                                if (err)
                                    console.log(err);  
                            var score = 0;
                            
                            if (result[0].score === undefined || result[0].score === null)
                                score = 1;
                            else 
                                score = result[0].score + 1;
                            
                                connection.query('UPDATE succubot SET score = ? WHERE user = ? AND guild = ?', [score, String(targetMember.id), String(message.guildId)], function (err, result) {
                                    if (err)
                                        console.log(err);
                                });
                            });
                        }
                    }
                }
            });
        });
    }
});


client.login(TOKEN);