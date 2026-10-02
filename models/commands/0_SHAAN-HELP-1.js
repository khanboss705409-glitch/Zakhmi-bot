const fs = require("fs-extra");
const path = require("path");
const { createCanvas } = require("canvas");

module.exports.config = {
  name: "help",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Large RGB LED DP Style Help Menu",
  commandCategory: "BOT-COMMAND-LIST",
  usages: "help / help <page> / help <command>",
  cooldowns: 1,
  dependencies: {
    "canvas": ""
  }
};

module.exports.languages = {
  en: {
    user: "User",
    adminGroup: "Admin Group",
    adminBot: "Bot Admin"
  }
};

// ======================================================
//                    RGB COLORS
// ======================================================

const RGB_COLORS = [
  "#ff00ff",
  "#00ffff",
  "#ff0080",
  "#ffff00",
  "#00ff66",
  "#0080ff",
  "#a000ff"
];

// ======================================================
//                    NO PREFIX HELP
// ======================================================

module.exports.handleEvent = async function ({
  api,
  event,
  getText
}) {
  try {
    if (!event.body) return;

    const text = event.body.trim();

    if (!text.toLowerCase().startsWith("help")) {
      return;
    }

    const parts = text.split(/\s+/);

    if (parts[0].toLowerCase() !== "help") {
      return;
    }

    // help
    if (parts.length === 1) {
      return module.exports.run({
        api,
        event,
        args: ["1"],
        getText
      });
    }

    const input = parts.slice(1).join(" ").trim();

    if (!input) {
      return module.exports.run({
        api,
        event,
        args: ["1"],
        getText
      });
    }

    return module.exports.run({
      api,
      event,
      args: [input],
      getText
    });

  } catch (error) {
    console.error("HELP EVENT ERROR:", error);
  }
};

// ======================================================
//                    MAIN HELP SYSTEM
// ======================================================

module.exports.run = async function ({
  api,
  event,
  args,
  getText
}) {
  try {
    const { commands } = global.client;

    const threadID = event.threadID;
    const messageID = event.messageID;

    const prefix =
      global.data.threadData.get(parseInt(threadID))?.PREFIX ||
      global.config.PREFIX;

    // ==================================================
    // ARGUMENT
    // ==================================================

    let input = "";

    if (args && args.length > 0) {
      input = args.join(" ").trim().toLowerCase();
    }

    if (!input) {
      input = "1";
    }

    // ==================================================
    // FIND COMMAND INCLUDING ALIASES
    // ==================================================

    const commandInfo = findCommand(commands, input);

    if (commandInfo) {
      return sendCommandInfo(
        api,
        event,
        commandInfo,
        prefix
      );
    }

    // ==================================================
    // PAGE MODE
    // ==================================================

    const page = parseInt(input) || 1;

    const perPage = 15;

    const arr = [...commands.keys()]
      .filter(Boolean)
      .sort((a, b) =>
        String(a).localeCompare(String(b))
      );

    const maxPage = Math.max(
      1,
      Math.ceil(arr.length / perPage)
    );

    if (page < 1 || page > maxPage) {
      return api.sendMessage(
        `❌ Invalid page!\n\nAvailable pages: 1 - ${maxPage}`,
        threadID,
        messageID
      );
    }

    const start = (page - 1) * perPage;

    const slice = arr.slice(
      start,
      start + perPage
    );

    return sendHelpImage(
      api,
      event,
      slice,
      page,
      maxPage,
      arr.length,
      prefix
    );

  } catch (error) {
    console.error("HELP RUN ERROR:", error);

    return api.sendMessage(
      "❌ Help menu mein unexpected error aa gaya.",
      event.threadID,
      event.messageID
    );
  }
};

// ======================================================
//                  FIND COMMAND
// ======================================================

function findCommand(commands, input) {
  if (!input) return null;

  // Direct command
  if (commands.has(input)) {
    return commands.get(input);
  }

  // Alias search
  for (const [, command] of commands) {
    const config = command?.config || {};

    const aliases = config.aliases;

    if (Array.isArray(aliases)) {
      if (
        aliases
          .map(x => String(x).toLowerCase())
          .includes(input)
      ) {
        return command;
      }
    }

    if (typeof aliases === "string") {
      if (
        aliases
          .split(",")
          .map(x => x.trim().toLowerCase())
          .includes(input)
      ) {
        return command;
      }
    }
  }

  return null;
}

