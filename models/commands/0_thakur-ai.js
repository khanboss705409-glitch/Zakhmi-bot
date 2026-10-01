const axios = require("axios");

// ===== OWNER CONFIG =====
const OWNER_TAG = "Thakur sahab";
const OWNER_UID = "61594758699085";

// ===== MODULE CONFIG =====
module.exports.config = {
  name: "THAKUR-AI",
  version: "2.0.3",
  hasPermssion: 0,
  credits: "Thakur sahab",
  description: "Thakur sahab AI",
  commandCategory: "ai",
  usages: "bot <msg> | ai | reply",
  cooldowns: 2,
  dependencies: {
    axios: ""
  }
};

// ===== API CONFIGURATION =====
const API_URL =
  "https://priyanshuapi.qzz.io/api/runner/lite-ai/chat";

// ===== SYSTEM PROMPT =====
const SYSTEM_PROMPT = `
Tum Thakur sahab AI ho 🙂

Creator & Owner: ${OWNER_TAG} ❤️
Owner UID: ${OWNER_UID}
Tum Jhansi se ho.

Golden Rules:
• User jis language mein bole, usi language aur vibe mein reply dena 🙂
• Reply playful, caring aur friendly hona chahiye 😌❤️
• Har message ka jawab dena 😇
• Tone soft aur pyara hona chahiye 💞
• Reply sirf 1–2 short lines ka rakhna.
• Zarurat ke hisaab se shayari, jokes aur emotional support dena.
• User agar "AI bolo" bole to exact reply dena:
"Main Thakur sahab AI hoon 🙂❤️"
`;

// ===== CHAT HISTORY =====
const history = {};

// ===== AI FUNCTION =====
async function getAiReply(senderID, promptText) {

  const apiKey =
    global.config?.apiKeys?.priyanshuApi ||
    "apim_8lEUfewp8dXI9KphqYrqhbaJLs6w9tQz_Q6MdYbIC2I";

  const response = await axios.post(
    API_URL,
    {
      uid: String(senderID),
      prompt: promptText,
      systemPrompt: SYSTEM_PROMPT
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      timeout: 30000
    }
  );

  return (
    response.data?.data?.choices?.[0]?.message?.content?.trim() ||
    "Hmm... samajh nahi aaya. Fir se bolo?"
  );
}

// ===== COMMAND =====
module.exports.run = () => {};

// ===== EVENT HANDLER =====
module.exports.handleEvent = async function ({ api, event }) {

  const {
    threadID,
    messageID,
    senderID,
    body,
    messageReply
  } = event;

  if (!body) return;

  const text = body.toLowerCase().trim();

  // ===== TRIGGERS =====
  const botWithText = text.startsWith("bot ");

  const exactAI =
    text === "ai" ||
    text === "ai bolo" ||
    text === "ai baby";

  const replyToBot =
    messageReply &&
    messageReply.senderID === api.getCurrentUserID();

  if (!botWithText && !exactAI && !replyToBot) return;

  // ===== USER MESSAGE =====
  const userMessage = botWithText
    ? body.slice(4).trim()
    : body;

  if (!userMessage) return;

  // ===== HISTORY =====
  if (!history[senderID]) {
    history[senderID] = [];
  }

  history[senderID].push(`User: ${userMessage}`);

  if (history[senderID].length > 5) {
    history[senderID].shift();
  }

  const finalPrompt = history[senderID].join("\n");

  // ===== THINKING REACTION =====
  api.setMessageReaction(
    "⌛",
    messageID,
    () => {},
    true
  );

  // ===== TYPING ON =====
  try {
    api.sendTypingIndicator(threadID, true);
  } catch (e) {
    console.log(
      "Typing indicator error:",
      e.message
    );
  }

  try {

    // ===== AI RESPONSE GENERATING =====
    const reply = await getAiReply(
      senderID,
      finalPrompt
    );

    // ===== TYPING OFF =====
    try {
      api.sendTypingIndicator(threadID, false);
    } catch (e) {}

    // ===== SAVE RESPONSE =====
    history[senderID].push(`Bot: ${reply}`);

    if (history[senderID].length > 5) {
      history[senderID].shift();
    }

    // ===== SEND AI REPLY =====
    api.sendMessage(
      reply,
      threadID,
      messageID
    );

    // ===== SUCCESS REACTION =====
    api.setMessageReaction(
      "✅",
      messageID,
      () => {},
      true
    );

  } catch (err) {

    // ===== TYPING OFF ON ERROR =====
    try {
      api.sendTypingIndicator(threadID, false);
    } catch (e) {}

    console.log(
      "THAKUR-AI Error:",
      err.response?.data || err.message
    );

    api.sendMessage(
      "AI mein thoda issue aa gaya 😔 baad mein try karo 🥺❤️",
      threadID,
      messageID
    );

    api.setMessageReaction(
      "❌",
      messageID,
      () => {},
      true
    );
  }
};
