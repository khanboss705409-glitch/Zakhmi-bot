const fs = require("fs");
module.exports.config = {
  name: "goodmorning",
  version: "1.1.1",
  hasPermssion: 0,
  credits: "ZAKHMI SAYAR",
  description: "Just Respond - Good Morning",
  commandCategory: "no prefix",
  cooldowns: 5,
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
  var { threadID, messageID } = event;
  if (!event.body) return;
  let react = event.body.toLowerCase();
  
  if(react.includes("morning") || 
     react.includes("good morning") || 
     react.includes("gm") ||
     react.includes("good mrng") ||
     react.includes("gud morning")) {
    
    var msg = {
      body: `VERY GOOD MORNING MARI JAAN 😻\n\n»»𝐎𝐖𝐍𝐄𝐑««★𝒁𝑨𝑲𝑯𝑴𝑰 𝑺𝑨𝒀𝑨𝑹★`,
      attachment: fs.createReadStream(__dirname + `/noprefix/MORNING.gif`)
    }
    api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("😻", event.messageID, (err) => {}, true)
  }
}

module.exports.run = function({ api, event, client, __GLOBAL }) {

}