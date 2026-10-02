const fs = require("fs-extra");
const path = require("path");
const { createCanvas } = require("canvas");

global.client = global.client || {};
global.client.timeStart = Date.now();

module.exports.config = {
  name: "upt",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "RGB LED DP Style Uptime",
  commandCategory: "system",
  usages: "upt / .upt / !upt",
  cooldowns: 5,
  dependencies: {
    canvas: ""
  }
};

// ======================================================
// NON PREFIX
// ======================================================

module.exports.handleEvent = async ({ api, event }) => {
  try {
    if (!event.body) return;

    if (event.body.trim().toLowerCase() !== "upt") {
      return;
    }

    await sendUptime(api, event);

  } catch (error) {
    console.error("UPT EVENT ERROR:", error);
  }
};

// ======================================================
// PREFIX
// ======================================================

module.exports.run = async ({ api, event }) => {
  try {
    await sendUptime(api, event);
  } catch (error) {
    console.error("UPT RUN ERROR:", error);
  }
};

// ======================================================
// MAIN UPTIME
// ======================================================

async function sendUptime(api, event) {

  const uptime = process.uptime();

  const hours = Math.floor(uptime / 3600);

  const minutes = Math.floor(
    (uptime % 3600) / 60
  );

  const seconds = Math.floor(
    uptime % 60
  );

  const now = new Date();

  const time = now.toLocaleTimeString(
    "en-IN",
    {
      hour12: true,
      timeZone: "Asia/Kolkata"
    }
  );

  const date = now.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata"
    }
  );

  const day = now.toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      timeZone: "Asia/Kolkata"
    }
  );

  const commandsCount =
    global.client &&
    global.client.commands &&
    typeof global.client.commands.size !== "undefined"
      ? global.client.commands.size
      : "N/A";

  const owner = "𝗧𝗛𝗔𝗞𝗨𝗥 𝗦𝗔𝗛𝗔𝗕";

  // ====================================================
  // CANVAS SIZE — SAME SQUARE DP STYLE
  // ====================================================

  const WIDTH = 1536;
  const HEIGHT = 1536;

  const canvas = createCanvas(
    WIDTH,
    HEIGHT
  );

  const ctx = canvas.getContext("2d");

  // ====================================================
  // COLORS
  // ====================================================

  const RGB = [
    "#ff00ff",
    "#00ffff",
    "#0080ff",
    "#00ff66",
    "#ffff00",
    "#ff8000",
    "#ff0080",
    "#9d00ff"
  ];

  // ====================================================
  // BACKGROUND
  // ====================================================

  drawBackground(
    ctx,
    WIDTH,
    HEIGHT,
    RGB
  );

  // ====================================================
  // OUTER FRAME
  // ====================================================

  drawOuterFrame(
    ctx,
    WIDTH,
    HEIGHT
  );

  // ====================================================
  // TOP DECORATION
  // ====================================================

  drawTopDecoration(
    ctx,
    WIDTH
  );

  // ====================================================
  // SIDE TEXT
  // ====================================================

  drawSideText(
    ctx,
    WIDTH,
    HEIGHT
  );

  // ====================================================
  // CROWN
  // ====================================================

  drawCrown(
    ctx,
    WIDTH / 2,
    95
  );

  // ====================================================
  // MAIN TITLE
  // ====================================================

  drawTitle(
    ctx,
    WIDTH / 2,
    285
  );

  // ====================================================
  // SUB TITLE
  // ====================================================

  drawSubtitle(
    ctx,
    WIDTH / 2,
    365
  );

  // ====================================================
  // RGB DIVIDER
  // ====================================================

  drawRGBLine(
    ctx,
    245,
    410,
    1290,
    410
  );

  // ====================================================
  // MAIN INFORMATION PANEL
  // ====================================================

  const panelX = 110;
  const panelY = 435;
  const panelW = 1316;
  const panelH = 635;

  drawMainPanel(
    ctx,
    panelX,
    panelY,
    panelW,
    panelH
  );

  // ====================================================
  // INFORMATION ROWS
  // ====================================================

  const rows = [
    {
      label: "RUN",
      value: `${hours}h ${minutes}m ${seconds}s`,
      icon: "◷",
      color: "#00ffff"
    },
    {
      label: "TIME",
      value: time,
      icon: "◷",
      color: "#ff00ff"
    },
    {
      label: "DATE",
      value: date,
      icon: "▣",
      color: "#ffff00"
    },
    {
      label: "DAY",
      value: day,
      icon: "▣",
      color: "#00ff66"
    },
    {
      label: "COMMANDS",
      value: String(commandsCount),
      icon: ">_",
      color: "#ff00aa"
    },
    {
      label: "OWNER",
      value: owner,
      icon: "♛",
      color: "#00cfff"
    }
  ];

  let rowY = 475;

  for (const row of rows) {

    drawInfoRow(
      ctx,
      165,
      rowY,
      1205,
      78,
      row.label,
      row.value,
      row.icon,
      row.color
    );

    rowY += 92;
  }

  // ====================================================
  // USE COMMANDS
  // ====================================================

  drawUseCommands(
    ctx,
    WIDTH,
    1135
  );

  // ====================================================
  // FOOTER
  // ====================================================

  drawFooter(
    ctx,
    WIDTH,
    HEIGHT
  );

  // ====================================================
  // CACHE
  // ====================================================

  const cacheDir =
    path.join(
      __dirname,
      "cache"
    );

  await fs.ensureDir(cacheDir);

  const filePath =
    path.join(
      cacheDir,
      `upt_${event.threadID}_${Date.now()}.png`
    );

  // ====================================================
  // SAVE
  // ====================================================

  await saveCanvas(
    canvas,
    filePath
  );

  // ====================================================
  // SEND
  // ====================================================

  return new Promise(resolve => {

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
            fs.existsSync(filePath)
          ) {
            fs.unlinkSync(
              filePath
            );
          }

        } catch (error) {
          console.error(
            "UPT CACHE DELETE ERROR:",
            error
          );
        }

        resolve();

      },

      event.messageID
    );

  });
}