// ======================================================
//                 COMMAND INFO IMAGE
// ======================================================

async function sendCommandInfo(
  api,
  event,
  info,
  prefix
) {
  const config = info.config || {};

  const name =
    config.name || "Unknown";

  const description =
    config.description ||
    "No description";

  const usage =
    config.usages ||
    name;

  const category =
    config.commandCategory ||
    "Unknown";

  const cooldown =
    config.cooldowns ?? 0;

  const credits =
    config.credits ||
    "Unknown";

  let permission = "User";

  if (config.hasPermssion == 1) {
    permission = "Admin Group";
  } else if (config.hasPermssion >= 2) {
    permission = "Bot Admin";
  }

  let aliases = "None";

  if (Array.isArray(config.aliases)) {
    aliases =
      config.aliases.join(", ") ||
      "None";
  } else if (
    typeof config.aliases === "string"
  ) {
    aliases =
      config.aliases ||
      "None";
  }

  const cacheDir =
    path.join(__dirname, "cache");

  await fs.ensureDir(cacheDir);

  const filePath = path.join(
    cacheDir,
    `help_info_${event.threadID}_${Date.now()}.png`
  );

  // ==================================================
  // CANVAS
  // ==================================================

  const WIDTH = 1200;
  const HEIGHT = 1200;

  const canvas =
    createCanvas(WIDTH, HEIGHT);

  const ctx =
    canvas.getContext("2d");

  drawBackground(
    ctx,
    WIDTH,
    HEIGHT
  );

  // ==================================================
  // TOP BRAND
  // ==================================================

  drawCrown(
    ctx,
    WIDTH / 2,
    80
  );

  drawNeonTitle(
    ctx,
    "COMMAND INFO",
    WIDTH / 2,
    175,
    58
  );

  drawSmallText(
    ctx,
    "COMMAND DETAILS • 𝗧𝗛𝗔𝗞𝗨𝗥 𝗦𝗔𝗛𝗔𝗕 𝗔𝗜",
    WIDTH / 2,
    220,
    22
  );

  drawRGBLine(
    ctx,
    100,
    250,
    1100,
    250
  );

  // ==================================================
  // COMMAND NAME
  // ==================================================

  ctx.textAlign = "center";

  ctx.font =
    "bold 48px Arial";

  const commandGradient =
    createRGBGradient(
      ctx,
      300,
      0,
      900,
      0
    );

  ctx.fillStyle =
    commandGradient;

  ctx.shadowBlur = 25;
  ctx.shadowColor = "#00ffff";

  ctx.fillText(
    `${prefix}${name}`,
    WIDTH / 2,
    320
  );

  ctx.shadowBlur = 0;

  // ==================================================
  // INFO PANEL
  // ==================================================

  const panelX = 80;
  const panelY = 360;
  const panelW = 1040;
  const panelH = 570;

  drawNeonPanel(
    ctx,
    panelX,
    panelY,
    panelW,
    panelH,
    35
  );

  // ==================================================
  // INFO ROWS
  // ==================================================

  const rows = [
    [
      "DESCRIPTION",
      description,
      "#00ffff"
    ],
    [
      "USAGE",
      `${prefix}${name} ${usage}`,
      "#ff00ff"
    ],
    [
      "COOLDOWN",
      `${cooldown} sec`,
      "#ffff00"
    ],
    [
      "PREFIX",
      config.usePrefix === false
        ? "No"
        : "Yes",
      "#00ff66"
    ],
    [
      "ALIASES",
      aliases,
      "#ff0080"
    ],
    [
      "PERMISSION",
      permission,
      "#00ffff"
    ],
    [
      "CATEGORY",
      category,
      "#a000ff"
    ],
    [
      "DEVELOPER",
      credits,
      "#ffff00"
    ]
  ];

  let y = 425;

  for (const [
    label,
    value,
    color
  ] of rows) {

    drawInfoBox(
      ctx,
      label,
      value,
      y,
      color
    );

    y += 62;
  }

  // ==================================================
  // BOTTOM
  // ==================================================

  drawRGBLine(
    ctx,
    180,
    1000,
    1020,
    1000
  );

  drawSmallText(
    ctx,
    "USE COMMAND",
    WIDTH / 2,
    1045,
    24
  );

  ctx.textAlign = "center";
  ctx.font =
    "bold 25px Arial";

  ctx.fillStyle =
    "#ffffff";

  ctx.shadowBlur = 12;
  ctx.shadowColor =
    "#00ffff";

  ctx.fillText(
    `${prefix}help ${name}`,
    WIDTH / 2,
    1090
  );

  ctx.shadowBlur = 0;

  drawFooter(
    ctx,
    WIDTH,
    1150
  );

  await saveAndSend(
    canvas,
    filePath,
    api,
    event
  );
}

