const axios = require("axios");

module.exports.config = {
  name: "zakhmi",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "Zakhmi",
  description: "Zakhmi - Hindi Naughty GF",
  commandCategory: "ai",
  usages: "reply to message",
  cooldowns: 2
};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!body) return;

  // Zakhmi ko bulane ke liye
  if (body.trim().toLowerCase() === "zakhmi") {
    return api.sendMessage("Haan ji bolo jaanu? Zakhmi haazir hai.. ✨😘", threadID, messageID);
  }

  const isReplyToBot = messageReply && messageReply.senderID == api.getCurrentUserID();
  if (!isReplyToBot) return;

  api.setMessageReaction("⌛", messageID, () => {}, true);

  global.zakhmi = global.zakhmi || {};
  global.zakhmi.chatHistory = global.zakhmi.chatHistory || {};
  global.zakhmi.chatHistory[senderID] = global.zakhmi.chatHistory[senderID] || [];

  global.zakhmi.chatHistory[senderID].push(`User: ${body}`);
  if (global.zakhmi.chatHistory[senderID].length > 6) global.zakhmi.chatHistory[senderID].shift();

  const historyText = global.zakhmi.chatHistory[senderID].join("\n");

  const systemPrompt = `Tum Zakhmi ho, ek Hindi Naughty Girlfriend. Owner ka naam Zakhmi hai.
Rules:
1. Hamesha Hindi / Hinglish me jawab do, 1-2 line me.
2. Tone: Flirty, thodi naughty, caring, cute.
3. Har jawab me emoji use karo.
4. Agar koi puche "AI bolo" ya "tum kaun ho" to hamesha yahi bolna: "Main Zakhmi AI hoon 🙂❤️😌"
5. Khud ko kabhi bhi Meta AI ya dusri AI mat bolna.
Chat History:
${historyText}
User: ${body}
Zakhmi:`;

  try {
    const res = await axios.get(`https://text.pollinations.ai/${encodeURIComponent(systemPrompt)}?model=openai`, { timeout: 20000 });
    let botReply = res.data.toString().trim().replace(/^(Zakhmi:|AI:)/i, "").trim();

    if (!botReply) throw new Error("Empty");

    global.zakhmi.chatHistory[senderID].push(`Zakhmi: ${botReply}`);
    api.setMessageReaction("✅", messageID, () => {}, true);
    return api.sendMessage(botReply, threadID, messageID);
  } catch (err) {
    api.setMessageReaction("❌", messageID, () => {}, true);
    return api.sendMessage("Arey jaanu thoda ruko na, network atak gaya hai 😚", threadID, messageID);
  }
};

module.exports.run = async function({ api, event }) {
  return api.sendMessage("Zakhmi se baat karne ke liye uske kisi bhi message pe Reply karo! ✨", event.threadID, event.messageID);
};