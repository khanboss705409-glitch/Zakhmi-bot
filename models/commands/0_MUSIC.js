const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "song",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "ARIF BABU",
    description: "Download YouTube songs in MP3 format",
    commandCategory: "Music",
    usages: "song <song name or YouTube URL>",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    // ================= API CONFIG =================
    const PRIYANSHU_API_KEY = "apim_8lEUfewp8dXI9KphqYrqhbaJLs6w9tQz_Q6MdYbIC2I";

    const apiUrl =
        "https://priyanshuapi.qzz.io/api/runner/youtube-downloader-v2/download";

    let mp3Path;

    try {
        const musicUrl = args.join(" ").trim();

        if (!musicUrl) {
            return api.sendMessage(
                "🎵 Song ka naam ya YouTube URL do.\n\nExample: song Tum Hi Ho",
                threadID,
                messageID
            );
        }

        // ================= LOADING =================
        api.sendMessage(
            "🎧 Song download ho raha hai...\n⏳ Please wait!",
            threadID,
            messageID
        );

        // ================= SEARCH SONG =================
        let youtubeUrl = musicUrl;

        if (!/^https?:\/\//i.test(musicUrl)) {
            const search = await axios.get(
                "https://www.youtube.com/results",
                {
                    params: { search_query: musicUrl },
                    timeout: 20000,
                    headers: {
                        "User-Agent": "Mozilla/5.0"
                    }
                }
            );

            const match = search.data.match(
                /\/watch\?v=([a-zA-Z0-9_-]{11})/
            );

            if (!match) {
                throw new Error(
                    "YouTube par song nahi mila."
                );
            }

            youtubeUrl =
                "https://www.youtube.com/watch?v=" + match[1];
        }

        // ================= API REQUEST =================
        const response = await axios.post(
            apiUrl,
            {
                url: youtubeUrl,
                format: "mp3",
                quality: "128"
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
                "API se MP3 download link nahi mila."
            );
        }

        // ================= CACHE FOLDER =================
        const cacheDir = path.join(__dirname, "cache");

        await fs.ensureDir(cacheDir);

        mp3Path = path.join(
            cacheDir,
            `song_${Date.now()}.mp3`
        );

        // ================= DOWNLOAD MP3 =================
        const audioResponse = await axios.get(
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
            const writer = fs.createWriteStream(mp3Path);

            audioResponse.data.pipe(writer);

            writer.on("finish", resolve);
            writer.on("error", reject);

            audioResponse.data.on("error", reject);
        });

        // ================= CHECK FILE =================
        const stat = await fs.stat(mp3Path);

        if (!stat.size) {
            throw new Error("Downloaded MP3 file empty hai.");
        }

        // ================= SEND SONG =================
        const title =
            data.title || musicUrl;

        api.sendMessage(
            {
                body:
                    `🎵 𝗦𝗢𝗡𝗚 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗗\n\n` +
                    `🎶 Title: ${title}\n` +
                    `🎧 Quality: 128 kbps\n` +
                    `👑 Requested by: ${event.senderID}`,
                attachment: fs.createReadStream(mp3Path)
            },
            threadID,
            (err) => {
                if (mp3Path) {
                    fs.unlink(mp3Path).catch(() => {});
                }

                if (err) {
                    console.error(
                        "[SONG SEND ERROR]",
                        err
                    );
                }
            },
            messageID
        );

    } catch (error) {
        console.error(
            "[SONG COMMAND ERROR]",
            error.response?.data || error.message || error
        );

        if (mp3Path) {
            await fs.unlink(mp3Path).catch(() => {});
        }

        return api.sendMessage(
            "❌ Song download nahi ho paaya.\n\n" +
            "Possible reasons:\n" +
            "• API key galat hai ya invalid hai.\n" +
            "• API server unavailable hai.\n" +
            "• YouTube song nahi mila.\n\n" +
            "Please dobara try karo.",
            threadID,
            messageID
        );
    }
};
