export const photos = {
  aarohi: "/photos/riya.jpg",
  pooja: "/photos/aarohi2.jpg",
  neha: "/photos/meera.jpg",
  ananya: "/photos/aarohi.jpg",
  riya: "/photos/reel.jpg",
  man: "/photos/man2.jpg",
  beach: "/photos/beach.jpg",
  sunset: "/photos/sunset.jpg",
  reel: "/photos/reel.jpg",
  reel2: "/photos/fashion.jpg",
  memory: "/photos/beach2.jpg",
  smile: "/photos/smile.jpg",
};

export type ThreadId = "aarohi" | "ourlove" | "study" | "friends" | "secret";

export type ChatMsg = {
  id: string;
  from: "me" | "them";
  kind: "text" | "photo" | "voice";
  text?: string;
  time: string;
  photo?: string;
  duration?: string;
  read?: boolean;
};

export const stories = [
  { id: "aarohi", name: "Aarohi", photo: photos.aarohi, online: true, image: photos.sunset, caption: "Golden hour, thinking of you 💕" },
  { id: "pooja", name: "Pooja", photo: photos.pooja, online: false, image: photos.beach, caption: "Beach day with my people ✨" },
  { id: "neha", name: "Neha", photo: photos.neha, online: true, image: photos.reel2, caption: "Soft sunset moods" },
  { id: "riya", name: "Riya", photo: photos.riya, online: false, image: photos.memory, caption: "Miss this view" },
];

export const chatRows = [
  {
    id: "aarohi" as ThreadId,
    name: "Aarohi",
    heart: true,
    photo: photos.aarohi,
    preview: "Typing…",
    typing: true,
    time: "9:41 PM",
    badge: 2,
  },
  {
    id: "ourlove" as ThreadId,
    name: "Our Love",
    heart: true,
    photo: "",
    couple: true,
    preview: "You: Good night ❤️",
    previewPink: true,
    time: "8:32 PM",
  },
  {
    id: "study" as ThreadId,
    name: "Study Group",
    emoji: "📚",
    icon: "users",
    iconBg: "linear-gradient(145deg,#7a4dff,#4b2ad4)",
    preview: "Notes uploaded",
    time: "6:10 PM",
    badge: 12,
  },
  {
    id: "friends" as ThreadId,
    name: "Friends Forever",
    emoji: "🔥",
    photo: photos.ananya,
    preview: "Ananya: Let’s meet tomorrow",
    time: "5:06 PM",
  },
];

export const groups = [
  { id: "g1", name: "Our Love Group", heart: true, members: "24 members", meta: "Active now", kind: "couple" as const },
  { id: "g2", name: "B.Ed Teaching Hub", members: "1.8K members", meta: "", icon: "cap", bg: "linear-gradient(145deg,#ff7ad2,#c43ad4)" },
  { id: "g3", name: "UPSC Prep Group", members: "5.4K members", meta: "", icon: "book", bg: "linear-gradient(145deg,#7d5cff,#3a2ad8)" },
  { id: "g4", name: "Tech & AI Community", members: "12K members", meta: "", icon: "code", bg: "linear-gradient(145deg,#3ec6ff,#3a4bff)" },
  { id: "g5", name: "Movie & Web Series", members: "3.2K members", meta: "", icon: "clapper", bg: "linear-gradient(145deg,#ffb15a,#ff5a3c)" },
];

export const communities = [
  { id: "c1", name: "Education", sub: "Study, Exams, Career", count: "24K", icon: "cap", bg: "linear-gradient(145deg,#b06bff,#6a35e8)" },
  { id: "c2", name: "Technology", sub: "AI, Coding, Gadgets", count: "18K", icon: "code", bg: "linear-gradient(145deg,#8b6bff,#5a3adf)" },
  { id: "c3", name: "Relationships", sub: "Love, Dating, Advice", count: "32K", icon: "heart", bg: "linear-gradient(145deg,#ff5aa8,#ff2d8a)" },
  { id: "c4", name: "Travel", sub: "Trips, Photos, Planning", count: "9.4K", icon: "plane", bg: "linear-gradient(145deg,#4cc3ff,#2f6bff)" },
  { id: "c5", name: "Fitness & Health", sub: "Workout, Diet, Wellness", count: "15K", icon: "dumbbell", bg: "linear-gradient(145deg,#ffc14a,#ff8a2a)" },
];

