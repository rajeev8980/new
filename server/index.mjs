import { createServer } from "node:http";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { createReadStream, existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT || 8787);
const HOST = "0.0.0.0";
const root = dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.DATA_DIR || join(root, "data");
const dbPath = join(dataDir, "db.json");
const distDir = resolve(root, "..", "dist");

const THREADS = ["aarohi", "ourlove", "study", "friends", "secret"];

function seedMessages() {
  return {
    aarohi: [
      { id: "m1", from: "me", kind: "text", text: "Good Morning 💛\nHave a lovely day! 🌸", time: "8:10 AM", read: true },
      { id: "m2", from: "them", kind: "text", text: "Good Morning 😊\nYou too! 💕", time: "8:12 AM" },
      { id: "m3", from: "them", kind: "photo", photo: "/photos/beach.jpg", time: "8:20 AM" },
      { id: "m4", from: "me", kind: "voice", duration: "0:24", time: "8:25 AM", read: true },
    ],
    ourlove: [
      { id: "o1", from: "them", kind: "text", text: "Don’t stay up too late. I saved you the last piece of cake.", time: "8:12 PM" },
      { id: "o2", from: "me", kind: "text", text: "Good night ❤️", time: "8:32 PM", read: true },
    ],
    study: [
      { id: "s1", from: "them", kind: "text", text: "Notes uploaded for tomorrow’s class. Chapter 4 is highlighted.", time: "6:10 PM" },
      { id: "s2", from: "me", kind: "text", text: "Got them, thank you!", time: "6:14 PM", read: true },
    ],
    friends: [
      { id: "f1", from: "them", kind: "text", text: "Ananya: Let’s meet tomorrow 🔥 Cafe by the lake, 5 PM?", time: "5:06 PM" },
    ],
    secret: [
      { id: "sec1", from: "them", kind: "text", text: "This chat disappears. Say the thing you only tell me.", time: "9:02 PM" },
    ],
  };
}

function seedCommunities() {
  return [
    { id: "c1", name: "Education", sub: "Study, Exams, Career", count: "24K", icon: "cap", bg: "linear-gradient(145deg,#b06bff,#6a35e8)", members: 24000 },
    { id: "c2", name: "Technology", sub: "AI, Coding, Gadgets", count: "18K", icon: "code", bg: "linear-gradient(145deg,#8b6bff,#5a3adf)", members: 18000 },
    { id: "c3", name: "Relationships", sub: "Love, Dating, Advice", count: "32K", icon: "heart", bg: "linear-gradient(145deg,#ff5aa8,#ff2d8a)", members: 32000 },
    { id: "c4", name: "Travel", sub: "Trips, Photos, Planning", count: "9.4K", icon: "plane", bg: "linear-gradient(145deg,#4cc3ff,#2f6bff)", members: 9400 },
    { id: "c5", name: "Fitness & Health", sub: "Workout, Diet, Wellness", count: "15K", icon: "dumbbell", bg: "linear-gradient(145deg,#ffc14a,#ff8a2a)", members: 15000 },
  ];
}

function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(password, salt, 32).toString("hex");
  return { salt, hash };
}

function passwordOk(password, salt, hash) {
  const next = scryptSync(password, salt, 32);
  const prev = Buffer.from(hash, "hex");
  return prev.length === next.length && timingSafeEqual(prev, next);
}

function freshDb() {
  const pass = hashPassword("love123");
  const user = {
    id: "u_aarohi",
    email: "aarohi@new.chat",
    name: "Aarohi Sharma",
    handle: "@aarohi_new",
    bio: "Always believe in yourself 💕",
    premium: false,
    theme: "romantic",
    ...pass,
    createdAt: new Date().toISOString(),
  };
  return {
    users: [user],
    sessions: [],
    resets: [],
    inboxes: { [user.id]: seedMessages() },
    communities: seedCommunities(),
    joins: {},
  };
}