// ======================================================
//                    HELP PAGE
// ======================================================

async function sendHelpImage(
  api,
  event,
  commands,
  page,
  maxPage,
  totalCommands,
  prefix
) {
  const cacheDir =
    path.join(__dirname, "cache");

  await fs.ensureDir(cacheDir);

  const filePath = path.join(
    cacheDir,
    `help_${event.threadID}_${Date.now()}.png`
  );

  // ==================================================
  // LARGE DP CANVAS
  // ==================================================

  const WIDTH = 1200;
  const HEIGHT = 1200;

  const canvas =
    createCanvas(WIDTH, HEIGHT);

  const ctx =
    canvas.getContext("2d");

  drawBackground(
    ctx,
    WIDTH,
    HEIGHT
  );

  // ==================================================
  // CROWN
  // ==================================================

  drawCrown(
    ctx,
    WIDTH / 2,
    82
  );

  // ==================================================
  // HELP MENU TITLE
  // ==================================================

  drawNeonTitle(
    ctx,
    "HELP MENU",
    WIDTH / 2,
    205,
    78
  );

  // ==================================================
  // SUBTITLE
  // ==================================================

  ctx.textAlign =
    "center";

  ctx.font =
    "bold 25px Arial";

  ctx.fillStyle =
    "#ffffff";

  ctx.shadowBlur = 12;
  ctx.shadowColor =
    "#00ffff";

  ctx.fillText(
    "ALL COMMANDS LIST",
    WIDTH / 2,
    255
  );

  ctx.shadowBlur = 0;

  // ==================================================
  // PAGE / TOTAL
  // ==================================================

  const pageGradient =
    createRGBGradient(
      ctx,
      320,
      0,
      880,
      0
    );

  ctx.font =
    "bold 25px Arial";

  ctx.fillStyle =
    pageGradient;

  ctx.fillText(
    `PAGE ${page} / ${maxPage}   •   TOTAL COMMANDS: ${totalCommands}`,
    WIDTH / 2,
    300
  );

  drawRGBLine(
    ctx,
    110,
    330,
    1090,
    330
  );

  // ==================================================
  // COMMAND AREA
  // ==================================================

  const panelX = 55;
  const panelY = 360;
  const panelW = 1090;
  const panelH = 510;

  drawNeonPanel(
    ctx,
    panelX,
    panelY,
    panelW,
    panelH,
    32
  );

  // ==================================================
  // 3 COLUMNS × 5 ROWS
  // ==================================================

  const columns = 3;
  const rows = 5;

  const gapX = 22;
  const gapY = 18;

  const cardW = 330;
  const cardH = 78;

  const startX = 80;
  const startY = 390;

  for (
    let i = 0;
    i < commands.length;
    i++
  ) {

    // Column-major layout
    // 01 06 11
    // 02 07 12
    // 03 08 13
    // 04 09 14
    // 05 10 15

    const column =
      Math.floor(i / rows);

    const row =
      i % rows;

    const x =
      startX +
      column *
        (cardW + gapX);

    const y =
      startY +
      row *
        (cardH + gapY);

    const color =
      RGB_COLORS[
        i % RGB_COLORS.length
      ];

    drawCommandCard(
      ctx,
      x,
      y,
      cardW,
      cardH,
      i + 1,
      commands[i],
      prefix,
      color
    );
  }

  // ==================================================
  // COMMAND HELP AREA
  // ==================================================

  drawRGBLine(
    ctx,
    120,
    905,
    1080,
    905
  );

  // ==================================================
  // USE COMMAND TITLE
  // ==================================================

  ctx.textAlign =
    "center";

  ctx.font =
    "bold 28px Arial";

  ctx.fillStyle =
    "#00ffff";

  ctx.shadowBlur = 15;
  ctx.shadowColor =
    "#00ffff";

  ctx.fillText(
    "💬  USE COMMAND",
    WIDTH / 2,
    950
  );

  ctx.shadowBlur = 0;

  // ==================================================
  // COMMAND EXAMPLES
  // ==================================================

  drawExample(
    ctx,
    `${prefix}help 1`,
    "First Page",
    990,
    "#ff00ff"
  );

  drawExample(
    ctx,
    `${prefix}help 2`,
    "Second Page",
    1030,
    "#00ffff"
  );

  drawExample(
    ctx,
    `${prefix}help uptime`,
    "Command Info",
    1070,
    "#00ff66"
  );

  // ==================================================
  // FOOTER
  // ==================================================

  drawFooter(
    ctx,
    WIDTH,
    1150
  );

  // ==================================================
  // SAVE + SEND
  // ==================================================

  await saveAndSend(
    canvas,
    filePath,
    api,
    event
  );
}

