const fs = require('fs');
module.exports = {
    name: 'leaderboard',
    description: '',
    usage: '',
    guildOnly: true,
    cooldown: 3,
    execute(message, args) {

        var leaderboard;

        try {
            leaderboard = fs.readFileSync(`./leaderboard/${message.guild.name}.txt`);
        } catch (e) {
            console.log('error', e);
        }
        message.channel.send(`current leaderboard:\n${leaderboard}`);

    }
}