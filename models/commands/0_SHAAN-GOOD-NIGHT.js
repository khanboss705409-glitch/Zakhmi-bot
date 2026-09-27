const fs = require("fs");
module.exports.config = {
  name: "good night",
  version: "1.1.1",
  hasPermssion: 0,
  credits: "ZAKHMI SAYAR",
  description: "Just Respond - Good Night",
  commandCategory: "no prefix",
  cooldowns: 5,
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
  var { threadID, messageID } = event;
  if (!event.body) return;
  let react = event.body.toLowerCase();
  
  if(react.includes("night") || 
     react.includes("good night") || 
     react.includes("gn") ||
     react.includes("शुभ रात्रि") ||
     react.includes("gud night") ||
     react.includes("good n8")) {
    
    var msg = {
      body: `GOOD NIGHT 😴 SWEET DREAM 😇\n\n»»𝐎𝐖𝐍𝐄𝐑««★𝒁𝑨𝑲𝑯𝑴𝑰 𝑺𝑨𝒀𝑨𝑹★`,