// ======================================================
//                 COMMAND CARD
// ======================================================

function drawCommandCard(
  ctx,
  x,
  y,
  width,
  height,
  number,
  command,
  prefix,
  color
) {
  // Background
  ctx.fillStyle =
    "rgba(0, 5, 20, 0.92)";

  roundRect(
    ctx,
    x,
    y,
    width,
    height,
    22
  );

  ctx.fill();

  // Neon border
  ctx.lineWidth = 3;

  ctx.strokeStyle =
    color;

  ctx.shadowBlur = 18;
  ctx.shadowColor =
    color;

  roundRect(
    ctx,
    x,
    y,
    width,
    height,
    22
  );

  ctx.stroke();

  ctx.shadowBlur = 0;

  // Number
  ctx.textAlign =
    "left";

  ctx.font =
    "bold 22px Arial";

  ctx.fillStyle =
    color;

  ctx.shadowBlur = 12;
  ctx.shadowColor =
    color;

  ctx.fillText(
    String(number).padStart(2, "0"),
    x + 18,
    y + 48
  );

  ctx.shadowBlur = 0;

  // Icon box
  ctx.lineWidth = 2;

  ctx.strokeStyle =
    color;

  roundRect(
    ctx,
    x + 62,
    y + 16,
    48,
    46,
    12
  );

  ctx.stroke();

  // Simple command icon
  ctx.textAlign =
    "center";

  ctx.font =
    "bold 24px Arial";

  ctx.fillStyle =
    color;

  ctx.fillText(
    getCommandIcon(command),
    x + 86,
    y + 47
  );

  // Command name
  ctx.textAlign =
    "left";

  ctx.font =
    "bold 24px Arial";

  ctx.fillStyle =
    "#ffffff";

  ctx.shadowBlur = 10;
  ctx.shadowColor =
    color;

  let name =
    String(command);

  if (name.length > 15) {
    name =
      name.substring(0, 14) +
      "...";
  }

  ctx.fillText(
    name,
    x + 125,
    y + 48
  );

  ctx.shadowBlur = 0;
}

// ======================================================
//                 COMMAND ICON
// ======================================================

function getCommandIcon(command) {
  const name =
    String(command)
      .toLowerCase();

  if (
    name.includes("help")
  ) return "?";

  if (
    name.includes("uptime") ||
    name === "upt"
  ) return "◷";

  if (
    name.includes("music") ||
    name.includes("song") ||
    name.includes("sing")
  ) return "♪";

  if (
    name.includes("ai") ||
    name.includes("gen")
  ) return "✦";

  if (
    name.includes("image") ||
    name.includes("img") ||
    name.includes("photo")
  ) return "▣";

  if (
    name.includes("video")
  ) return "▶";

  if (
    name.includes("download") ||
    name.includes("dl")
  ) return "↓";

  if (
    name.includes("ping")
  ) return "⌁";

  if (
    name.includes("owner")
  ) return "♛";

  if (
    name.includes("pair") ||
    name.includes("love") ||
    name.includes("gf") ||
    name.includes("bf")
  ) return "♡";

  if (
    name.includes("mail")
  ) return "✉";

  return "◆";
}

