const fs = require("fs");
const path = require("path");
const axios = require("axios");
const ytSearch = require("yt-search");

const PRIYANSHU_API_KEY = "apim_Y0knVwjDGhQIp_hoN2GqAPEplwrsD_-Ow82DYfZE3Zs";
const API_DOWNLOAD_URL = "https://priyanshuapi.qzz.io/api/runner/youtube-downloader-v2/download";

module.exports.config = {
  name: "music",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
  description: "Download music/video directly from YouTube",
  commandCategory: "media",
  usages: "[song name] ya video [song name]",
  cooldowns: 0
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  if (!args.length) {
    return api.sendMessage("❌ Kripya gaane ka naam ya YouTube URL enter karein.", threadID, messageID);
  }

  let formatType = "mp3";
  let targetQuality = "360";
  let searchTerms = [...args];

  // Agar user ne 'video' likha ho toh video format select hoga
  const videoIndex = searchTerms.findIndex(arg => arg.toLowerCase() === "video");
  if (videoIndex !== -1) {
    formatType = "mp4";
    targetQuality = "360";
    searchTerms.splice(videoIndex, 1);
  }

  const inputQuery = searchTerms.join(" ").trim();
  if (!inputQuery) {
    return api.sendMessage("❌ Kripya gaane ka naam enter karein.", threadID, messageID);
  }

  let processingMsg = null;

  try {
    processingMsg = await api.sendMessage(`🔍 Searching & downloading ${formatType === "mp4" ? "video" : "audio"}...`, threadID, messageID);

    let videoUrl = inputQuery;
    let videoTitle = "";

    const isUrl = /^(https?:\/\/)?(www\.|m\.)?(youtube\.com|youtu\.be)(\/|$)/.test(inputQuery);

    if (!isUrl) {
      const searchResult = await ytSearch(inputQuery);
      if (!searchResult || !searchResult.videos.length) {
        if (processingMsg) api.unsendMessage(processingMsg.messageID);
        return api.sendMessage("❌ YouTube par gaana nahi mila.", threadID, messageID);
      }
      const topVideo = searchResult.videos[0];
      videoUrl = topVideo.url;
      videoTitle = topVideo.title;
    } else {
      const videoIdMatch = inputQuery.match(/(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/|v\/)|youtu\.be\/)([0-9A-Za-z_-]{11})/);
      if (videoIdMatch) {
        const searchResult = await ytSearch({ videoId: videoIdMatch[1] });
        if (searchResult) videoTitle = searchResult.title;
      }
    }

    // Direct Priyanshu API call
    const response = await axios.post(
      API_DOWNLOAD_URL,
      { link: videoUrl, format: formatType, videoQuality: targetQuality },
      { headers: { Authorization: `Bearer ${PRIYANSHU_API_KEY}`, "Content-Type": "application/json" } }
    );

    if (!response.data || !response.data.success || !response.data.data) {
      if (processingMsg) api.unsendMessage(processingMsg.messageID);
      return api.sendMessage("❌ Download link fetch karne me error aaya.", threadID, messageID);
    }

    const { downloadUrl, title } = response.data.data;
    const finalTitle = videoTitle || title || "Music";

    // Temp file setup
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    const ext = formatType === "mp4" ? "mp4" : "mp3";
    const filePath = path.join(cacheDir, `${Date.now()}.${ext}`);
    const writer = fs.createWriteStream(filePath);

    const streamResponse = await axios({ method: "GET", url: downloadUrl, responseType: "stream" });
    streamResponse.data.pipe(writer);

    writer.on("finish", () => {
      if (processingMsg) api.unsendMessage(processingMsg.messageID);

      api.sendMessage(
        {
          body: `🎵 ${finalTitle}`,
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        () => fs.unlink(filePath, () => {}),
        messageID
      );
    });

    writer.on("error", () => {
      if (processingMsg) api.unsendMessage(processingMsg.messageID);
      api.sendMessage("❌ File write karne me error aaya.", threadID, messageID);
    });

  } catch (error) {
    console.error(error);
    if (processingMsg) api.unsendMessage(processingMsg.messageID);
    api.sendMessage("❌ Gaana download karne me error aaya.", threadID, messageID);
  }
};