export const discoverItems = [
  { id: "chats", screen: "chats" as const, title: "Chat & Calls", sub: "HD chat, voice & video call", icon: "chat", bg: "linear-gradient(145deg,#ff7ad4,#ff2d8a)" },
  { id: "love", screen: "love" as const, title: "Love Features", sub: "Memories, countdown, letters", icon: "heart", bg: "linear-gradient(145deg,#ff8ec4,#ff3d92)" },
  { id: "ai", screen: "ai" as const, title: "AI Assistant", sub: "Smart reply, shayari, translate", icon: "spark", bg: "linear-gradient(145deg,#c084ff,#7a3cff)" },
  { id: "reels", screen: "reels" as const, title: "Stories & Reels", sub: "Share moments, short videos", icon: "reels", bg: "linear-gradient(145deg,#ff7ad0,#a13cff)" },
  { id: "groups", screen: "groups" as const, title: "Groups & Communities", sub: "Study, hobby, interest groups", icon: "users", bg: "linear-gradient(145deg,#ff8ab8,#e23d88)" },
  { id: "games", screen: "games" as const, title: "Games for Couples", sub: "Play, quiz, challenges", icon: "game", bg: "linear-gradient(145deg,#ff6ad5,#ff2f8e)" },
  { id: "location", screen: "location" as const, title: "Live Location Sharing", sub: "Share real-time location", icon: "pin", bg: "linear-gradient(145deg,#d07bff,#8a3cff)" },
  { id: "secret", screen: "secret" as const, title: "Secret / Private Chat", sub: "Locked & disappearing chats", icon: "lock", bg: "linear-gradient(145deg,#c9a0ff,#7d4dff)" },
  { id: "privacy", screen: "privacy" as const, title: "Privacy & Security", sub: "End-to-end encryption", icon: "shield", bg: "linear-gradient(145deg,#9d8bff,#5b46e6)" },
  { id: "premium", screen: "premium" as const, title: "Premium Membership", sub: "Exclusive features & themes", icon: "crown", bg: "linear-gradient(145deg,#ffc85a,#ff8a2d)" },
  { id: "themes", screen: "themes" as const, title: "Themes", sub: "Romantic, neon, sunset & more", icon: "palette", bg: "linear-gradient(145deg,#ff7ac8,#7a4dff)" },
];

export const games = [
  { id: "quiz", title: "Love Quiz", sub: "How well do you know each other?", icon: "quiz", bg: "linear-gradient(145deg,#ff6ec8,#ff2d8a)" },
  { id: "challenge", title: "Couple Challenge", sub: "Fun tasks for couples", icon: "hearts", bg: "linear-gradient(145deg,#ffb15a,#ff7a3c)" },
  { id: "tod", title: "Truth or Dare", sub: "A little spice for two", heart: true, icon: "lips", bg: "linear-gradient(145deg,#ff9a3c,#ff5a2a)" },
  { id: "puzzle", title: "Love Puzzle", sub: "Solve together & win", icon: "puzzle", bg: "linear-gradient(145deg,#ff6ad0,#e23dad)" },
  { id: "spin", title: "Spin the Bottle", sub: "A fun classic game", icon: "bottle", bg: "linear-gradient(145deg,#ff8ad0,#ff4d6d)" },
];

export const premiumFeatures = [
  "Ad-free experience",
  "Premium themes & wallpapers",
  "Exclusive stickers & gifts",
  "More cloud storage (50 GB)",
  "Advanced privacy controls",
  "AI assistant (unlimited)",
  "Profile badge & priority support",
];

export const themes = [
  { id: "romantic", name: "Romantic" },
  { id: "dark", name: "Dark" },
  { id: "neon", name: "Neon" },
  { id: "sunset", name: "Sunset" },
  { id: "nature", name: "Nature" },
  { id: "classic", name: "Classic" },
] as const;

export type ThemeId = (typeof themes)[number]["id"];

export const wallpapers = [
  { id: "hearts", name: "Heart glow" },
  { id: "sunset", name: "Sunset silk" },
  { id: "neon", name: "Neon night" },
  { id: "ocean", name: "Moon tide" },
];

export const initialMessages: Record<ThreadId, ChatMsg[]> = {
  aarohi: [
    { id: "m1", from: "me", kind: "text", text: "Good Morning 💛\nHave a lovely day! 🌸", time: "8:10 AM", read: true },
    { id: "m2", from: "them", kind: "text", text: "Good Morning 😊\nYou too! 💕", time: "8:12 AM" },
    { id: "m3", from: "them", kind: "photo", photo: photos.beach, time: "8:20 AM" },
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

export const reels = [
  {
    id: "r1",
    photo: photos.reel,
    user: "aarohi",
    avatar: photos.aarohi,
    caption: "Sunset vibes 💕",
    likes: 12400,
    comments: 328,
    shares: 86,
  },
  {
    id: "r2",
    photo: photos.reel2,
    user: "aarohi",
    avatar: photos.aarohi,
    caption: "Soft light, loud heart ✨",
    likes: 8600,
    comments: 142,
    shares: 41,
  },
];

export function formatCount(n: number) {
  if (n >= 10000) {
    const v = n / 1000;
    return `${v >= 10 ? v.toFixed(1).replace(/\.0$/, "") : v.toFixed(1)}K`;
  }
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

export function nowTime() {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ap}`;
}
