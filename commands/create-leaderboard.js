const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'create-leaderboard',
    description: 'Creates a new leaderboard (can only be used by the server owner)',
    usage: '',
    guildOnly: true,
    cooldown: 3,
    execute(message, args) {
        if (message.member.roles.cache.find(r => r.name === 'Owner')) {
            message.channel.send('Are you sure you want to create a new leaderboard? (creating a new leaderboard will delete the existing one if one exists)');

            const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
            collector.on('collect', message => {
                if (message.content == 'yes' || message.content == 'y') {
                    try {
                        fs.writeFileSync(`./leaderboard/${message.guild.name}.txt`, '');
                    } catch (e) {
                        console.log('error', e);
                    }

                    const members = Array.from(message.guild.members.cache.values());
                    var stream = fs.createWriteStream(`./leaderboard/${message.guild.name}.txt`);
                    for (var i = 0; i < message.guild.memberCount; i++) {
                        stream.write(`${members[i].displayName}: 0\n`);
                    }
                    stream.close();
                    message.channel.send('Leaderboard created!');
                    collector.stop();
                }
                else {
                    message.channel.send('Canceled leaderboard creation');
                }
            });
            
        }
        else {
            message.channel.send('You don\'t have permission to use this command! (only useable by server owner)');
        }
    }
}