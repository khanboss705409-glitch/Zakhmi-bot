module.exports.config = {
  name: "help2",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "ZAKHMI SAYAR",
  description: "THIS BOT IS ZAKHMI SAYAR",
  usePrefix: true,
  commandCategory: "BOT-ALL-COMMAND-NAME",
  usages: "HELP-2",
  cooldowns: 1,
  envConfig: {
    autoUnsend: true,
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

module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;
  if (!body || typeof body == "undefined" || body.indexOf("help")!= 0) return;
  const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
  if (splitBody.length == 1 ||!commands.has(splitBody[1].toLowerCase())) return;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const command = commands.get(splitBody[1].toLowerCase());
  const prefix = (threadSetting.hasOwnProperty("PREFIX"))? threadSetting.PREFIX : global.config.PREFIX;
  return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages)? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0)? getText("user") : (command.config.hasPermssion == 1)? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
}

module.exports.run = function({ api, event, args, getText }) {
  const fs = require("fs-extra");
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = (threadSetting.hasOwnProperty("PREFIX"))? threadSetting.PREFIX : global.config.PREFIX;

  const fbLink = "https://www.facebook.com/100016828397863";

  if (!command) {
    const arrayInfo = [];
    const page = parseInt(args[0]) || 1;
    const numberOfOnePage = 9999;
    let i = 0;
    let msg = "";

    for (var [name, value] of (commands)) {
      name += ``;
      arrayInfo.push(name);
    }
    arrayInfo.sort((a, b) => a.data - b.data);
    const startSlice = numberOfOnePage*page - numberOfOnePage;
    i = startSlice;
    const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);
    for (let item of returnArray) msg += `🥀 [${++i}] → ${prefix}${item} ♥️ \n`;

    const siu = `┏━━━━━┓\n 𝐙𝐀𝐊𝐇𝐌𝐈-𝐒𝐀𝐘𝐀𝐑 ✧═══•❁😛❁•═══✧\n┗━━━━━┛\n\n✧═══❁♥️𝐀𝐥𝐥 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓 ♥️❁═══✧`;

    const text = `\nPAGE 🥀 [ ${page}/${Math.ceil(arrayInfo.length/numberOfOnePage)} ]\n\n𝐎𝐔𝐑 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐊𝐄 𝐋𝐈𝐘𝐄 𝐌𝐄𝐍𝐔 𝐋𝐈𝐊𝐇𝐎 🙂✌️\n𝐓𝐇𝐈𝐒 𝐁𝐎𝐓 𝐈𝐒 𝐌𝐀𝐃𝐄 𝐁𝐘𝐄 ★𝒁𝑨𝑲𝑯𝑴𝑰 𝑺𝑨𝒀𝑨𝑹★\nFacebook: ${fbLink}\n\n─── 𝐀𝐓𝐓𝐈𝐓𝐔𝐃𝐄 𝐒𝐇𝐀𝐘𝐀𝐑𝐈 ───\n" Hum ZAKHMI SAYAR hai, zakham kha ke bhi muskurate hai,\n Jo hume bhul jaye, hum unhe yaad bhi nahi karte,\n Attitude to bachche dikhate hai,\n Hum to sidha dil me utar jate hai " 😎🔥\n\n🕊️ ═════ 💋𝐙𝐀𝐊𝐇𝐌𝐈 𝐒𝐀𝐘𝐀𝐑💋 ═════ 🕊️`;

    return api.sendMessage({
      body: siu + "\n\n" + msg + text,
      attachment: fs.createReadStream(__dirname + `/cache/ZAKHMI.jpg`)
    }, threadID, async (error, info) => {
      if (autoUnsend) {
        await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
        return api.unsendMessage(info.messageID);
      } else return;
    }, event.messageID);
  }

  return api.sendMessage({
    body: getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages)? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0)? getText("user") : (command.config.hasPermssion == 1)? getText("adminGroup") : getText("adminBot")), command.config.credits) + `\n\nFacebook: ${fbLink}`,
    attachment: fs.createReadStream(__dirname + `/cache/ZAKHMI.jpg`)
  }, threadID, messageID);
};