// ======================================================
//                    EXAMPLE ROW
// ======================================================

function drawExample(
  ctx,
  command,
  description,
  y,
  color
) {
  const centerX = 600;

  ctx.textAlign =
    "center";

  ctx.font =
    "bold 21px Arial";

  ctx.fillStyle =
    color;

  ctx.shadowBlur = 10;
  ctx.shadowColor =
    color;

  ctx.fillText(
    command,
    centerX - 120,
    y
  );

  ctx.shadowBlur = 0;

  ctx.fillStyle =
    "#ffffff";

  ctx.font =
    "bold 20px Arial";

  ctx.fillText(
    "→",
    centerX,
    y
  );

  ctx.fillStyle =
    "#00ffff";

  ctx.fillText(
    description,
    centerX + 150,
    y
  );
}

// ======================================================
//                  BACKGROUND
// ======================================================

function drawBackground(
  ctx,
  WIDTH,
  HEIGHT
) {
  const bg =
    ctx.createLinearGradient(
      0,
      0,
      WIDTH,
      HEIGHT
    );

  bg.addColorStop(
    0,
    "#020008"
  );

  bg.addColorStop(
    0.25,
    "#10001c"
  );

  bg.addColorStop(
    0.5,
    "#00151f"
  );

  bg.addColorStop(
    0.75,
    "#18001c"
  );

  bg.addColorStop(
    1,
    "#01050d"
  );

  ctx.fillStyle =
    bg;

  ctx.fillRect(
    0,
    0,
    WIDTH,
    HEIGHT
  );

  // RGB glow
  glow(
    ctx,
    100,
    100,
    350,
    "rgba(255,0,255,0.20)"
  );

  glow(
    ctx,
    WIDTH - 100,
    100,
    350,
    "rgba(0,255,255,0.20)"
  );

  glow(
    ctx,
    100,
    HEIGHT - 100,
    350,
    "rgba(255,255,0,0.15)"
  );

  glow(
    ctx,
    WIDTH - 100,
    HEIGHT - 100,
    350,
    "rgba(0,255,100,0.15)"
  );

  // ==================================================
  // LED DOTS
  // ==================================================

  for (
    let y = 20;
    y < HEIGHT;
    y += 30
  ) {
    for (
      let x = 20;
      x < WIDTH;
      x += 30
    ) {
      const color =
        RGB_COLORS[
          Math.floor(
            (x + y) / 30
          ) %
          RGB_COLORS.length
        ];

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        1.4,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        color;

      ctx.shadowBlur = 7;
      ctx.shadowColor =
        color;

      ctx.fill();

      ctx.shadowBlur = 0;
    }
  }

  // ==================================================
  // OUTER FRAME
  // ==================================================

  ctx.lineWidth = 5;

  const frame =
    createRGBGradient(
      ctx,
      20,
      0,
      WIDTH - 20,
      0
    );

  ctx.strokeStyle =
    frame;

  ctx.shadowBlur = 28;
  ctx.shadowColor =
    "#ff00ff";

  roundRect(
    ctx,
    25,
    25,
    WIDTH - 50,
    HEIGHT - 50,
    40
  );

  ctx.stroke();

  ctx.shadowBlur = 0;

  // Inner frame
  ctx.lineWidth = 2;

  ctx.strokeStyle =
    "rgba(0,255,255,0.7)";

  roundRect(
    ctx,
    42,
    42,
    WIDTH - 84,
    HEIGHT - 84,
    32
  );

  ctx.stroke();
}

// ======================================================
//                    NEON PANEL
// ======================================================

