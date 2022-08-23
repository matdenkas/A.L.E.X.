const { Client, Intents, MessageEmbed } = require('discord.js');
const config = require('./config');
const commands = require('./help');
const util = require('./utility.js');
requrie('dotenv').config()

const YTAPIKEY = process.env.YTAPIKEY;


let bot = new Client({
  fetchAllMembers: true,
  presence: {
    status: 'online',
    activity: {
      name: `${config.prefix}help`,
      type: 'LISTENING'
    },
  },
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS],
});


/**
 * [event] - init
 * listens on bot init
 */
bot.on('ready', () => {

  const ONSP =  bot.guilds.cache.get('597939951069298688');

  ONSP.members.cache.each((m) => {console.log(m.displayName)});
  // Iterate through the collection of GuildMembers from the Guild getting the username property of each member 
  //ONSP.forEach(member => console.log(member.user.username));
  console.log(`Logged in as ${bot.user.tag}.`)
});


/**
 * [event] - Command read
 * listens on a message being sent in a channel
 * Used to read all messages and procs on finding
 * command prefix.
 */
bot.on('message', async (message) => {
  // Check for command
  if (message.content.startsWith(config.prefix)) {
    let args = message.content.slice(config.prefix.length).split(' ');
    let command = args.shift().toLowerCase();

    switch (command) {

      case 'ping':
        var msg = await message.reply('Pinging...');
        await msg.edit(`PONG! Message round-trip took ${Date.now() - msg.createdTimestamp}ms.`)
      break;

      case 'joke':
        var msg = util.getJoke();
        message.channel.send(msg);
      break;

      case 'py':
        try {
          if (!message.guild) return;
    
          // Only try to join the sender's voice channel if they are in one themselves
          if (message.member.voice.channel) {
              console.log(message.member.voice.channel.id)
              const channel = guild.channels.get(message.member.voice.channel.id);
              if (!channel) return console.error("The channel does not exist!");
              channel.join().then(connection => {
                // Yay, it worked!
                console.log("Successfully connected.");
              }).catch(e => {
                // Oh no, it errored! Let's log it to console :)
                console.error(e);
              });
              //const connection = await message.member.voice.channel.join();
              // const args = message.content.split(' ').slice(1)
              // const ytdl = require('ytdl-core')
              // connection.play(ytdl(args.join(" "), YTAPIKEY))
          } else {
              message.reply('You need to join a voice channel first!');
          }
        } catch(e){
          console.log(e)
        }
      break;

      /* Unless you know what you're doing, don't change this command. */
      case 'help':
        let embed =  new MessageEmbed()
          .setTitle('HELP MENU')
          .setColor('GREEN')
          .setFooter(`Requested by: ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setThumbnail(bot.user.displayAvatarURL());
        if (!args[0])
          embed
            .setDescription(Object.keys(commands).map(command => `\`${command.padEnd(Object.keys(commands).reduce((a, b) => b.length > a.length ? b : a, '').length)}\` :: ${commands[command].description}`).join('\n'));
        else {
          if (Object.keys(commands).includes(args[0].toLowerCase()) || Object.keys(commands).map(c => commands[c].aliases || []).flat().includes(args[0].toLowerCase())) {
            let command = Object.keys(commands).includes(args[0].toLowerCase())? args[0].toLowerCase() : Object.keys(commands).find(c => commands[c].aliases && commands[c].aliases.includes(args[0].toLowerCase()));
            embed
              .setTitle(`COMMAND - ${command}`)

            if (commands[command].aliases)
              embed.addField('Command aliases', `\`${commands[command].aliases.join('`, `')}\``);
            embed
              .addField('DESCRIPTION', commands[command].description)
              .addField('FORMAT', `\`\`\`${config.prefix}${commands[command].format}\`\`\``);
          } else {
            embed
              .setColor('RED')
              .setDescription('This command does not exist. Please use the help command without specifying any commands to list them all.');
          }
        }
        message.channel.send(embed);
      break;
    }
  }
});

/**
 * [event] - Full message read
 * listens on a message being sent in a channel
 * Used to read all messages for certain strings
 */
bot.on('message', async (message) => { 

  let msg = message.content.toLowerCase();

  switch(msg){
    case 'hi alex':
      await message.reply('Hey!');
    break;
  }
});

require('./server')();
bot.login(config.token);