// ======================================================
// BACKGROUND
// ======================================================

function drawBackground(
  ctx,
  WIDTH,
  HEIGHT,
  RGB
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
    "#020005"
  );

  bg.addColorStop(
    0.25,
    "#09001a"
  );

  bg.addColorStop(
    0.50,
    "#00131e"
  );

  bg.addColorStop(
    0.75,
    "#13001c"
  );

  bg.addColorStop(
    1,
    "#020007"
  );

  ctx.fillStyle = bg;

  ctx.fillRect(
    0,
    0,
    WIDTH,
    HEIGHT
  );

  // -----------------------------------------------
  // GLOWS
  // -----------------------------------------------

  glow(
    ctx,
    100,
    150,
    400,
    "rgba(255,0,255,0.20)"
  );

  glow(
    ctx,
    WIDTH - 100,
    150,
    400,
    "rgba(0,255,255,0.18)"
  );

  glow(
    ctx,
    100,
    HEIGHT - 100,
    400,
    "rgba(0,255,80,0.15)"
  );

  glow(
    ctx,
    WIDTH - 100,
    HEIGHT - 100,
    400,
    "rgba(255,0,100,0.18)"
  );

  // -----------------------------------------------
  // LED DOTS
  // -----------------------------------------------

  for (
    let y = 22;
    y < HEIGHT;
    y += 42
  ) {

    for (
      let x = 22;
      x < WIDTH;
      x += 42
    ) {

      const color =
        RGB[
          Math.floor(
            (x + y) / 42
          ) % RGB.length
        ];

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        2.5,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        color;

      ctx.shadowBlur = 12;
      ctx.shadowColor =
        color;

      ctx.fill();

      ctx.shadowBlur = 0;
    }
  }
}

