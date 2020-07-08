const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: 'pirate',
    description: 'Collects the users that react to a message to play a game, and creates teams',
    usage: '<brigs or sloops> <number of teams>',
    guildOnly: true,
    args: true,
    cooldown: 3,
    execute(message, args) {

        if (!args[0] || args[0] != 'brigs' && args[0] != 'sloops') {
            message.channel.send("You did not enter a valid game mode");
            return;
        }
        if (!args[1] || isNaN(args[1]) || args[1] < 1) {
            message.channel.send("Please enter the number of teams");
            return;
        }

        const filter = (reaction, user) => {
            return user.id !== message.author.id && reaction.emoji.name === 'spy';
        };

        message.channel.send(`Ahoy Mateys, ${message.author} is looking for ${args[1] * (args[0] == "brigs" ? 3 : 2) - 1 } other players for a pirate game. React to this message to join the game!`).then(sentMessage => {
            const collector = new Discord.ReactionCollector(sentMessage, filter, { maxUsers: args[1] * (args[0] == "brigs" ? 3 : 2) - 1 });

            collector.on('collect', (reaction, user) => {
                message.channel.send(`${user} is joining the game! Watch out ye scallywags`);
            });

            collector.on('end', (collected, reason) => {
                const arr = Array.from(collector.users.values());
                arr.push(message.author);
                shuffle(arr);

                var logText = '';
                var mssgText = "Teams are as follows:";
                //for each team
                if (args[0] == "brigs") {
                    for (var i = 0; i < args[1]; i++) {
                        const offset = 3 * i;
                        mssgText += `\nTeam ${i + 1}: ${arr[0 + offset]}, ${arr[1 + offset]}, ${arr[2 + offset]}`;
                        logText += `\nTeam ${i + 1}: ${arr[0 + offset].username}, ${arr[1 + offset].username}, ${arr[2 + offset].username}`;
                    }
                } else {
                    for (var i = 0; i < args[1]; i++) {
                        const offset = 2 * i;
                        mssgText += `\nTeam ${i + 1}: ${arr[0 + offset]}, ${arr[1 + offset]}`;
                        logText += `\nTeam ${i + 1}: ${arr[0 + offset].username}, ${arr[1 + offset].username}`;
                    }
                }
                mssgText += "\nScuttle your ships and set sail! Let the games begin";
                message.channel.send(mssgText);

                try {
                    fs.appendFileSync('./leaderboard/gameslog.txt', `Pirate ${args[0]} game ${new Date().toLocaleString()}:${logText}\n\n`);
                } catch (e) {
                    console.log('error', e);
                }
            });

        });


    }
}


function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}