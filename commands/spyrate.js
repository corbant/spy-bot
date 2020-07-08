const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: 'spyrate',
    description: 'Collects the users that react to a message to play a game, and creates teams of 4',
    usage: '<number of teams to make> (NOTE: giving no argument defaults to 2)',
    guildOnly: true,
    cooldown: 3,
    execute(message, args) {

        if (args[0] && isNaN(args[0]) || args[0] && args[0] < 1) {
            message.channel.send("This is not a valid argument");
            return;
        }

        const filter = (reaction, user) => {
            return user.id !== message.author.id && reaction.emoji.name === 'spy';
        };

        message.channel.send(`Ahoy Mateys, ${message.author} is looking for ${!args.length ? 7 : args[0] * 4 - 1} other players for a spyrate game. React to this message to join the game!`).then(sentMessage => {
            const collector = new Discord.ReactionCollector(sentMessage, filter, { maxUsers: !args.length ? 7 : args[0] * 4 - 1 });

            collector.on('collect', (reaction, user) => {
                message.channel.send(`${user} is joining the game! Watch out ye scallywags`);
            });

            collector.on('end', (collected, reason) => {
                const arr = Array.from(collector.users.values());
                arr.push(message.author);
                shuffle(arr);

                var logText;
                var mssgText = "Teams are as follows:";
                //for each team
                for (var i = 0; i <= !args.length ? 2 : args[0]; i++) {
                    const offset = 4 * i;
                    mssgText += `\nTeam ${i + 1}: ${arr[0 + offset]}, ${arr[1 + offset]}, ${arr[2 + offset]}, ${arr[3 + offset]}`;
                    logText += `\nTeam ${i + 1}: ${arr[0 + offset].username}, ${arr[1 + offset].username}, ${arr[2 + offset].username}, ${arr[3 + offset].username}`;
                    message.client.users.fetch(arr[getRandomInt(3) + offset].id).then(spy => {
                        spy.send("You are the spy for this game!");
                        logText += `\nSpy: ${spy}`;
                    });
                }
                mssgText += "\nSpies have been sent a DM.";
                mssgText += "\nScuttle your ships and set sail! Let the games begin";
                message.channel.send(mssgText);

                try {
                    fs.appendFileSync('./leaderboard/gameslog.txt', `Spyrate game ${new Date().toLocaleString()}:${logText}\n\n`);
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

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max+1));
}