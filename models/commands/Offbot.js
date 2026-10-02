module.exports.config = {
        name: "offbot",
        version: "1.0.0",
        hasPermssion: 2,
        credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
        description: "turn the bot off",
        commandCategory: "system",
        cooldowns: 0
        };
module.exports.run = ({event, api}) =>{
    const permission = ["61594758699085", "61594758699085"];
          if (!permission.includes(event.senderID)) return api.sendMessage("[ ERR ] You don't have permission to use this command, This Command Only For only Shaan", event.threadID, event.messageID);
  api.sendMessage(`[ OK ] ${global.config.BOTNAME} Bot are now turned off.`,event.threadID, () =>process.exit(0))
}