// ======================================================
// OUTER FRAME
// ======================================================

function drawOuterFrame(
  ctx,
  WIDTH,
  HEIGHT
) {

  const gradient =
    createRGBGradient(
      ctx,
      0,
      0,
      WIDTH,
      0
    );

  ctx.strokeStyle =
    gradient;

  ctx.lineWidth = 8;

  ctx.shadowBlur = 35;
  ctx.shadowColor =
    "#ff00ff";

  roundRect(
    ctx,
    27,
    27,
    WIDTH - 54,
    HEIGHT - 54,
    42
  );

  ctx.stroke();

  ctx.shadowBlur = 0;

  // Inner frame

  ctx.strokeStyle =
    "rgba(0,255,255,0.75)";

  ctx.lineWidth = 3;

  roundRect(
    ctx,
    48,
    48,
    WIDTH - 96,
    HEIGHT - 96,
    32
  );

  ctx.stroke();

  // Corner lights

  const corners = [
    [65, 65, "#ff00ff"],
    [WIDTH - 65, 65, "#00ffff"],
    [65, HEIGHT - 65, "#ffff00"],
    [WIDTH - 65, HEIGHT - 65, "#ff0080"]
  ];

  corners.forEach(
    ([x, y, color]) => {

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        11,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        color;

      ctx.shadowBlur = 30;
      ctx.shadowColor =
        color;

      ctx.fill();

      ctx.shadowBlur = 0;
    }
  );
}

// ======================================================
// TOP DECORATION
// ======================================================

function drawTopDecoration(
  ctx,
  WIDTH
) {

  ctx.lineWidth = 7;

  // Left
  const left =
    createRGBGradient(
      ctx,
      45,
      0,
      500,
      0
    );

  ctx.strokeStyle =
    left;

  ctx.shadowBlur = 20;
  ctx.shadowColor =
    "#ff00ff";

  ctx.beginPath();

  ctx.moveTo(55, 80);
  ctx.lineTo(470, 80);

  ctx.stroke();

  // Right
  const right =
    createRGBGradient(
      ctx,
      1030,
      0,
      1490,
      0
    );

  ctx.strokeStyle =
    right;

  ctx.beginPath();

  ctx.moveTo(
    WIDTH - 470,
    80
  );

  ctx.lineTo(
    WIDTH - 55,
    80
  );

  ctx.stroke();

  ctx.shadowBlur = 0;
}

// ======================================================
// SIDE TEXT
// ======================================================

function drawSideText(
  ctx,
  WIDTH
) {

  ctx.textAlign = "center";

  ctx.font =
    "bold italic 38px Arial";

  ctx.fillStyle =
    "#ff69e8";

  ctx.shadowBlur = 20;
  ctx.shadowColor =
    "#ff00ff";

  ctx.fillText(
    "Always",
    165,
    145
  );

  ctx.fillText(
    "Online ♥",
    165,
    195
  );

  ctx.fillStyle =
    "#00ffff";

  ctx.shadowColor =
    "#00ffff";

  ctx.fillText(
    "𝗧𝗛𝗔𝗞𝗨𝗥",
    WIDTH - 165,
    145
  );

  ctx.fillText(
    "𝗦𝗔𝗛𝗔𝗕 ♥",
    WIDTH - 165,
    195
  );

  ctx.shadowBlur = 0;
}

// ======================================================
// CROWN
// ======================================================

