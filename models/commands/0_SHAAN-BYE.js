module.exports.config = {
  name: "O_ZAKHMI-BYE",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "ZAKHMI SAYAR",
  description: "BYE pe Zakhmi ka gif",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 2
};

const fs = require('fs');

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
  var { threadID, messageID } = event;
  if (!event.body) return;
  let react = event.body.toLowerCase();
  
  if(react.includes("bye") || 
     react.includes("byy") || 
     react.includes("byyy") || 
     react.includes("alvida") || 
     react.includes("अलविदा")) {
    
    var msg = {
      body: `BYE BYE 🙋 TAKE CARE BABU 😇\n\n»»𝐎𝐖𝐍𝐄𝐑««★𝒁𝑨𝑲𝑯𝑴𝑰 𝑺𝑨𝒀𝑨𝑹★`,
      attachment: fs.createReadStream(__dirname + `/noprefix/BYE.gif`)
    }
    api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🙋", event.messageID, (err) => {}, true)
  }
}

module.exports.run = function({ api, event, client, __GLOBAL }) {

}