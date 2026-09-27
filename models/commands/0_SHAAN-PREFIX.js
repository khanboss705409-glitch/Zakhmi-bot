module.exports.config = {
  name: "prefix",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "ZAKHMI SAYAR",
  description: "Stylish prefix",
  commandCategory: "system",
  usages: "prefix",
  cooldowns: 5
};

function getMsg(prefix) {
  const now = new Date();
  const time = now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
  const date = now.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "long", year: "numeric" });
  const day = now.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", weekday: "long" });
  return `
╭────── • ──────────╮
   ✦  𝐙𝐀𝐊𝐇𝐌𝐈 𝐁𝐎𝐓  ✦
╰────── • ──────────╯
┏━━━━━━━━━━━━━━━━━┓
┃  🎯 𝐏𝐑𝐄𝐅𝐈𝐗 𝐈𝐍𝐅𝐎 🎯
┗━━━━━━━━━━━━━━━━━┛
 「💣」𝐏𝐑𝐄𝐅𝐈𝐗  ➟  ${prefix}
 「⏰」𝐓𝐈𝐌𝐄    ➟  ${time}
 「📅」𝐃𝐀𝐓𝐄    ➟  ${date}
 「🌸」𝐃𝐀𝐘     ➟  ${day}
┏━━━━━━━━━━━━━━━━━┓
┃  👑 𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎 👑
┗━━━━━━━━━━━━━━━━━┛
  ★᭄ 𝗡𝗮𝗺𝗲 : 𝒁𝑨𝑲𝑯𝑴𝑰 𝑺𝑨𝒀𝑨𝑹
  ★᭄ 𝗙𝗕 : https://www.facebook.com/profile.php?id=61595007082014
 ──═━═── 𝐀𝐓𝐓𝐈𝐓𝐔𝐃𝐄 ──═━═──
   " Hum Zakhmi Sayar Hai,
     Khel Mohabbat Ka Nahi,
     Attitude Ka Khelte Hai " 😎🔥
╰── ⋅ ⋅ ── ♡ ── ⋅ ⋅ ──╯
`;
}

module.exports.handleEvent = async ({ event, api }) => {
  const { threadID, messageID, body } = event;
  if (!body) return;
  if (!["prefix", "mprefix", "mpre", "bot prefix", "prefix kya hai"].includes(body.toLowerCase())) return;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;
  const fs = require("fs-extra");
  return api.sendMessage({ body: getMsg(prefix), attachment: fs.createReadStream(__dirname + `/cache/ZAKHMI.jpg`) }, threadID, messageID);
};

module.exports.run = async ({ event, api }) => {
  const threadSetting = global.data.threadData.get(parseInt(event.threadID)) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;
  const fs = require("fs-extra");
  return api.sendMessage({ body: getMsg(prefix), attachment: fs.createReadStream(__dirname + `/cache/ZAKHMI.jpg`) }, event.threadID);
};