function drawCrown(
  ctx,
  x,
  y
) {

  ctx.save();

  ctx.translate(
    x,
    y
  );

  ctx.strokeStyle =
    createRGBGradient(
      ctx,
      -100,
      0,
      100,
      0
    );

  ctx.lineWidth = 8;

  ctx.shadowBlur = 25;
  ctx.shadowColor =
    "#ffff00";

  ctx.beginPath();

  ctx.moveTo(
    -80,
    35
  );

  ctx.lineTo(
    -55,
    -30
  );

  ctx.lineTo(
    -15,
    5
  );

  ctx.lineTo(
    0,
    -60
  );

  ctx.lineTo(
    20,
    5
  );

  ctx.lineTo(
    65,
    -30
  );

  ctx.lineTo(
    82,
    35
  );

  ctx.closePath();

  ctx.stroke();

  ctx.shadowBlur = 0;

  ctx.restore();
}

// ======================================================
// TITLE
// ======================================================

function drawTitle(
  ctx,
  x,
  y
) {

  ctx.textAlign =
    "center";

  ctx.font =
    "bold italic 100px Arial";

  const gradient =
    createRGBGradient(
      ctx,
      x - 450,
      0,
      x + 450,
      0
    );

  ctx.fillStyle =
    gradient;

  ctx.shadowBlur = 35;
  ctx.shadowColor =
    "#00ffff";

  ctx.fillText(
    "UPTIME",
    x,
    y
  );

  ctx.shadowBlur = 0;
}

// ======================================================
// SUBTITLE
// ======================================================

function drawSubtitle(
  ctx,
  x,
  y
) {

  ctx.textAlign =
    "center";

  ctx.font =
    "bold 34px Arial";

  ctx.fillStyle =
    "#ffffff";

  ctx.shadowBlur = 12;
  ctx.shadowColor =
    "#00ffff";

  ctx.fillText(
    "—  SYSTEM STABLE   •   BOT RUNNING  —",
    x,
    y
  );

  ctx.shadowBlur = 0;
}

// ======================================================
// MAIN PANEL
// ======================================================

