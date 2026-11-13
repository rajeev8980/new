import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";

const outDir = "/cursor/stores/self/media";
await mkdir(outDir, { recursive: true });

const shots = [
  ["splash", "splash.png"],
  ["signin", "sign-in.png"],
  ["signup", "sign-up.png"],
  ["chats", "chats.png"],
  ["thread", "conversation.png"],
  ["call", "video-call.png"],
  ["reels", "reels.png"],
  ["love", "love.png"],
  ["ai", "ai-assistant.png"],
  ["groups", "groups.png"],
  ["communities", "communities.png"],
  ["games", "games.png"],
  ["location", "live-location.png"],
  ["secret", "secret-chat.png"],
  ["privacy", "privacy.png"],
  ["premium", "premium.png"],
  ["themes", "themes.png"],
  ["profile", "profile.png"],
  ["discover", "discover.png"],
];

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});

const page = await browser.newPage();
await page.setViewport({ width: 720, height: 1040, deviceScaleFactor: 2 });
page.on("pageerror", (err) => console.log("PAGEERROR", err.message));
page.on("console", (msg) => {
  if (msg.type() === "error") console.log("CONSOLE", msg.text());
});

for (const [screen, file] of shots) {
  await page.goto(`http://127.0.0.1:5173/?screen=${screen}`, { waitUntil: "networkidle0" });
  await page.waitForSelector(".phone");
  const box = await page.$eval(".phone", (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  const pad = 46;
  await page.screenshot({
    path: `${outDir}/${file}`,
    clip: {
      x: Math.max(0, box.x - pad),
      y: Math.max(0, box.y - pad),
      width: box.width + pad * 2,
      height: box.height + pad * 2,
    },
  });
  console.log("saved", file);
}

await browser.close();
