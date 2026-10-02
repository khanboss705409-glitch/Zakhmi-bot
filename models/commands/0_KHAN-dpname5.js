module.exports.config = {
  name: "dpname5",
  version: "1.0",
  hasPermssion: 0,
  credits: "THAKUR KI HAWELI",
  description: "ANNU style name dp - bina canvas ke",
  commandCategory: "IMAGE",
  usages: "[name]",
  cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {
  const Jimp = require("jimp");
  const fs = require("fs-extra");

  let name = args.join(" ");
  if (!name) return api.sendMessage("⚠️ Naam likho\nExample: #dpname5 THAKUR", event.threadID, event.messageID);
  name = name.toUpperCase();

  try {
    // Aapki ANNU wali template
    let templateUrl = "https://i.imgur.com/8Km9tLL.jpg";

    let bg = await Jimp.read(templateUrl);
    bg.resize(1080, 1350);

    let fontBig = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);

    // Purana naam hide
    let pinkBox = new Jimp(700, 130, '#e87aa8');
    bg.composite(pinkBox, 350, 950);

    // Naya naam
    bg.print(fontBig, 360, 940, {
      text: name,
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    }, 700, 130);

    let path = __dirname + "/cache/dpname5_" + Date.now() + ".jpg";
    await bg.writeAsync(path);

    api.sendMessage({
      body: `✅ Ho gaya Thakur Sahab 👑\nName: ${name}`,
      attachment: fs.createReadStream(path)
    }, event.threadID, () => fs.unlinkSync(path), event.messageID);

  } catch (e) {
    console.log(e);
    return api.sendMessage("❌ Jimp install karo package.json me", event.threadID, event.messageID);
  }
}