function drawMainPanel(
  ctx,
  x,
  y,
  width,
  height
) {

  ctx.fillStyle =
    "rgba(0,0,15,0.80)";

  roundRect(
    ctx,
    x,
    y,
    width,
    height,
    35
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

  ctx.lineWidth = 6;

  ctx.shadowBlur = 25;
  ctx.shadowColor =
    "#00ffff";

  roundRect(
    ctx,
    x,
    y,
    width,
    height,
    35
  );

  ctx.stroke();

  ctx.shadowBlur = 0;
}

// ======================================================
// INFO ROW
// ======================================================

function drawInfoRow(
  ctx,
  x,
  y,
  width,
  height,
  label,
  value,
  icon,
  color
) {

  const half =
    width * 0.48;

  // -----------------------------------------------
  // LEFT
  // -----------------------------------------------

  drawCapsule(
    ctx,
    x,
    y,
    half,
    height,
    color
  );

  // -----------------------------------------------
  // RIGHT
  // -----------------------------------------------

  drawCapsule(
    ctx,
    x + half + 18,
    y,
    width - half - 18,
    height,
    color
  );

  // -----------------------------------------------
  // ICON
  // -----------------------------------------------

  ctx.textAlign =
    "center";

  ctx.font =
    "bold 42px Arial";

  ctx.fillStyle =
    color;

  ctx.shadowBlur = 18;
  ctx.shadowColor =
    color;

  ctx.fillText(
    icon,
    x + 62,
    y + 53
  );

  ctx.shadowBlur = 0;

  // -----------------------------------------------
  // LABEL
  // -----------------------------------------------

  ctx.textAlign =
    "left";

  ctx.font =
    "bold 37px Arial";

  ctx.fillStyle =
    color;

  ctx.shadowBlur = 12;
  ctx.shadowColor =
    color;

  ctx.fillText(
    label,
    x + 105,
    y + 51
  );

  ctx.shadowBlur = 0;

  // -----------------------------------------------
  // VALUE
  // -----------------------------------------------

  ctx.textAlign =
    "center";

  ctx.font =
    "bold 35px Arial";

  ctx.fillStyle =
    "#ffffff";

  ctx.shadowBlur = 13;
  ctx.shadowColor =
    "#ffffff";

  ctx.fillText(
    value,
    x + half + 18 +
      (width - half - 18) / 2,
    y + 51
  );

  ctx.shadowBlur = 0;
}

// ======================================================
// CAPSULE
// ======================================================

function drawCapsule(
  ctx,
  x,
  y,
  width,
  height,
  color
) {

  ctx.fillStyle =
    "rgba(8,5,20,0.80)";

  roundRect(
    ctx,
    x,
    y,
    width,
    height,
    30
  );

  ctx.fill();

  ctx.strokeStyle =
    color;

  ctx.lineWidth = 4;

  ctx.shadowBlur = 18;
  ctx.shadowColor =
    color;

  roundRect(
    ctx,
    x,
    y,
    width,
    height,
    30
  );

  ctx.stroke();

  ctx.shadowBlur = 0;
}

// ======================================================
// USE COMMANDS
// ======================================================

function drawUseCommands(
  ctx,
  WIDTH,
  y
) {

  ctx.textAlign =
    "center";

  ctx.font =
    "bold 31px Arial";

  ctx.fillStyle =
    createRGBGradient(
      ctx,
      WIDTH / 2 - 300,
      0,
      WIDTH / 2 + 300,
      0
    );

  ctx.shadowBlur = 18;
  ctx.shadowColor =
    "#ff00ff";

  ctx.fillText(
    "•  USE COMMANDS  •",
    WIDTH / 2,
    y
  );

  ctx.shadowBlur = 0;

  // Command capsule

  const x = 315;
  const w = 906;
  const h = 80;

  drawCapsule(
    ctx,
    x,
    y + 25,
    w,
    h,
    "#00ffff"
  );

  ctx.font =
    "bold 38px Arial";

  ctx.fillStyle =
    "#ffffff";

  ctx.shadowBlur = 12;
  ctx.shadowColor =
    "#00ffff";

  ctx.fillText(
    "upt   /   .upt   /   !upt",
    WIDTH / 2,
    y + 78
  );

  ctx.shadowBlur = 0;

  ctx.font =
    "bold 26px Arial";

  ctx.fillStyle =
    "#bdefff";

  ctx.fillText(
    "( Non-Prefix : upt )",
    WIDTH / 2,
    y + 140
  );
}

// ======================================================
// FOOTER
// ======================================================

function drawFooter(
  ctx,
  WIDTH,
  HEIGHT
) {

  drawRGBLine(
    ctx,
    220,
    HEIGHT - 105,
    WIDTH - 220,
    HEIGHT - 105
  );

  ctx.textAlign =
    "center";

  ctx.font =
    "bold 31px Arial";

  ctx.fillStyle =
    createRGBGradient(
      ctx,
      450,
      0,
      1080,
      0
    );

  ctx.shadowBlur = 20;
  ctx.shadowColor =
    "#ff00ff";

  ctx.fillText(
    "♥  MADE BY 𝗧𝗛𝗔𝗞𝗨𝗥 𝗦𝗔𝗛𝗔𝗕  ♥",
    WIDTH / 2,
    HEIGHT - 55
  );

  ctx.shadowBlur = 0;
}

// ======================================================
// RGB LINE
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

  ctx.lineWidth = 6;

  ctx.shadowBlur = 20;
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
// RGB GRADIENT
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
    "#0080ff"
  );

  gradient.addColorStop(
    0.45,
    "#00ffff"
  );

  gradient.addColorStop(
    0.60,
    "#00ff66"
  );

  gradient.addColorStop(
    0.75,
    "#ffff00"
  );

  gradient.addColorStop(
    0.88,
    "#ff8000"
  );

  gradient.addColorStop(
    1,
    "#ff00ff"
  );

  return gradient;
}

// ======================================================
// GLOW
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
// ROUND RECT
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
// SAVE CANVAS
// ======================================================

function saveCanvas(
  canvas,
  filePath
) {

  return new Promise(
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
}
