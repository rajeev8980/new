import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { api, type Session } from "./api";
import {
  chatRows,
  initialMessages,
  nowTime,
  type ChatMsg,
  type ThemeId,
  type ThreadId,
} from "./data";

export type Screen =
  | "splash"
  | "signin"
  | "signup"
  | "chats"
  | "thread"
  | "call"
  | "reels"
  | "discover"
  | "love"
  | "ai"
  | "groups"
  | "communities"
  | "games"
  | "location"
  | "secret"
  | "secretThread"
  | "privacy"
  | "premium"
  | "themes"
  | "profile"
  | "story";

export type Tab = "chats" | "reels" | "discover" | "profile";
export type ChatTab = "chats" | "groups" | "communities";

const TABS: Tab[] = ["chats", "reels", "discover", "profile"];

type Ctx = {
  screen: Screen;
  tab: Tab;
  chatTab: ChatTab;
  setChatTab: (t: ChatTab) => void;
  authed: boolean;
  go: (s: Screen) => void;
  back: () => void;
  setTab: (t: Tab) => void;
  enter: (session?: Session) => void;
  token: string | null;
  chats: typeof chatRows;
  setAuthScreen: (s: "splash" | "signin" | "signup") => void;
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
  wallpaper: string | null;
  setWallpaper: (id: string | null) => void;
  premium: boolean;
  setPremium: (v: boolean) => void;
  threadId: ThreadId;
  openThread: (id: ThreadId) => void;
  messages: Record<ThreadId, ChatMsg[]>;
  send: (id: ThreadId, text: string, kind?: ChatMsg["kind"], extra?: Partial<ChatMsg>) => void;
  toast: string | null;
  notify: (msg: string) => void;
  drawer: boolean;
  setDrawer: (v: boolean) => void;
  profile: { name: string; handle: string; bio: string };
  setProfile: (p: { name: string; handle: string; bio: string }) => void;
  showTabs: boolean;
  storyId: string | null;
  openStory: (id: string) => void;
};

const AppContext = createContext<Ctx | null>(null);

function boot() {
  const q = new URLSearchParams(window.location.search);
  const requested = (q.get("screen") || "splash") as Screen;
  const theme = (q.get("theme") as ThemeId) || "romantic";
  const chatTab = (q.get("tab") as ChatTab) || "chats";
  return { requested, theme, chatTab };
}

