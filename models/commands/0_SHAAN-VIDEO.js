const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const yts = require("yt-search");

module.exports.config = {
    name: "video",
    version: "3.0.0",
    hasPermssion: 0,
    credits: "ARIF BABU",
    description: "Download YouTube videos using URL or name",
    commandCategory: "Media",
    usages: "video <name or YouTube URL>",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    const API_KEY = "apim_8lEUfewp8dXI9KphqYrqhbaJLs6w9tQz_Q6MdYbIC2I";
    const API_URL =
        "https://priyanshuapi.qzz.io/api/runner/youtube-downloader-v2/download";

    let videoPath = null;
    let progressMessageID = null;

    const send = (body, callback) => {
        api.sendMessage(body, threadID, callback, messageID);
    };

    try {
        const input = args.join(" ").trim();

        if (!input) {
            return send(
                "🎬 VIDEO DOWNLOADER\n\n" +
                "Video ka naam ya YouTube URL likho.\n\n" +
                "Example:\n" +
                "video Arijit Singh song\n" +
                "video https://youtu.be/VIDEO_ID"
            );
        }

        let videoUrl = input;
        let searchTitle = "";

        // =====================================
        // 1. URL HAI YA VIDEO NAME?
        // =====================================
        if (!/^https?:\/\//i.test(input)) {
            // Video name se YouTube search
            send("🔎 YouTube par video search ho raha hai...");

            const search = await yts(input);

            if (!search || !search.videos || !search.videos.length) {
                return send(
                    "❌ Is naam ka video nahi mila.\n" +
                    "Dusra naam try karo."
                );
            }

            const result = search.videos[0];

            videoUrl = result.url;
            searchTitle = result.title || input;

        } else {
            // URL validate
            let parsedURL;

            try {
                parsedURL = new URL(input);
            } catch {
                return send("❌ Valid YouTube URL bhejo.");
            }

            const hostname = parsedURL.hostname
                .toLowerCase()
                .replace(/^www\./, "");

            const isYouTube =
                hostname === "youtube.com" ||
                hostname.endsWith(".youtube.com") ||
                hostname === "youtu.be";

            if (!isYouTube) {
                return send(
                    "❌ Sirf YouTube video URL supported hai."
                );
            }

            // Video URL se title nikalne ki koshish
            try {
                const info = await yts({ videoId:
                    parsedURL.searchParams.get("v") ||
                    parsedURL.pathname.split("/").filter(Boolean).pop()
                });

                searchTitle = info.title || "";
            } catch (_) {
                searchTitle = "";
            }
        }

        // =====================================
        // 2. DOWNLOAD MESSAGE
        // =====================================
        send(
            "🎬 VIDEO DOWNLOADING\n\n" +
            `📌 ${searchTitle || "YouTube Video"}\n\n` +
            "⏳ Video process ho raha hai...\n" +
            "Please wait!"
        );

        // =====================================
        // 3. DOWNLOADER API
        // =====================================
        const response = await axios.post(
            API_URL,
            {
                url: videoUrl,
                format: "mp4",
                quality: "720"
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                },
                timeout: 90000
            }
        );

        const result = response.data?.data;

        if (!result || !result.downloadUrl) {
            console.error(
                "[VIDEO API RESPONSE]",
                JSON.stringify(response.data)
            );

            throw new Error(
                "API response mein downloadUrl nahi mila."
            );
        }

        // =====================================
        // 4. CACHE FOLDER
        // =====================================
        const cacheDir = path.join(__dirname, "cache");
        await fs.ensureDir(cacheDir);

        videoPath = path.join(
            cacheDir,
            `video_${Date.now()}.mp4`
        );

        // =====================================
        // 5. DOWNLOAD MP4 FILE
        // =====================================
        const videoResponse = await axios.get(
            result.downloadUrl,
            {
                responseType: "stream",
                timeout: 180000,
                maxRedirects: 5,
                headers: {
                    "User-Agent": "Mozilla/5.0"
                }
            }
        );

        let downloadedBytes = 0;
        const maxSize = 50 * 1024 * 1024;

        const writer = fs.createWriteStream(videoPath);

        await new Promise((resolve, reject) => {
            videoResponse.data.on("data", chunk => {
                downloadedBytes += chunk.length;

                if (downloadedBytes > maxSize) {
                    videoResponse.data.destroy(
                        new Error("Video 50 MB se badi hai.")
                    );
                    writer.destroy(
                        new Error("Video 50 MB se badi hai.")
                    );
                }
            });

            videoResponse.data.on("error", reject);
            writer.on("error", reject);
            writer.on("finish", resolve);

            videoResponse.data.pipe(writer);
        });

        // =====================================
        // 6. CHECK FILE
        // =====================================
        const stat = await fs.stat(videoPath);

        if (!stat.size) {
            throw new Error("Downloaded file empty hai.");
        }

        // =====================================
        // 7. SEND VIDEO
        // =====================================
        const title = result.title || searchTitle || "YouTube Video";

        api.sendMessage(
            {
                body:
                    "🎬 𝗩𝗜𝗗𝗘𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗗\n\n" +
                    `📌 Title: ${title}\n` +
                    "🎞️ Format: MP4\n" +
                    "📺 Quality: 720p (if available)\n" +
                    `📦 Size: ${(stat.size / (1024 * 1024)).toFixed(2)} MB\n\n` +
                    "👑 MADE BY KHAN SAHAB",
                attachment: fs.createReadStream(videoPath)
            },
            threadID,
            async err => {
                if (err) {
                    console.error("[VIDEO SEND ERROR]", err);
                }

                await fs.unlink(videoPath).catch(() => {});
            },
            messageID
        );

        videoPath = null;

    } catch (error) {
        console.error(
            "[VIDEO COMMAND ERROR]",
            error.response?.data || error.message || error
        );

        if (videoPath) {
            await fs.unlink(videoPath).catch(() => {});
        }

        return send(
            "❌ Video download nahi ho paaya.\n\n" +
            "Possible reasons:\n" +
            "• API key galat hai ya missing hai.\n" +
            "• Downloader API unavailable hai.\n" +
            "• Video private ya unavailable hai.\n" +
            "• Video 50 MB se badi hai.\n" +
            "• API ka response format badal gaya hai.\n\n" +
            "Console ka [VIDEO COMMAND ERROR] check karo."
        );
    }
};