function drawNeonPanel(
  ctx,
  x,
  y,
  width,
  height,
  radius
) {
  ctx.fillStyle =
    "rgba(0, 0, 15, 0.72)";

  roundRect(
    ctx,
    x,
    y,
    width,
    height,
    radius
  );

  ctx.fill();

  const gradient =
    createRGBGradient(
      ctx,
      x,
      0,
      x + width,
      0
    );

  ctx.strokeStyle =
    gradient;

  ctx.lineWidth = 4;

  ctx.shadowBlur = 22;
  ctx.shadowColor =
    "#00ffff";

  roundRect(
    ctx,
    x,
    y,
    width,
    height,
    radius
  );

  ctx.stroke();

  ctx.shadowBlur = 0;
}

// ======================================================
//                  INFO BOX
// ======================================================

function drawInfoBox(
  ctx,
  label,
  value,
  y,
  color
) {
  const x = 115;
  const width = 970;
  const height = 48;

  ctx.fillStyle =
    "rgba(0,0,20,0.65)";

  roundRect(
    ctx,
    x,
    y - 35,
    width,
    height,
    15
  );

  ctx.fill();

  ctx.strokeStyle =
    color;

  ctx.lineWidth = 2;

  ctx.shadowBlur = 10;
  ctx.shadowColor =
    color;

  roundRect(
    ctx,
    x,
    y - 35,
    width,
    height,
    15
  );

  ctx.stroke();

  ctx.shadowBlur = 0;

  ctx.textAlign =
    "left";

  ctx.font =
    "bold 19px Arial";

  ctx.fillStyle =
    color;

  ctx.fillText(
    label,
    x + 22,
    y - 5
  );

  ctx.textAlign =
    "right";

  ctx.font =
    "bold 19px Arial";

  ctx.fillStyle =
    "#ffffff";

  let display =
    String(value);

  if (display.length > 60) {
    display =
      display.substring(0, 57) +
      "...";
  }

  ctx.fillText(
    display,
    x + width - 22,
    y - 5
  );
}

// ======================================================
//                    CROWN
// ======================================================

function drawCrown(
  ctx,
  x,
  y
) {
  ctx.save();

  ctx.textAlign =
    "center";

  ctx.font =
    "bold 72px Arial";

  const gradient =
    createRGBGradient(
      ctx,
      x - 100,
      0,
      x + 100,
      0
    );

  ctx.fillStyle =
    gradient;

  ctx.shadowBlur = 30;
  ctx.shadowColor =
    "#ff00ff";

  ctx.fillText(
    "♛",
    x,
    y
  );

  ctx.restore();
}

// ======================================================
//                  NEON TITLE
// ======================================================

function drawNeonTitle(
  ctx,
  text,
  x,
  y,
  size
) {
  ctx.textAlign =
    "center";

  ctx.font =
    `bold ${size}px Arial`;

  const gradient =
    createRGBGradient(
      ctx,
      x - 400,
      0,
      x + 400,
      0
    );

  ctx.fillStyle =
    gradient;

  ctx.shadowBlur = 30;
  ctx.shadowColor =
    "#00ffff";

  ctx.fillText(
    text,
    x,
    y
  );

  ctx.shadowBlur = 0;
}

// ======================================================
//                  SMALL TEXT
// ======================================================

function drawSmallText(
  ctx,
  text,
  x,
  y,
  size
) {
  ctx.textAlign =
    "center";

  ctx.font =
    `bold ${size}px Arial`;

  ctx.fillStyle =
    "#ffffff";

  ctx.shadowBlur = 10;
  ctx.shadowColor =
    "#00ffff";

  ctx.fillText(
    text,
    x,
    y
  );

  ctx.shadowBlur = 0;
}

// ======================================================
//                    RGB LINE
// ======================================================

function drawRGBLine(
  ctx,
  x1,
  y1,
  x2,
  y2
) {
  const gradient =
    createRGBGradient(
      ctx,
      x1,
      0,
      x2,
      0
    );

  ctx.strokeStyle =
    gradient;

  ctx.lineWidth = 4;

  ctx.shadowBlur = 15;
  ctx.shadowColor =
    "#ff00ff";

  ctx.beginPath();

  ctx.moveTo(
    x1,
    y1
  );

  ctx.lineTo(
    x2,
    y2
  );

  ctx.stroke();

  ctx.shadowBlur = 0;
}

