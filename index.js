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

const dotenv = require('dotenv')
// import config IDs
dotenv.config()
const TOKEN = process.env.TOKEN

const startup = require('./src/startup');
// run this script upon starting up the bot and pass in the client
startup(client)


var cache = new Map();
const { request } = require('./src/handlers/cache')

const responses = [
    "What is the charge?",
    "This is democracy manifest",
    "Get your hand off my penis",
    "A succulent Chinese meal?",
    "Are you waiting to receive my limp penis?",
    "I see that you know your judo well"
]

client.on('interactionCreate', async (interaction) => {
    // define constants
    const guild = client.guilds.cache.get(interaction.guild.id)
    const member = interaction.member


    if (interaction.isCommand()) {

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        if (command == 'start' || command == 'setup') {
            console.log('ran a non-baking command')
            return await command.execute(client, interaction)
        } else {

            return await request(client, interaction, cache)
        }

    }
})

client.on("messageCreate", (message) => {
    const index = Math.floor(Math.random() * 6);
    if (message.content.toLowerCase().includes("succulent") && message.author.username !== "Succubot")
        message.reply({
            content: responses[index]
        });
})


client.login(TOKEN);