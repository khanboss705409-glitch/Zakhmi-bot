module.exports.config = {
  name: "help2",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "ZAKHMI SAYAR",
  description: "All commands list",
  usePrefix: true,
  commandCategory: "system",
  usages: "[page]",
  cooldowns: 1,
  envConfig: {
    autoUnsend: false, // true tha to message 5 min me delete ho jata tha, ab nahi hoga
    delayUnsend: 300
  }
};

module.exports.languages = {
  "en": {
    "moduleInfo": "「 %1 」\n%2\n\n❯ Usage: %3\n❯ Category: %4\n❯ Waiting time: %5 seconds(s)\n❯ Permission: %6\n\n» Module code by %7 «",
    "helpList": '[ There are %1 commands on this bot, Use: "%2help nameCommand" to know how to use! ]',
    "user": "User",
    "adminGroup": "Admin group",
    "adminBot": "Admin bot"
  }
};

module.exports.run = async function({ api, event, args, getText }) {
  const fs = require("fs-extra");
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  const fbLink = "https://www.facebook.com/profile.php?id=61595007082014";
  const imgPath = __dirname + `/cache/ZAKHMI.jpg`;

  const command = commands.get((args[0] || "").toLowerCase());

  // Agar koi command ka naam likha ho -.help2 info
  if (command) {
    return api.sendMessage({
      body: getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages)? command.config.usages : ""}`, command.config.commandCategory, command.config