// ======================================================
//                  RGB GRADIENT
// ======================================================

function createRGBGradient(
  ctx,
  x1,
  y1,
  x2,
  y2
) {
  const gradient =
    ctx.createLinearGradient(
      x1,
      y1,
      x2,
      y2
    );

  gradient.addColorStop(
    0,
    "#ff00ff"
  );

  gradient.addColorStop(
    0.15,
    "#ff0080"
  );

  gradient.addColorStop(
    0.30,
    "#ff0000"
  );

  gradient.addColorStop(
    0.45,
    "#ffff00"
  );

  gradient.addColorStop(
    0.60,
    "#00ff66"
  );

  gradient.addColorStop(
    0.75,
    "#00ffff"
  );

  gradient.addColorStop(
    0.90,
    "#0080ff"
  );

  gradient.addColorStop(
    1,
    "#a000ff"
  );

  return gradient;
}

// ======================================================
//                      GLOW
// ======================================================

function glow(
  ctx,
  x,
  y,
  radius,
  color
) {
  const gradient =
    ctx.createRadialGradient(
      x,
      y,
      0,
      x,
      y,
      radius
    );

  gradient.addColorStop(
    0,
    color
  );

  gradient.addColorStop(
    1,
    "rgba(0,0,0,0)"
  );

  ctx.fillStyle =
    gradient;

  ctx.fillRect(
    x - radius,
    y - radius,
    radius * 2,
    radius * 2
  );
}

// ======================================================
//                 FOOTER BRANDING
// ======================================================

function drawFooter(
  ctx,
  WIDTH,
  y
) {
  const gradient =
    createRGBGradient(
      ctx,
      300,
      0,
      900,
      0
    );

  ctx.textAlign =
    "center";

  ctx.font =
    "bold 26px Arial";

  ctx.fillStyle =
    gradient;

  ctx.shadowBlur = 18;
  ctx.shadowColor =
    "#ff00ff";

  ctx.fillText(
    "♥  MADE WITH LOVE BY 𝗧𝗛𝗔𝗞𝗨𝗥 𝗦𝗔𝗛𝗔𝗕  ♥",
    WIDTH / 2,
    y
  );

  ctx.shadowBlur = 0;

  // Bottom line
  drawRGBLine(
    ctx,
    170,
    y + 25,
    1030,
    y + 25
  );
}

// ======================================================
//                ROUND RECTANGLE
// ======================================================

function roundRect(
  ctx,
  x,
  y,
  width,
  height,
  radius
) {
  ctx.beginPath();

  ctx.moveTo(
    x + radius,
    y
  );

  ctx.lineTo(
    x + width - radius,
    y
  );

  ctx.quadraticCurveTo(
    x + width,
    y,
    x + width,
    y + radius
  );

  ctx.lineTo(
    x + width,
    y + height - radius
  );

  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height
  );

  ctx.lineTo(
    x + radius,
    y + height
  );

  ctx.quadraticCurveTo(
    x,
    y + height,
    x,
    y + height - radius
  );

  ctx.lineTo(
    x,
    y + radius
  );

  ctx.quadraticCurveTo(
    x,
    y,
    x + radius,
    y
  );

  ctx.closePath();
}

// ======================================================
//                  SAVE + SEND
// ======================================================

async function saveAndSend(
  canvas,
  filePath,
  api,
  event
) {
  await new Promise(
    (resolve, reject) => {
      const stream =
        canvas.createPNGStream();

      const output =
        fs.createWriteStream(
          filePath
        );

      stream.pipe(output);

      output.on(
        "finish",
        resolve
      );

      output.on(
        "error",
        reject
      );
    }
  );

  return new Promise(
    (resolve) => {
      api.sendMessage(
        {
          body: "",
          attachment:
            fs.createReadStream(
              filePath
            )
        },
        event.threadID,
        () => {
          try {
            if (
              fs.existsSync(
                filePath
              )
            ) {
              fs.unlinkSync(
                filePath
              );
            }
          } catch (error) {
            console.error(
              "HELP CACHE DELETE ERROR:",
              error
            );
          }

          resolve();
        },
        event.messageID
      );
    }
  );
}
