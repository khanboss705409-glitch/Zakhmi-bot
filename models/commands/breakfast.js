const request = require('request');
const fs = require('fs');
const path = require('path');

module.exports.config = {
                name: "breakfast-you",
                version: "1.0.1",
                hasPermssion: 0,
                credits: "𝐒𝐇𝐀𝐀𝐍 𝐊𝐇𝐀𝐍",
                description: "no prefix",
        usePrefix: false,
                commandCategory: "No command marks needed",
                usages: "Yo Yo",
                cooldowns: 5,
};

const gifs = [
                "https://i.imgur.com/z2EbkKC.gif",
                "https://i.imgur.com/9HaPHmv.gif",
                "https://i.imgur.com/StrF9B8.gif",
                "https://i.imgur.com/GCYkSwa.gif",
                "https://i.imgur.com/sF5I9gU.gif"
];

const messages = [
                "=𝐎𝐰𝐧𝐞𝐫 ➻  𝐈𝐌𝐑𝐀𝐍 𝐊𝐇𝐀𝐍 \n──────────────────\n\n😋 𝐀𝐀𝐎 𝐁𝐀𝐁𝐘 𝐌𝐄𝐑𝐄 𝐒𝐀𝐓𝐇 𝐁𝐑𝐄𝐀𝐊𝐅𝐀𝐒𝐓 𝐊𝐑 𝐋𝐎 🙂\n",
                "=𝐎𝐰𝐧𝐞𝐫 ➻  𝐈𝐌𝐑𝐀𝐍 𝐊𝐇𝐀𝐍 \n──────────────────\n\n😋 𝐀𝐀𝐎 𝐁𝐀𝐁𝐘 𝐌𝐄𝐑𝐄 𝐒𝐀𝐓𝐇 𝐁𝐑𝐄𝐀𝐊𝐅𝐀𝐒𝐓 𝐊𝐑 𝐋𝐎 🙂\n",
                "=𝐎𝐰𝐧𝐞𝐫 ➻  𝐈𝐌𝐑𝐀𝐍 𝐊𝐇𝐀𝐍 \n──────────────────\n\n😋 𝐀𝐀𝐎 𝐁𝐀𝐁𝐘 𝐌𝐄𝐑𝐄 𝐒𝐀𝐓𝐇 𝐁𝐑𝐄𝐀𝐊𝐅𝐀𝐒𝐓 𝐊𝐑 𝐋𝐎 🙂\n",
                "=𝐎𝐰𝐧𝐞𝐫 ➻  𝐈𝐌𝐑𝐀𝐍 𝐊𝐇𝐀𝐍 \n──────────────────\n\n😋 𝐀𝐀𝐎 𝐁𝐀𝐁𝐘 𝐌𝐄𝐑𝐄 𝐒𝐀𝐓𝐇 𝐁𝐑𝐄𝐀𝐊𝐅𝐀𝐒𝐓 𝐊𝐑 𝐋𝐎 🙂\n",
                "=𝐎𝐰𝐧𝐞𝐫 ➻  𝐈𝐌𝐑𝐀𝐍 𝐊𝐇𝐀𝐍 \n──────────────────\n\n😋 𝐀𝐀𝐎 𝐁𝐀𝐁𝐘 𝐌𝐄𝐑𝐄 𝐒𝐀𝐓𝐇 𝐁𝐑𝐄𝐀𝐊𝐅𝐀𝐒𝐓 𝐊𝐑 𝐋𝐎 🙂\n"
];

module.exports.handleEvent = async function({ api, event, client, Users, __GLOBAL }) {
                var { threadID, messageID } = event;
                var name = await Users.getNameUser(event.senderID);

                if (event.body.toLowerCase().startsWith("breakfastt") || 
                                event.body.toLowerCase().startsWith("जलपान") || 
                                event.body.toLowerCase().startsWith("breakfast") || 
                                event.body.toLowerCase().startsWith("Breakfast") || 
                                event.body.toLowerCase().startsWith("BREAKFAST")) { 

                                // Select random GIF and message
                                const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
                                const randomMessage = messages[Math.floor(Math.random() * messages.length)].replace("{name}", name);
                                const downloadPath = path.join(__dirname, 'breakfast-you-Gif-Images.gif');

                                // Download image from Imgur
                                request(randomGif).pipe(fs.createWriteStream(downloadPath)).on('close', () => {
                                                var msg = {
                                                                body: randomMessage,
                                                                attachment: fs.createReadStream(downloadPath)
                                                };
                                                api.sendMessage(msg, threadID, messageID);
                                                api.setMessageReaction("🤤", event.messageID, (err) => {}, true);
                                });
                }
}

module.exports.run = function({ api, event, client, __GLOBAL }) {

}
