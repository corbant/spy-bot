const Discord = require('discord.js');

module.exports = {
    name: 'spyrate',
    description: 'Collects the number of reactions on the message.',
    usage: '<number of users to collect>',
    cooldown: 3,
    execute(message, args) {

        const filter = (reaction, user) => {
            return user.id ;
        };

        message.channel.send("React to this message to join the game!").then(sentMessage => {
            const collector = new Discord.ReactionCollector(sentMessage, filter, { maxUsers: !args.length ? 8 : args[0] });

            collector.on('collect', (reaction, user) => {
                message.channel.send(`${user} is joining the game!`);
            });

            collector.on('end', (collected, reason) => {
                //message.channel.send(`Collected ${collected.size} items`);
                const arr = Array.from(collector.users.values());
                //message.channel.send(`Users who reacted: ${arr}`);
                shuffle(arr);
                message.channel.send("Teams are as follows:");
                //for each team
                for (var i = 0; i < Math.ceil(arr.length / 4); i++) {
                    const offset = 4 * i;
                    message.channel.send(`Team ${i + 1}: ${arr[0 + offset]}, ${arr[1 + offset]}, ${arr[2 + offset]}, ${arr[3 + offset]}`);
                    message.client.users.fetch(arr[getRandomInt(arr.length - 1) + offset].id).then(spy => {
                        spy.send("You are the spy for this game!");
                    });
                }
                message.channel.send("Let the games begin! Have fun!");
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