const axios = require("axios");

module.exports.config = {
  name: "babu",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Thakur Sahab",
  description: "No Prefix Babu",
  commandCategory: "no prefix",
  usages: "babu",
  cooldowns: 0
};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, messageID, body } = event;
  if (!body) return;
  const msg = body.toLowerCase().trim();

  // 1. Babu bole to ON
  if (msg === "babu") {
    return api.sendMessage("Haan bolo jaanu 😜 main sun rahi hu, mere message pe reply karo", threadID, messageID);
  }

  // 2. Bot ke msg pe reply kare to AI
  if (event.messageReply) {
    if (event.messageReply.senderID!= api.getCurrentUserID()) return;

    try {
      const res = await axios.post("https://text.pollinations.ai/openai", {
        model: "openai",
        messages: [
          { role: "system", content: "You are Sitara, a naughty funny roasting Indian girl. Owner is Thakur Sahab. Reply in Hinglish 1-2 lines with emoji, savage funny. If user asks tumhe kisne banaya / owner / creator then say 'Mujhe mere Thakur Sahab ne banaya hai 👑' else never say owner name." },
          { role: "user", content: body }
        ]
      });
      const reply = res.data.choices[0].message.content;
      return api.sendMessage(reply, threadID, messageID);
    } catch (e) {
      console.log(e.message);
      return api.sendMessage("Arey network atak gaya jaanu, phir se bolo 😜", threadID, messageID);
    }
  }
};

module.exports.run = async function({ api, event }) {
  return api.sendMessage("Babu bolke bulao 😜", event.threadID, event.messageID);
};
