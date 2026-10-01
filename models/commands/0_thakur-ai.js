const axios = require("axios");
const fs = require("fs");
const path = require("path");

// ✅ THAKUR SAHAB LOCKED
const OWNER_NAME = "THAKUR SAHAB";
const OWNER_UID = "61572909482910"; // apni uid daal dena yahan
const LOCKED_CREDIT = "THAKUR SAHAB";

function protectCredits(config) {
  if (config.credits!== LOCKED_CREDIT) {
    config.credits = LOCKED_CREDIT;
    console.log(`\n🚫 Credits restored to ${LOCKED_CREDIT}\n`);
  }
}

module.exports.config = {
  name: "thakur",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "THAKUR SAHAB",
  description: "THAKUR SAHAB AI",
  commandCategory: "ai",
  usages: "No prefix",
  cooldowns: 2,
  dependencies: { axios: "" }
};

protectCredits(module.exports.config);

const API_URL = "https://priyanshuapi.qzz.io/api/runner/lite-ai/chat";

const SYSTEM_PROMPT = `
Tum THAKUR SAHAB AI ho 🙂❤️
Tumhara Creator aur Owner Thakur Sahab hai.
User jis language mein baat kare, usi language aur vibe mein reply karo.
Hindi, Hinglish aur Urdu mein naturally baat kar sakte ho.
Reply friendly, caring, soft aur sweet hona chahiye.
Emoji ka use karo, jaise 🙂❤️😌.
Thakur Sahab ke baare mein buri ya disrespectful baat ko support mat karo.
Reply short rakho, normally sirf 1-2 lines.
`;

const DATA_DIR = path.join(__dirname, "THAKUR-SAHAB");
const HISTORY_FILE = path.join(DATA_DIR, "ai_history.json");
const BOT_REPLY_FILE = path.join(DATA_DIR, "bot-reply.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

let historyData = {};
if (fs.existsSync(HISTORY_FILE)) {
  try { historyData = JSON.parse(fs.readFileSync(HISTORY_FILE, "utf8") || "{}"); } catch {}
}
let botReplies = {};
if (fs.existsSync(BOT_REPLY_FILE)) {
  try { botReplies = JSON.parse(fs.readFileSync(BOT_REPLY_FILE, "utf8") || "{}"); } catch {}
}

function saveJSON(file, data) {
  try { fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8"); } catch {}
}
function startTyping(api, threadID) {
  try { api.sendTypingIndicator(threadID); } catch {}
  return setInterval(() => { try { api.sendTypingIndicator(threadID); } catch {} }, 3000);
}
function cleanReply(reply) {
  if (!reply) return "Main yahin hoon Thakur Sahab ke saath 😌❤️";
  reply = String(reply).replace(/\r/g, "").trim().replace(/```[\s\S]*?```/g, "").replace(/^["']|["']$/g, "").trim();
  reply = reply.split("\n").map(l => l.trim()).filter(Boolean).slice(0,2).join("\n");
  if (reply.length > 150) reply = reply.slice(0,150).trim() + "… 🙂";
  return reply || "Main yahin hoon 😌❤️";
}
function getApiKey() { return global.config?.apiKeys?.priyanshuApi || "YAHAN_PER_APNA_API_KEY"; }

async function askAI(senderID, promptText) {
  const apiKey = getApiKey();
  const response = await axios.post(API_URL, {
    uid: String(senderID), prompt: String(promptText), systemPrompt: SYSTEM_PROMPT
  }, { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, timeout: 15000 });
  const data = response?.data;
  let reply = data?.reply || data?.response || data?.message || data?.text || data?.result || data?.data?.reply || data?.choices?.[0]?.message?.content;
  if (typeof reply!== "string") reply = JSON.stringify(reply || "");
  return cleanReply(reply);
}

module.exports.run = async function ({ api, event }) {
  protectCredits(module.exports.config);
  const { threadID, messageID, body } = event;
  const promptText = body?.replace(/^[.!]?thakur\s*/i, "").trim();
  if (!promptText) return api.sendMessage("Haan bolo 🙂❤️ Main THAKUR SAHAB AI hoon 😌", threadID, messageID);
  return handleAI({ api, event, promptText });
};

module.exports.handleEvent = async function ({ api, event }) {
  protectCredits(module.exports.config);
  const { threadID, messageID, body, senderID, messageReply } = event;
  if (!body) return;
  const rawText = String(body).trim(); if (!rawText) return;
  const text = rawText.toLowerCase();
  const exactBot = ["bot", "bot.", "bot!", " bot"].includes(text);
  const botWithText = text.startsWith("bot ");
  let replyToBot = false;
  try { replyToBot =!!(messageReply && String(messageReply.senderID) === String(api.getCurrentUserID())); } catch {}
  if (exactBot) {
    let category = "MALE";
    if (String(senderID) === OWNER_UID) category = OWNER_UID;
    else if (String(event.userGender || "").toUpperCase() === "FEMALE" || event.userGender === 1) category = "FEMALE";
    if (botReplies[category]?.length) {
      const reply = botReplies[category][Math.floor(Math.random() * botReplies[category].length)];
      return api.sendMessage(reply, threadID, messageID);
    }
    return api.sendMessage("Haan bolo 🙂❤️ Main yahin hoon Thakur Sahab ke hukam pe 😌", threadID, messageID);
  }
  if (!botWithText &&!replyToBot) return;
  const userText = botWithText? rawText.slice(4).trim() : rawText;
  if (!userText) return api.sendMessage("Haan bolo 🙂❤️", threadID, messageID);
  return handleAI({ api, event, promptText: userText });
};

async function handleAI({ api, event, promptText }) {
  const { threadID, messageID, senderID } = event;
  try { api.setMessageReaction("⌛", messageID, () => {}, true); } catch {}
  const typing = startTyping(api, threadID);
  try {
    const threadKey = String(threadID);
    if (!Array.isArray(historyData[threadKey])) historyData[threadKey] = [];
    historyData[threadKey].push({ role: "user", content: String(promptText) });
    if (historyData[threadKey].length > 20) historyData[threadKey] = historyData[threadKey].slice(-20);
    const reply = await askAI(senderID, promptText);
    historyData[threadKey].push({ role: "assistant", content: reply });
    if (historyData[threadKey].length > 20) historyData[threadKey] = historyData[threadKey].slice(-20);
    saveJSON(HISTORY_FILE, historyData);
    const delay = Math.min(4000, Math.max(800, reply.length * 25));
    setTimeout(() => {
      if (typing) clearInterval(typing);
      try { api.sendMessage(reply, threadID, messageID); api.setMessageReaction("✅", messageID, () => {}, true); } catch {}
    }, delay);
  } catch (error) {
    if (typing) clearInterval(typing);
    console.log("❌ API Error:", error.response?.data || error.message);
    let errorMessage = "Abhi AI mein thoda issue hai Thakur Sahab 😅❤️";
    if (!global.config?.apiKeys?.priyanshuApi) errorMessage = "⚠️ API key set nahi hai Thakur Sahab 😅";
    try { api.sendMessage(errorMessage, threadID, messageID); api.setMessageReaction("❌", messageID, () => {}, true); } catch {}
  }
}