export function AppState({ children }: { children: ReactNode }) {
  const initial = useMemo(boot, []);
  const pre = initial.requested === "splash" || initial.requested === "signin" || initial.requested === "signup";
  const [authScreen, setAuthScreen] = useState<"splash" | "signin" | "signup" | null>(
    initial.requested === "splash" || initial.requested === "signin" || initial.requested === "signup"
      ? initial.requested
      : null,
  );
  const [tab, setTabState] = useState<Tab>(
    TABS.includes(initial.requested as Tab) ? (initial.requested as Tab) : "chats",
  );
  const [stack, setStack] = useState<Screen[]>(
    !pre && !TABS.includes(initial.requested as Tab) ? [initial.requested] : [],
  );
  const [chatTab, setChatTab] = useState<ChatTab>(initial.chatTab);
  const [theme, setThemeState] = useState<ThemeId>(initial.theme);
  const [wallpaper, setWallpaper] = useState<string | null>(null);
  const [premium, setPremiumState] = useState(false);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("new_token"));
  const tokenRef = useRef<string | null>(token);
  const [chats, setChats] = useState(chatRows);
  const [threadId, setThreadId] = useState<ThreadId>(
    initial.requested === "secretThread" ? "secret" : "aarohi",
  );
  const [messages, setMessages] = useState(initialMessages);
  const [toast, setToast] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [profile, setProfileState] = useState({
    name: "Aarohi Sharma",
    handle: "@aarohi_new",
    bio: "Always believe in yourself 💕",
  });
  const [storyId, setStoryId] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(t);
  }, [toast]);

  function remember(session: Session) {
    tokenRef.current = session.token;
    localStorage.setItem("new_token", session.token);
    setToken(session.token);
    setProfileState({
      name: session.user.name,
      handle: session.user.handle,
      bio: session.user.bio,
    });
    setPremiumState(session.user.premium);
    if (!new URLSearchParams(window.location.search).get("theme")) {
      setThemeState((session.user.theme as ThemeId) || "romantic");
    }
  }

  function loadInbox(authToken: string) {
    api.chats(authToken).then((data) => {
      setMessages(data.messages as typeof initialMessages);
      if (Array.isArray(data.chats)) setChats(data.chats as typeof chatRows);
    }).catch(() => {});
  }

  useEffect(() => {
    const saved = tokenRef.current;
    if (!saved || initial.requested !== "splash") return;
    api.me(saved).then(({ user }) => {
      remember({ token: saved, user });
      loadInbox(saved);
      setAuthScreen(null);
      setTabState("chats");
      setStack([]);
    }).catch(() => {
      localStorage.removeItem("new_token");
      tokenRef.current = null;
      setToken(null);
    });
    // Restore a saved session only on a normal launch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const screen: Screen = authScreen ?? stack[stack.length - 1] ?? tab;
  const showTabs = !authScreen && stack.length === 0;

  const value: Ctx = {
    screen,
    tab,
    chatTab,
    setChatTab,
    authed: !authScreen,
    go: (s) => {
      setDrawer(false);
      if (s === "chats" || s === "reels" || s === "discover" || s === "profile") {
        setTabState(s);
        setStack([]);
        return;
      }
      setStack((st) => [...st, s]);
    },
    back: () => {
      setDrawer(false);
      if (stack.length) setStack((st) => st.slice(0, -1));
      else setTabState("chats");
    },
    setTab: (t) => {
      setDrawer(false);
      setTabState(t);
      setStack([]);
    },
    enter: (session) => {
      if (session) {
        remember(session);
        loadInbox(session.token);
      }
      setAuthScreen(null);
      setTabState("chats");
      setStack([]);
    },
    token,
    chats,
    setAuthScreen,
    theme,
    setTheme: (next) => {
      setThemeState(next);
      const authToken = tokenRef.current;
      if (authToken) api.patchMe(authToken, { theme: next }).catch(() => {});
    },
    wallpaper,
    setWallpaper,
    premium,
    setPremium: (next) => {
      setPremiumState(next);
      const authToken = tokenRef.current;
      if (authToken) api.patchMe(authToken, { premium: next }).catch(() => {});
    },
    threadId,
    openThread: (id) => {
      setThreadId(id);
      setDrawer(false);
      setStack((st) => [...st, "thread"]);
    },
    messages,
    send: (id, text, kind = "text", extra) => {
      const msg: ChatMsg = {
        id: Math.random().toString(36).slice(2, 8),
        from: "me",
        kind,
        text,
        time: nowTime(),
        read: true,
        ...extra,
      };
      setMessages((m) => ({ ...m, [id]: [...(m[id] || []), msg] }));
      const authToken = tokenRef.current;
      if (!authToken) return;
      api.sendMessage(authToken, id, {
        text,
        kind,
        photo: extra?.photo,
        duration: extra?.duration,
      }).catch(() => setToast("Couldn’t save that message."));
    },
    toast,
    notify: (msg) => setToast(msg),
    drawer,
    setDrawer,
    profile,
    setProfile: (next) => {
      setProfileState(next);
      const authToken = tokenRef.current;
      if (!authToken) return;
      api.patchMe(authToken, next).catch(() => setToast("Couldn’t save your profile."));
    },
    showTabs,
    storyId,
    openStory: (id) => {
      setStoryId(id);
      setDrawer(false);
      setStack((st) => (st[st.length - 1] === "story" ? st : [...st, "story"]));
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp outside provider");
  return ctx;
}