function load() {
  if (!existsSync(dbPath)) return freshDb();
  try {
    const parsed = JSON.parse(readFileSync(dbPath, "utf8"));
    if (!parsed.users?.length) return freshDb();
    return parsed;
  } catch {
    return freshDb();
  }
}

const db = load();
mkdirSync(dirname(dbPath), { recursive: true });
save();

function save() {
  const tmp = `${dbPath}.tmp`;
  writeFileSync(tmp, JSON.stringify(db, null, 2));
  renameSync(tmp, dbPath);
}

function nowTime() {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ap}`;
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    handle: user.handle,
    bio: user.bio,
    premium: Boolean(user.premium),
    theme: user.theme || "romantic",
  };
}

function issueSession(user) {
  const token = randomBytes(24).toString("hex");
  db.sessions.push({
    token,
    userId: user.id,
    createdAt: new Date().toISOString(),
  });
  save();
  return token;
}

function userFromAuth(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return null;
  const session = db.sessions.find((s) => s.token === token);
  if (!session) return null;
  return db.users.find((u) => u.id === session.userId) || null;
}

function inboxFor(user) {
  if (!db.inboxes[user.id]) {
    db.inboxes[user.id] = seedMessages();
    save();
  }
  return db.inboxes[user.id];
}

function previewOf(threadId, messages) {
  if (threadId === "aarohi") return { preview: "Typing…", typing: true, time: "9:41 PM", badge: 2 };
  const last = messages[messages.length - 1];
  if (!last) return { preview: "", time: "" };
  const text = last.kind === "photo" ? "Photo" : last.kind === "voice" ? "Voice note" : last.text || "";
  const mine = last.from === "me" ? "You: " : "";
  return {
    preview: `${mine}${text}`.replace(/\n/g, " "),
    time: last.time,
    typing: false,
  };
}

function chatList(user) {
  const box = inboxFor(user);
  const base = [
    { id: "aarohi", name: "Aarohi", heart: true, photo: "/photos/riya.jpg" },
    { id: "ourlove", name: "Our Love", heart: true, photo: "", couple: true, previewPink: true },
    { id: "study", name: "Study Group", emoji: "📚", icon: "users", iconBg: "linear-gradient(145deg,#7a4dff,#4b2ad4)", badge: 12 },
    { id: "friends", name: "Friends Forever", emoji: "🔥", photo: "/photos/aarohi.jpg" },
    { id: "secret", name: "Secret Chat", heart: false, photo: "", icon: "lock", iconBg: "linear-gradient(145deg,#c9a0ff,#7d4dff)" },
  ];
  return base.map((row) => {
    const live = previewOf(row.id, box[row.id] || []);
    return { ...row, ...live, badge: row.badge };
  });
}

function formatCount(n) {
  if (n >= 1000) {
    const v = n / 1000;
    const text = v >= 10 ? v.toFixed(1).replace(/\.0$/, "") : v.toFixed(1).replace(/\.0$/, "");
    return `${text}K`;
  }
  return String(n);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 1_000_000) {
        reject(new Error("Body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (!chunks.length) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function send(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function handleOf(name) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 16) || "new";
  return `@${slug}`;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const path = url.pathname.replace(/\/$/, "") || "/";
  const method = req.method || "GET";

  if (method === "OPTIONS") {
    send(res, 204, {});
    return;
  }

  try {
    if (method === "GET" && path === "/api/health") {
      send(res, 200, { ok: true, service: "new-api" });
      return;
    }

    if (method === "POST" && path === "/api/auth/signup") {
      const body = await readBody(req);
      const email = String(body.email || body.id || "").trim().toLowerCase();
      const name = String(body.name || "").trim();
      const password = String(body.password || "");
      if (!email || !name || password.length < 4) {
        send(res, 400, { error: "Add your name, mobile or email, and a password." });
        return;
      }
      if (db.users.some((u) => u.email === email)) {
        send(res, 409, { error: "That mobile or email already has an account. Sign in instead." });
        return;
      }
      const user = {
        id: `u_${randomBytes(6).toString("hex")}`,
        email,
        name,
        handle: handleOf(name),
        bio: "Always believe in yourself 💕",
        premium: false,
        theme: "romantic",
        ...hashPassword(password),
        createdAt: new Date().toISOString(),
      };
      db.users.push(user);
      db.inboxes[user.id] = seedMessages();
      const token = issueSession(user);
      send(res, 201, { token, user: publicUser(user) });
      return;
    }

    if (method === "POST" && path === "/api/auth/signin") {
      const body = await readBody(req);
      const email = String(body.email || body.id || "").trim().toLowerCase();
      const password = String(body.password || "");
      const user = db.users.find((u) => u.email === email);
      if (!user || !passwordOk(password, user.salt, user.hash)) {
        send(res, 401, { error: "That mobile, email, or password doesn’t match." });
        return;
      }
      const token = issueSession(user);
      send(res, 200, { token, user: publicUser(user) });
      return;
    }

    if (method === "POST" && path === "/api/auth/social") {
      const body = await readBody(req);
      const provider = String(body.provider || "google").toLowerCase();
      const email = `${provider}@new.chat`;
      let user = db.users.find((u) => u.email === email);
      if (!user) {
        user = {
          id: `u_${provider}`,
          email,
          name: "Aarohi Sharma",
          handle: "@aarohi_new",
          bio: "Always believe in yourself 💕",
          premium: false,
          theme: "romantic",
          ...hashPassword(randomBytes(8).toString("hex")),
          createdAt: new Date().toISOString(),
        };
        db.users.push(user);
        db.inboxes[user.id] = seedMessages();
      }
      const token = issueSession(user);
      send(res, 200, { token, user: publicUser(user) });
      return;
    }

    if (method === "POST" && path === "/api/auth/forgot") {
      const body = await readBody(req);
      const email = String(body.email || "").trim().toLowerCase();
      if (!email) {
        send(res, 400, { error: "Enter your mobile or email." });
        return;
      }
      const user = db.users.find((u) => u.email === email);
      if (user) {
        db.resets.push({
          email,
          token: randomBytes(8).toString("hex"),
          createdAt: new Date().toISOString(),
        });
        save();
      }
      send(res, 200, { ok: true, message: "If an account exists, a reset link is on its way." });
      return;
    }

    const user = userFromAuth(req);

    if (method === "GET" && path === "/api/me") {
      if (!user) return send(res, 401, { error: "Sign in again." });
      send(res, 200, { user: publicUser(user) });
      return;
    }

    if (method === "PATCH" && path === "/api/me") {
      if (!user) return send(res, 401, { error: "Sign in again." });
      const body = await readBody(req);
      if (typeof body.name === "string" && body.name.trim()) user.name = body.name.trim();
      if (typeof body.handle === "string" && body.handle.trim()) {
        user.handle = body.handle.trim().startsWith("@") ? body.handle.trim() : `@${body.handle.trim()}`;
      }
      if (typeof body.bio === "string") user.bio = body.bio;
      if (typeof body.premium === "boolean") user.premium = body.premium;
      if (typeof body.theme === "string") user.theme = body.theme;
      save();
      send(res, 200, { user: publicUser(user) });
      return;
    }

    if (method === "GET" && path === "/api/chats") {
      if (!user) return send(res, 401, { error: "Sign in again." });
      const box = inboxFor(user);
      send(res, 200, { chats: chatList(user).filter((c) => c.id !== "secret"), messages: box });
      return;
    }

    const threadMatch = path.match(/^\/api\/threads\/([a-z]+)\/messages$/);
    if (threadMatch) {
      if (!user) return send(res, 401, { error: "Sign in again." });
      const id = threadMatch[1];
      if (!THREADS.includes(id)) return send(res, 404, { error: "Chat not found." });
      const box = inboxFor(user);
      if (method === "GET") {
        send(res, 200, { messages: box[id] || [] });
        return;
      }
      if (method === "POST") {
        const body = await readBody(req);
        const kind = body.kind === "photo" || body.kind === "voice" ? body.kind : "text";
        const msg = {
          id: randomBytes(4).toString("hex"),
          from: "me",
          kind,
          text: typeof body.text === "string" ? body.text : "",
          time: nowTime(),
          read: true,
        };
        if (kind === "photo") msg.photo = String(body.photo || "/photos/beach.jpg");
        if (kind === "voice") msg.duration = String(body.duration || "0:04");
        box[id] = [...(box[id] || []), msg];
        save();
        send(res, 201, { message: msg });
        return;
      }
    }

    if (method === "GET" && path === "/api/communities") {
      const joined = user ? new Set(db.joins[user.id] || []) : new Set();
      send(res, 200, {
        communities: db.communities.map((c) => ({
          ...c,
          joined: joined.has(c.id),
          created: Boolean(c.created),
        })),
      });
      return;
    }

    if (method === "POST" && path === "/api/communities") {
      if (!user) return send(res, 401, { error: "Sign in again." });
      const body = await readBody(req);
      const name = String(body.name || "").trim();
      const sub = String(body.topic || body.sub || "New community").trim();
      if (!name) return send(res, 400, { error: "Name your community." });
      const community = {
        id: `c_${randomBytes(4).toString("hex")}`,
        name,
        sub,
        count: "1",
        members: 1,
        icon: "users",
        bg: "linear-gradient(145deg,#ff7ab8,#ff2d8a)",
        created: true,
        ownerId: user.id,
      };
      db.communities.unshift(community);
      db.joins[user.id] = [...new Set([...(db.joins[user.id] || []), community.id])];
      save();
      send(res, 201, { community });
      return;
    }

    const joinMatch = path.match(/^\/api\/communities\/([^/]+)\/join$/);
    if (method === "POST" && joinMatch) {
      if (!user) return send(res, 401, { error: "Sign in again." });
      const community = db.communities.find((c) => c.id === decodeURIComponent(joinMatch[1]));
      if (!community) return send(res, 404, { error: "Community not found." });
      const mine = new Set(db.joins[user.id] || []);
      if (!mine.has(community.id)) {
        mine.add(community.id);
        community.members = (community.members || 0) + 1;
        community.count = community.created ? String(community.members) : formatCount(community.members);
      }
      db.joins[user.id] = [...mine];
      save();
      send(res, 200, { community: { ...community, joined: true } });
      return;
    }

    if ((method === "GET" || method === "HEAD") && !path.startsWith("/api") && serveStatic(res, path, method)) {
      return;
    }

    send(res, 404, { error: "Not found." });
  } catch (error) {
    send(res, 400, { error: error instanceof Error ? error.message : "Bad request" });
  }
});

const STATIC_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function staticFile(urlPath) {
  const rel = decodeURIComponent(urlPath).replace(/^\/+/, "");
  const file = resolve(distDir, rel);
  if (file !== distDir && !file.startsWith(distDir + sep)) return null;
  return file;
}

function serveStatic(res, urlPath, method) {
  if (!existsSync(distDir)) return false;
  const requested = urlPath === "/" ? "/index.html" : urlPath;
  const file = staticFile(requested);
  let target = null;
  try {
    if (file && statSync(file).isFile()) target = file;
  } catch {
    target = null;
  }
  if (!target) {
    const index = join(distDir, "index.html");
    if (!existsSync(index)) return false;
    target = index;
  }
  res.writeHead(200, {
    "Content-Type": STATIC_TYPES[extname(target)] || "application/octet-stream",
    "Cache-Control": target.endsWith(".html") ? "no-cache" : "public, max-age=3600",
  });
  if (method === "HEAD") {
    res.end();
    return true;
  }
  createReadStream(target).pipe(res);
  return true;
}

server.listen(PORT, HOST, () => {
  console.log(`New listening on http://${HOST}:${PORT}`);
});
