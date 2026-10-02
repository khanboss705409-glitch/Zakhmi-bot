const axios = require("axios");
const yts = require("yt-search");

/* 🔐 Credits Lock - Imran Khan */
function checkCredits() {
  if (module.exports.config.credits!== "Imran Khan") {
    throw new Error("❌ Credits Locked By Imran Khan");
  }
}

const frames = [
  "💕 Song Mil Gaya! 💕",
  "❤️ ▰▱▱▱▱▱ 20%",
  "❤️ ▰▰▰▱▱▱▱▱▱▱ 40%",
  "❤️ ▰▰▰▰▰▱▱▱▱▱ 60%",
  "❤️ ▰▰▰▰▰▰▰▱▱▱ 80%",
  "❤️ ▰▰▰▰▰▰▰▰▰▰ 100%"
];

const baseApiUrl = async () => {
  try {
    const res = await axios.get("https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json");
    return res.data.api;
  } catch { return "https://api.dipto.example.com"; }
};

(async () => {
  global.apis = { diptoApi: await baseApiUrl() };
})();

async function getStreamFromURL(url, name) {
  const res = await axios.get(url, { responseType: "stream" });
  res.data.path = name;
  return res.data;
}

function getVideoID(url) {
  const r = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([\w-]{11})/;
  const m = url.match(r);
  return m? m[1] : null;
}

module.exports.config = {
  name: "music",
  version: "1.4.0",
  credits: "Imran Khan",
  hasPermssion: 0,
  cooldowns: 5,
  description: "Fixed Music Downloader",
  commandCategory: "media",
  usages: "music <name>"
};

module.exports.run = async function ({ api, args, event }) {
  try {
    checkCredits();
    if (!args[0]) return api.sendMessage("❌ Song ka naam likho jaan ❤️\nEx:.music tere jesa yar kaha", event.threadID, event.messageID);

    const input = args.join(" ");
    let loading = await api.sendMessage("🔍 Searching... 💕", event.threadID);

    for (const f of frames.reverse()) { // aapke screenshot jaisa
      await new Promise(r => setTimeout(r, 300));
      try{ await api.editMessage(f, loading.messageID); }catch{}
    }

    let videoID, title;
    if (input.includes("youtu")) {
      videoID = getVideoID(input);
      title = "YouTube Song";
    } else {
      const search = await yts(input);
      if (!search.videos.length) throw new Error("No result");
      videoID = search.videos[0].videoId;
      title = search.videos[0].title;
    }

    // 3 API Try Karenge
    let data = null;
    const apis = [
      `${global.apis.diptoApi}/ytDl3?link=${videoID}&format=mp3`,
      `https://api.dipto.is-a.fun/ytDl3?link=${videoID}&format=mp3`,
      `https://noobs-api.rn2r.workers.dev/dipto/ytDl3?link=${videoID}&format=mp3`
    ];

    for (const apiUrl of apis) {
      try {
        const res = await axios.get(apiUrl, { timeout: 15000 });
        if (res.data && res.data.downloadLink) { data = res.data; break; }
      } catch (e) { console.log("API fail:", apiUrl); }
    }

    if (!data) throw new Error("All APIs down");

    const short = (await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(data.downloadLink)}`)).data.catch(()=> data.downloadLink);

    await api.unsendMessage(loading.messageID);

    return api.sendMessage({
      body: `💖 ${data.title || title}\n❤️ ▰▰▰▰▰▰ 100%\n👑 By Imran Khan\n🔗 ${short}`,
      attachment: await getStreamFromURL(data.downloadLink, `${data.title}.mp3`)
    }, event.threadID, event.messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("⚠️ Server busy hai jaan, 2 min baad try karo 💔\nAgar bar ho raha hai to API change karna padega", event.threadID, event.messageID);
  }
};
