module.exports.config = {
  name: "help",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "ZAKHMI SAYAR",
  description: "commands list",
  commandCategory: "system",
  usages: "[command name]",
  cooldowns: 1,
  envConfig: {
    autoUnsend: false,
    delayUnsend: 300
  }
};

module.exports.languages = {
  "en": {
    "moduleInfo": "─────[ %1 ]──────\n\nUsage: %3\nCategory: %4\nWaiting time: %5 seconds(s)\nPermission: %6\nDescription: %2\n\nModule coded by %7",
    "helpList": '[ There are %1 commands on this bot, Use: "%2help nameCommand" to know how to use! ]',
    "user": "User",
    "adminGroup": "Admin group",
    "adminBot": "Admin bot"
  }
};

module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;
  if (!body) return;
  // Prefix hata ke check karega -.help bhi chalega aur help bhi
  const prefix = global.config.PREFIX || ".";
  let bodyLower = body.toLowerCase();
  if (bodyLower.startsWith(prefix)) bodyLower = bodyLower.slice(prefix.length).trim();

  if (!bodyLower.startsWith("help")) return;

  const splitBody = bodyLower.split(/\s+/);
  if (splitBody.length == 1 ||!commands.has(splitBody[1].toLowerCase())) return;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const threadPrefix = threadSetting.PREFIX || global.config.PREFIX;
  const command = commands.get(splitBody[1].toLowerCase());
  return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${threadPrefix}${command.config.name} ${(command.config.usages)? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0)? getText("user") : (command.config.hasPermssion == 1)? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
}

module.exports.run = async function({ api, event, args, getText }) {
  const fs = require("fs-extra");
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  const fbLink = "https://www.facebook.com/profile.php?id=61595007082014";

  // Agar "all" likha ho
  if (args[0] == "all") {
    const allCommands = commands.values();
    var group = [], msg = "";
    for (const commandConfig of allCommands) {
      if (!group.some(item => item.group.toLowerCase() == commandConfig.config.commandCategory.toLowerCase()))
        group.push({ group: commandConfig.config.commandCategory.toLowerCase(), cmds: [commandConfig.config.name] });
      else
        group.find(item => item.group.toLowerCase() == commandConfig.config.commandCategory.toLowerCase()).cmds.push(commandConfig.config.name);
    }
    group.forEach(commandGroup => msg += `☂︎ ${commandGroup.group.charAt(0).toUpperCase() + commandGroup.group.slice(1)} \n${commandGroup.cmds.join(' • ')}\n\n`);
    return api.sendMessage(`𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗟𝗶𝘀𝘁\n\n${msg}\nTotal Commands: ${commands.size}\n\nDeveloper: ★𝒁𝑨𝑲𝑯𝑴𝑰 𝑺𝑨𝒀𝑨𝑹★\nFacebook: ${fbLink}`, threadID, messageID);
  }

  // Agar koi command ka naam diya ho -.help info
  if (command) {
    return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages)? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0)? getText("user") : (command.config.hasPermssion == 1)? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
  }

  // Agar sirf.help likha ho - Sab commands dikhao
  else {
    const allCommands = commands.values();
    var group = [], msg = "";
    for (const commandConfig of allCommands) {
      if (!group.some(item => item.group.toLowerCase() == commandConfig.config.commandCategory.toLowerCase()))
        group.push({ group: commandConfig.config.commandCategory.toLowerCase(), cmds: [commandConfig.config.name] });
      else
        group.find(item => item.group.toLowerCase() == commandConfig.config.commandCategory.toLowerCase()).cmds.push(commandConfig.config.name);
    }
    group.forEach(commandGroup => msg += `✦ ${commandGroup.group.charAt(0).toUpperCase() + commandGroup.group.slice(1)} \n${commandGroup.cmds.join(' • ')}\n\n`);

    return api.sendMessage({
      body: `╭───『 ZAKHMI BOT 』───╮\n\n${msg}├─────♡─────┤\n│ Total: ${commands.size} commands\n│ Prefix: ${prefix}\n│ Use: ${prefix}help [cmd name]\n│ Owner: M.R ZAKHMI SAYAR\n╰───────────────╯`,
      attachment: fs.existsSync(__dirname + `/cache/ZAKHMI.jpg`)? fs.createReadStream(__dirname + `/cache/ZAKHMI.jpg`) : null
    }, threadID, messageID);
  }
};