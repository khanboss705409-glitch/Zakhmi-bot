const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "video",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "ARIF BABU",
    description: "Download YouTube videos in MP4 format",
    commandCategory: "Media",
    usages: "video <YouTube URL>",
    cooldowns: 5
};

module.exports.run = async function ({
    api,
    event,
    args
}) {
    const { threadID, messageID } = event;
    const PRIYANSHU_API_KEY = "apim_8lEUfewp8dXI9KphqYrqhbaJLs6w9tQz_Q6MdYbIC2I";

    const apiUrl =
        "https://priyanshuapi.qzz.io/api/runner/youtube-downloader-v2/download";

    let videoPath;

    try {
        const videoUrl = args.join(" ").trim();

        if (!videoUrl) {
            return api.sendMessage(
                "🎬 YouTube video ka URL do.\n\n" +
                "Example: video https://www.youtube.com/watch?v=VIDEO_ID",
                threadID,
                messageID
            );
        }

        if (!/^https?:\/\//i.test(videoUrl)) {
            return api.sendMessage(
                "❌ Valid YouTube URL bhejo.",
                threadID,
                messageID
            );
        }

        if (
            !/(youtube\.com|youtu\.be)$/i.test(
                new URL(videoUrl).hostname.replace(/^www\./, "")
            )
        ) {
            return api.sendMessage(
                "❌ Sirf YouTube video URL supported hai.",
                threadID,
                messageID
            );
        }

        api.sendMessage(
            "🎬 VIDEO DOWNLOADING\n\n" +
            "⏳ Video process ho raha hai...\n" +
            "Please wait!",
            threadID,
            messageID
        );

        // ================= API REQUEST =================
        const response = await axios.post(
            apiUrl,
            {
                url: videoUrl,
                format: "mp4",
                quality: "720"
            },
            {
                headers: {
                    Authorization:
                        `Bearer ${PRIYANSHU_API_KEY}`,
                    "Content-Type": "application/json"
                },
                timeout: 60000
            }
        );

        const data = response?.data?.data;

        if (!data || !data.downloadUrl) {
            throw new Error(
                "API se video download link nahi mila."
            );
        }

        // ================= CACHE FOLDER =================
        const cacheDir = path.join(__dirname, "cache");
        await fs.ensureDir(cacheDir);

        videoPath = path.join(
            cacheDir,
            `video_${Date.now()}.mp4`
        );

        // ================= DOWNLOAD MP4 =================
        const videoResponse = await axios.get(
            data.downloadUrl,
            {
                responseType: "stream",
                timeout: 180000,
                maxContentLength: 50 * 1024 * 1024,
                maxBodyLength: 50 * 1024 * 1024,
                headers: {
                    "User-Agent": "Mozilla/5.0"
                }
            }
        );

        await new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(videoPath);

            videoResponse.data.pipe(writer);

            writer.on("finish", resolve);
            writer.on("error", reject);

            videoResponse.data.on("error", reject);
        });

        // ================= CHECK FILE =================
        const stat = await fs.stat(videoPath);

        if (!stat.size) {
            throw new Error("Downloaded video file empty hai.");
        }

        // ================= SEND VIDEO =================
        api.sendMessage(
            {
                body:
                    "🎬 𝗩𝗜𝗗𝗘𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗗\n\n" +
                    `📌 Title: ${data.title || "YouTube Video"}\n` +
                    "🎞️ Format: MP4\n" +
                    "📺 Quality: 720p (if supported)\n" +
                    `📦 Size: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`,
                attachment: fs.createReadStream(videoPath)
            },
            threadID,
            (err) => {
                fs.unlink(videoPath).catch(() => {});

                if (err) {
                    console.error("[VIDEO SEND ERROR]", err);
                }
            },
            messageID
        );

    } catch (error) {
        console.error(
            "[VIDEO COMMAND ERROR]",
            error.response?.data || error.message || error
        );

        if (videoPath) {
            await fs.unlink(videoPath).catch(() => {});
        }

        return api.sendMessage(
            "❌ Video download nahi ho paaya.\n\n" +
            "Possible reasons:\n" +
            "• API key invalid hai.\n" +
            "• API MP4 format support nahi karti.\n" +
            "• Video unavailable hai ya file bahut badi hai.\n\n" +
            "Dobara try karo.",
            threadID,
            messageID
        );
    }
};
