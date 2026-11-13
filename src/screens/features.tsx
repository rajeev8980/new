import { useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "../api";
import { Header, IconButton, Sheet, StatusBar, Switch } from "../components";
import {
  discoverItems,
  formatCount,
  games,
  photos,
  premiumFeatures,
  reels,
  stories,
  themes,
  wallpapers,
  type ThemeId,
} from "../data";
import { Icon, Logo } from "../icons";
import { useApp } from "../state";
import { CommunityList, CreateCommunity, GroupList } from "./lists";

export function Discover() {
  const { go, setTab, setDrawer } = useApp();
  return (
    <div className="page">
      <StatusBar />
      <header className="header home-header">
        <IconButton label="Menu" onClick={() => setDrawer(true)}>
          <Icon name="menu" />
        </IconButton>
        <div className="header-title">
          <div className="header-name">Discover</div>
        </div>
        <IconButton label="Search features" onClick={() => go("chats")}>
          <Icon name="search" />
        </IconButton>
      </header>
      <div className="scroll feature-list">
        {discoverItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className="feature"
            onClick={() => {
              if (item.screen === "chats" || item.screen === "reels") setTab(item.screen);
              else go(item.screen);
            }}
          >
            <span className="ico" style={{ background: item.bg }}>
              <Icon name={item.icon} size={20} />
            </span>
            <span>
              <strong>{item.title}</strong>
              <small>{item.sub}</small>
            </span>
          </button>
        ))}
        <div className="devices">
          <Logo size={28} />
          <div>
            <strong>Available on Android · iOS · Web</strong>
            <small>Sync your chats, media & memories everywhere</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Reels() {
  const { setDrawer, openStory } = useApp();
  const [mode, setMode] = useState<"reels" | "stories">("reels");
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState(false);
  const [share, setShare] = useState(false);
  const [comment, setComment] = useState("");
  const [extra, setExtra] = useState(0);
  const reel = reels[index];
  const likes = reel.likes + (liked[reel.id] ? 1 : 0);

  return (
    <div className="bleed reels">
      {mode === "reels" ? (
        <img className="bleed-img reel-photo" src={reel.photo} alt="Aarohi's reel" />
      ) : (
        <img className="bleed-img" src={stories[0].image} alt="" />
      )}
      <div className="reel-shade" />
      <StatusBar light />
      <div className="reel-top">
        <IconButton label="Menu" onClick={() => setDrawer(true)}>
          <Icon name="menu" />
        </IconButton>
        <div className="reel-tabs">
          <button type="button" className={mode === "reels" ? "on" : ""} onClick={() => setMode("reels")}>
            Reels
          </button>
          <button type="button" className={mode === "stories" ? "on" : ""} onClick={() => setMode("stories")}>
            Stories
          </button>
        </div>
      </div>
      {mode === "reels" ? (
        <>
          <div className="reel-actions">
            <button type="button" className={liked[reel.id] ? "loved" : ""} onClick={() => setLiked((m) => ({ ...m, [reel.id]: !m[reel.id] }))}>
              <Icon name="heart" />
              <span>{formatCount(likes)}</span>
            </button>
            <button type="button" onClick={() => setComments(true)}>
              <Icon name="comment" />
              <span>{reel.comments + extra}</span>
            </button>
            <button type="button" onClick={() => setShare(true)}>
              <Icon name="share" />
              <span>{reel.shares}</span>
            </button>
          </div>
          <div className="reel-caption">
            <img src={reel.avatar} alt="" />
            <div>
              <strong>@{reel.user}</strong>
              <p>{reel.caption}</p>
            </div>
          </div>
          <div className="reel-hit">
            <button type="button" aria-label="Previous reel" onClick={() => setIndex((i) => (i === 0 ? reels.length - 1 : i - 1))} />
            <button type="button" aria-label="Next reel" onClick={() => setIndex((i) => (i + 1) % reels.length)} />
          </div>
        </>
      ) : (
        <div className="story-picks">
          {stories.map((s) => (
            <button key={s.id} type="button" onClick={() => openStory(s.id)} className="story-card">
              <img src={s.photo} alt="" />
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      )}
      {comments && (
        <Sheet title="Comments" onClose={() => setComments(false)}>
          <p className="comment-line"><b>Pooja</b> This light is unreal 🌅</p>
          <p className="comment-line"><b>Neha</b> Take me with you next time</p>
          <form
            className="composer slim"
            onSubmit={(e) => {
              e.preventDefault();
              if (!comment.trim()) return;
              setExtra((n) => n + 1);
              setComment("");
              setComments(false);
            }}
          >
            <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." />
            <button className="mic" type="submit" aria-label="Send comment">
              <Icon name="send" size={16} />
            </button>
          </form>
        </Sheet>
      )}
      {share && (
        <Sheet title="Share reel" onClose={() => setShare(false)}>
          <button type="button" className="btn-pink" onClick={() => setShare(false)}>
            Share to story
          </button>
          <button type="button" className="btn-purple" onClick={() => setShare(false)}>
            Copy link
          </button>
        </Sheet>
      )}
    </div>
  );
}

export function GroupsScreen() {
  const { go } = useApp();
  const [grid, setGrid] = useState(false);
  return (
    <div className="page">
      <StatusBar />
      <Header
        back
        title="Groups"
        heart
        right={
          <IconButton label={grid ? "Show list" : "Show grid"} onClick={() => setGrid((v) => !v)}>
            <Icon name="grid" />
          </IconButton>
        }
      />
      <div className="scroll pad">
        <GroupList layout={grid ? "grid" : "list"} />
        <button type="button" className="btn-purple wide" onClick={() => go("communities")}>
          Browse communities
        </button>
      </div>
    </div>
  );
}

export function CommunitiesScreen() {
  const { token } = useApp();
  const [open, setOpen] = useState(false);
  const [created, setCreated] = useState<{ id: string; name: string; sub: string; count: string }[]>([]);
  useEffect(() => {
    api.communities(token).then((data) => {
      setCreated(data.communities.filter((c) => c.created).map((c) => ({
        id: c.id,
        name: c.name,
        sub: c.sub,
        count: c.count,
      })));
    }).catch(() => {});
  }, [token]);
  return (
    <div className="page">
      <StatusBar />
      <Header
        back
        title={
          <span className="with-ico">
            Communities <Icon name="globe" size={16} className="title-heart" />
          </span>
        }
      />
      <div className="scroll pad">
        <CommunityList created={created} />
      </div>
      <div className="dock">
        <button type="button" className="btn-pink" onClick={() => setOpen(true)}>
          <Icon name="plus" size={16} /> Create Community
        </button>
      </div>
      {open && (
        <CreateCommunity
          onClose={() => setOpen(false)}
          onCreate={async (name, topic) => {
            let id = name;
            if (token) {
              try {
                const saved = await api.createCommunity(token, name, topic);
                id = saved.community.id;
              } catch {
                /* Keep the new row on screen even if the save fails. */
              }
            }
            setCreated((list) => [{ id, name, sub: topic, count: "1" }, ...list]);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

export function Love() {
  const [panel, setPanel] = useState<null | "memories" | "count" | "letters" | "gifts">(null);
  const [letter, setLetter] = useState("Aarohi, twelve days feels both forever and not nearly enough.");
  const [sent, setSent] = useState(false);
  const [gift, setGift] = useState("Rose");
  const [giftSent, setGiftSent] = useState(false);
  if (panel === "memories") {
    return (
      <Subpage title="Our Memories" onBack={() => setPanel(null)}>
        <div className="mem-grid">
          {[photos.beach, photos.sunset, photos.memory, photos.reel, photos.aarohi, photos.reel2].map((src) => (
            <img key={src} src={src} alt="" />
          ))}
        </div>
      </Subpage>
    );
  }
  if (panel === "count") {
    return (
      <Subpage title="Countdown" onBack={() => setPanel(null)}>
        <div className="count-hero">
          <b>12</b>
          <span>Days until your anniversary</span>
          <small>A letter, a gift, and one slow evening.</small>
        </div>
      </Subpage>
    );
  }
  if (panel === "letters") {
    return (
      <Subpage title="Love Letters" onBack={() => setPanel(null)}>
        <textarea className="letter" value={letter} onChange={(e) => setLetter(e.target.value)} />
        <button
          type="button"
          className="btn-pink"
          onClick={() => setSent(true)}
        >
          {sent ? "Letter sealed" : "Send letter"}
        </button>
      </Subpage>
    );
  }
  if (panel === "gifts") {
    return (
      <Subpage title="Virtual Gifts" onBack={() => setPanel(null)}>
        <div className="gift-grid">
          {["Rose", "Cocoa", "Teddy", "Ring", "Stars", "Song"].map((g) => (
            <button key={g} type="button" className={gift === g ? "on" : ""} onClick={() => setGift(g)}>
              <Icon name="gift" />
              {g}
            </button>
          ))}
        </div>
        <button type="button" className="btn-pink" onClick={() => setGiftSent(true)}>
          {giftSent ? `${gift} sent to Aarohi` : `Send ${gift}`}
        </button>
      </Subpage>
    );
  }
  return (
    <div className="page">
      <StatusBar />
      <Header back title="Love" heart />
      <div className="scroll pad love-list">
        <button type="button" className="love-card" onClick={() => setPanel("memories")}>
          <span className="love-ico hearts">
            <Icon name="heart" size={26} />
          </span>
          <span>
            <strong>Our Memories</strong>
            <small>Photos, videos, timeline</small>
          </span>
        </button>
        <button type="button" className="love-card" onClick={() => setPanel("count")}>
          <span className="love-ico cal">
            <b>12</b>
          </span>
          <span>
            <strong>Countdown</strong>
            <small>Anniversary: 12 Days</small>
          </span>
        </button>
        <button type="button" className="love-card" onClick={() => setPanel("letters")}>
          <span className="love-ico mail">
            <Icon name="mail" size={22} />
          </span>
          <span>
            <strong>Love Letters</strong>
            <small>Send a special letter</small>
          </span>
        </button>
        <button type="button" className="love-card" onClick={() => setPanel("gifts")}>
          <span className="love-ico gift">
            <Icon name="gift" size={22} />
          </span>
          <span>
            <strong>Virtual Gifts</strong>
            <small>Surprise your partner</small>
          </span>
        </button>
      </div>
    </div>
  );
}

function Subpage({ title, onBack, children }: { title: string; onBack: () => void; children: ReactNode }) {
  return (
    <div className="page">
      <StatusBar />
      <Header back={false} title={title} left={
        <IconButton label="Back" onClick={onBack}>
          <Icon name="back" />
        </IconButton>
      } />
      <div className="scroll pad">{children}</div>
    </div>
  );
}

const aiActions = [
  { id: "reply", title: "Suggest Reply", sub: "Get smart & romantic replies", icon: "chat", text: "Good morning, meri jaan. Have the loveliest day — I’m already thinking of you. 💕" },
  { id: "shayari", title: "Write Shayari", sub: "Love, romantic, birthday, etc.", icon: "spark", text: "Tere bina adhoora sa lagta hai safar,\nhar khushi mein teri hi kami si hai.\nJo pal tere saath bite hain, woh\nzindagi ke sabse khoobsurat lamhe hain." },
  { id: "translate", title: "Translate Message", sub: "Hindi to English & more", icon: "globe", text: "I miss you → मुझे तुम्हारी याद आती है" },
  { id: "improve", title: "Improve Text", sub: "Make your message better", icon: "check", text: "I had the sweetest morning because it started with you. Have a gentle, lovely day." },
];

export function AI() {
  const [log, setLog] = useState<{ role: "me" | "ai"; text: string }[]>([]);
  const [text, setText] = useState("");

  function ask(prompt: string, answer?: string) {
    const reply =
      answer ||
      (prompt.toLowerCase().includes("shayari")
        ? aiActions[1].text
        : `Here’s a warmer way to say it:\n“${prompt.trim()} — and I mean every word.”`);
    setLog((l) => [...l, { role: "me", text: prompt }, { role: "ai", text: reply }]);
  }

  return (
    <div className="page">
      <StatusBar />
      <Header
        back
        title={
          <span className="with-ico">
            AI Assistant <Icon name="spark" size={14} className="title-heart" />
          </span>
        }
      />
      <div className="scroll ai">
        <div className="bot">
          <span className="bot-face" aria-hidden>
            <i />
            <i />
          </span>
          <h2>Hi! I’m New AI</h2>
          <p>Your smart companion for chat, love & creativity.</p>
        </div>
        {log.map((m, i) => (
          <p key={i} className={`ai-msg ${m.role}`}>{m.text}</p>
        ))}
        <div className="ai-actions">
          {aiActions.map((a) => (
            <button key={a.id} type="button" onClick={() => ask(a.title, a.text)}>
              <span className="avatar icon-av mini">
                <Icon name={a.icon} size={16} />
              </span>
              <span>
                <strong>{a.title}</strong>
                <small>{a.sub}</small>
              </span>
              <Icon name="back" size={14} className="flip" />
            </button>
          ))}
        </div>
      </div>
      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          ask(text);
          setText("");
        }}
      >
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask New AI..." />
        <button className="mic" type="submit" aria-label="Send">
          <Icon name="send" size={16} />
        </button>
      </form>
    </div>
  );
}

export function Games() {
  const [game, setGame] = useState<string | null>(null);
  return (
    <div className="page">
      <StatusBar />
      <Header
        back
        title={
          <span className="with-ico">
            Games for Couples <Icon name="game" size={16} className="title-heart" />
          </span>
        }
      />
      <div className="scroll pad">
        {game ? (
          <GamePlay id={game} onExit={() => setGame(null)} />
        ) : (
          <div className="stack-list">
            {games.map((g) => (
              <button key={g.id} type="button" className="list-card" onClick={() => setGame(g.id)}>
                <span className="avatar icon-av" style={{ background: g.bg }}>
                  <Icon name={g.icon} size={20} />
                </span>
                <span className="list-copy">
                  <strong>
                    {g.title} {g.heart && "❤️"}
                  </strong>
                  <small>{g.sub}</small>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GamePlay({ id, onExit }: { id: string; onExit: () => void }) {
  const [picked, setPicked] = useState("");
  const [spin, setSpin] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const names = ["Aarohi", "You", "Pooja", "Neha"];
  const dare = useMemo(() => ["Tell your favorite memory of us.", "Send a voice note saying I love you.", "Plan a date for this weekend.", "Share a secret smile story."][spin % 4], [spin]);

  return (
    <div className="play">
      <button type="button" className="link" onClick={onExit}>← All games</button>
      {id === "quiz" && (
        <>
          <h3>How well do you know each other?</h3>
          <p>Aarohi’s favorite hour of the day is…</p>
          {["Sunrise", "Golden hour", "Midnight chai"].map((o) => (
            <button key={o} type="button" className={`choice ${picked === o ? "on" : ""}`} onClick={() => setPicked(o)}>
              {o}
            </button>
          ))}
          {picked && <p className="match">{picked === "Golden hour" ? "It’s a match. She lives for that light." : "Close — she picked golden hour."}</p>}
        </>
      )}
      {id === "challenge" && (
        <>
          <h3>Tonight’s challenge</h3>
          <p className="challenge">Cook one meal together and don’t check your phones until the plates are empty.</p>
          <button type="button" className={`btn-pink ${picked ? "done" : ""}`} onClick={() => setPicked("done")}>
            {picked ? "Challenge accepted" : "Accept challenge"}
          </button>
        </>
      )}
      {id === "tod" && (
        <>
          <h3>Truth or Dare ❤️</h3>
          <div className="tod">
            <button type="button" className={picked === "truth" ? "on" : ""} onClick={() => setPicked("truth")}>Truth</button>
            <button type="button" className={picked === "dare" ? "on" : ""} onClick={() => setPicked("dare")}>Dare</button>
          </div>
          {picked === "truth" && <p className="challenge">What is one small thing I do that makes you feel loved?</p>}
          {picked === "dare" && <p className="challenge">Leave a voice note describing our next trip in 10 seconds.</p>}
        </>
      )}
      {id === "puzzle" && (
        <>
          <h3>Love Puzzle</h3>
          <p>Tap the pieces in order: heart, sun, letter.</p>
          <div className="pieces">
            {["letter", "heart", "sun"].map((p) => (
              <button key={p} type="button" className={picked.includes(p) ? "on" : ""} onClick={() => setPicked((s) => s + p)}>
                {p}
              </button>
            ))}
          </div>
          {picked.includes("heart") && picked.includes("sun") && picked.includes("letter") && (
            <p className="match">{picked.startsWith("heart") ? "Solved together." : "Almost — heart comes first."}</p>
          )}
        </>
      )}
      {id === "spin" && (
        <>
          <h3>Spin the Bottle</h3>
          <div className={`bottle ${spinning ? "go" : ""}`} style={{ transform: `rotate(${spin}deg)` }}>
            <Icon name="bottle" size={42} />
          </div>
          <button
            type="button"
            className="btn-pink"
            onClick={() => {
              setSpinning(true);
              const next = spin + 360 * 3 + Math.floor(Math.random() * 360);
              setSpin(next);
              window.setTimeout(() => setSpinning(false), 900);
            }}
          >
            Spin
          </button>
          {!spinning && spin > 0 && <p className="match">Lands on {names[spin % names.length]}. {dare}</p>}
        </>
      )}
    </div>
  );
}

export function Location() {
  const [dur, setDur] = useState("1 hour");
  const [sharing, setSharing] = useState(false);
  return (
    <div className="page">
      <StatusBar />
      <Header back title="Live Location" />
      <div className="map">
        <svg className="route" viewBox="0 0 360 460" aria-hidden>
          <path d="M70 90 C 120 140, 150 180, 170 230 S 230 320, 280 390" />
        </svg>
        <div className="pin aarohi">
          <img src={photos.aarohi} alt="" />
          <span><b>Aarohi</b><small>2 min away</small></span>
        </div>
        <div className="pin you">
          <img src={photos.man} alt="" />
          <span><b>You</b><small>Current location</small></span>
        </div>
        <i className="park a" />
        <i className="park b" />
      </div>
      <div className="loc-panel">
        <div className="loc-title">
          <Icon name="pin" size={16} /> Share Live Location
          <Icon name="send" size={14} className="flip" />
        </div>
        <div className="durs">
          {["15 minutes", "1 hour", "8 hours"].map((d) => (
            <button key={d} type="button" className={dur === d ? "on" : ""} onClick={() => setDur(d)}>
              {d === "15 minutes" ? "15 minutes" : d}
            </button>
          ))}
        </div>
        <button type="button" className="btn-pink" onClick={() => setSharing((v) => !v)}>
          {sharing ? `Sharing · ${dur}` : "Start Sharing"}
        </button>
      </div>
    </div>
  );
}

const secretPoints = [
  { id: "e2e", label: "End-to-end encrypted" },
  { id: "disappear", label: "Disappearing messages" },
  { id: "lock", label: "Chat lock (PIN / Biometric)" },
  { id: "hide", label: "Hide from chat list" },
];

export function Secret() {
  const { openThread, notify } = useApp();
  const [flags, setFlags] = useState<Record<string, boolean>>({ e2e: true, disappear: true, lock: true, hide: true });
  return (
    <div className="page">
      <StatusBar />
      <Header
        back
        title={
          <span className="with-ico">
            Secret Chat <Icon name="lock" size={15} className="title-heart" />
          </span>
        }
      />
      <div className="scroll secret">
        <div className="lock-hero">
          <Icon name="lock" size={32} />
        </div>
        <h2>Private & Secure Chat</h2>
        <ul className="checks">
          {secretPoints.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className={flags[p.id] ? "on" : ""}
                onClick={() => setFlags((f) => ({ ...f, [p.id]: !f[p.id] }))}
              >
                <i>{flags[p.id] && <Icon name="check" size={12} />}</i>
                {p.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="dock">
        <button
          type="button"
          className="btn-pink"
          onClick={() => {
            notify(flags.hide ? "Hidden from your chat list" : "Secret chat ready");
            openThread("secret");
          }}
        >
          Start Secret Chat
        </button>
      </div>
    </div>
  );
}

export function Privacy() {
  const [on, setOn] = useState({
    lock: true,
    disappear: true,
    seen: true,
    profile: true,
    blocked: true,
    twofa: true,
  });
  const [blocked, setBlocked] = useState(false);
  const [list, setList] = useState(["Dev Sharma"]);
  const rows: { id: keyof typeof on; title: string; sub: string; icon: string }[] = [
    { id: "lock", title: "Chat Lock", sub: "PIN / Fingerprint / Face ID", icon: "lock" },
    { id: "disappear", title: "Disappearing Messages", sub: "Auto delete after time", icon: "clock" },
    { id: "seen", title: "Last Seen & Online", sub: "Who can see my status", icon: "eye" },
    { id: "profile", title: "Profile Privacy", sub: "Photo, About, Status", icon: "user" },
    { id: "blocked", title: "Blocked Users", sub: "Manage blocked contacts", icon: "close" },
    { id: "twofa", title: "Two-Factor Authentication", sub: "Add extra security", icon: "shield" },
  ];
  return (
    <div className="page">
      <StatusBar />
      <Header back title="Privacy & Security" />
      <div className="scroll pad">
        {rows.map((r) => (
          <div key={r.id} className="priv-row">
            <button type="button" className="priv-main" onClick={() => (r.id === "blocked" ? setBlocked(true) : setOn((s) => ({ ...s, [r.id]: !s[r.id] })))}>
              <span className="avatar icon-av mini">
                <Icon name={r.icon} size={16} />
              </span>
              <span>
                <strong>{r.title}</strong>
                <small>{r.sub}</small>
              </span>
            </button>
            <Switch on={on[r.id]} label={r.title} onClick={() => setOn((s) => ({ ...s, [r.id]: !s[r.id] }))} />
          </div>
        ))}
      </div>
      {blocked && (
        <Sheet title="Blocked users" onClose={() => setBlocked(false)}>
          {list.length === 0 && <p className="sheet-copy">No one is blocked.</p>}
          {list.map((name) => (
            <div key={name} className="person-row static">
              <span>{name}</span>
              <button type="button" className="link" onClick={() => setList((l) => l.filter((n) => n !== name))}>
                Unblock
              </button>
            </div>
          ))}
        </Sheet>
      )}
    </div>
  );
}

export function Premium() {
  const { premium, setPremium } = useApp();
  const [sheet, setSheet] = useState(false);
  return (
    <div className="page premium">
      <StatusBar />
      <Header back title="" />
      <div className="scroll premium-body">
        <div className="crown">
          <Icon name="crown" size={28} />
        </div>
        <h2>New Premium</h2>
        <p>Unlock Exclusive Features</p>
        <ul>
          {premiumFeatures.map((f) => (
            <li key={f}>
              <Icon name="check" size={14} /> {f}
            </li>
          ))}
        </ul>
      </div>
      <div className="dock">
        <button type="button" className="btn-pink premium-btn" onClick={() => setSheet(true)}>
          {premium ? "Premium active" : "Upgrade to Premium"}
          <small>₹99 / month</small>
        </button>
      </div>
      {sheet && (
        <Sheet title={premium ? "New Premium" : "Upgrade to Premium"} onClose={() => setSheet(false)}>
          <p className="sheet-copy">
            {premium
              ? "Your badge, themes, and unlimited New AI are on."
              : "Ad-free chats, exclusive gifts, 50 GB, and unlimited New AI for ₹99 / month."}
          </p>
          {premium ? (
            <button type="button" className="btn-purple" onClick={() => { setPremium(false); setSheet(false); }}>
              Cancel plan
            </button>
          ) : (
            <button type="button" className="btn-pink" onClick={() => { setPremium(true); setSheet(false); }}>
              Confirm upgrade · ₹99
            </button>
          )}
        </Sheet>
      )}
    </div>
  );
}

export function Themes() {
  const { theme, setTheme, wallpaper, setWallpaper } = useApp();
  const [custom, setCustom] = useState(false);
  return (
    <div className="page">
      <StatusBar />
      <Header back title="Themes" />
      <div className="scroll pad">
        <div className="theme-grid">
          {themes.map((t) => (
            <button key={t.id} type="button" className={`theme ${t.id} ${theme === t.id ? "on" : ""}`} onClick={() => setTheme(t.id as ThemeId)}>
              <span className={`swatch ${t.id}`} />
              <em>{t.name}</em>
            </button>
          ))}
        </div>
        <button type="button" className="btn-purple wide wall-btn" onClick={() => setCustom(true)}>
          <Icon name="palette" size={16} /> Custom Wallpaper
        </button>
        {wallpaper && <p className="sheet-copy center">Wallpaper: {wallpaper}</p>}
      </div>
      {custom && (
        <Sheet title="Custom Wallpaper" onClose={() => setCustom(false)}>
          <div className="wall-grid">
            {wallpapers.map((w) => (
              <button
                key={w.id}
                type="button"
                className={`wall ${w.id} ${wallpaper === w.id ? "on" : ""}`}
                onClick={() => {
                  setWallpaper(w.id);
                  setCustom(false);
                }}
              >
                {w.name}
              </button>
            ))}
            <button type="button" className="wall none" onClick={() => { setWallpaper(null); setCustom(false); }}>
              None
            </button>
          </div>
        </Sheet>
      )}
    </div>
  );
}

export function Profile() {
  const app = useApp();
  const [edit, setEdit] = useState(false);
  const [grid, setGrid] = useState(false);
  const [draft, setDraft] = useState(app.profile);
  const [photo, setPhoto] = useState(photos.aarohi);
  const pics = [photos.aarohi, photos.pooja, photos.neha, photos.ananya];
  return (
    <div className="page">
      <StatusBar />
      <Header back title="Profile" />
      <div className="scroll profile">
        <button type="button" className="profile-photo" onClick={() => setPhoto((p) => pics[(pics.indexOf(p) + 1) % pics.length])} aria-label="Change profile photo">
          <img src={photo} alt="Aarohi Sharma" />
          <span><Icon name="camera" size={14} /></span>
        </button>
        <h2>
          {app.profile.name} {app.premium && <Icon name="crown" size={16} className="title-heart" />} <Icon name="heart" size={14} className="title-heart" />
        </h2>
        <p className="handle">{app.profile.handle}</p>
        <p className="bio">{app.profile.bio}</p>
        <div className="stats">
          <div><b>124</b><span>Posts</span></div>
          <div><b>2.3K</b><span>Followers</span></div>
          <div><b>180</b><span>Following</span></div>
        </div>
        <div className="profile-actions">
          <button type="button" className="btn-purple grow" onClick={() => { setDraft(app.profile); setEdit(true); }}>
            Edit Profile
          </button>
          <IconButton label={grid ? "Hide posts" : "Show posts"} className="grid-btn" onClick={() => setGrid((v) => !v)}>
            <Icon name="grid" />
          </IconButton>
        </div>
        <div className="quick">
          <button type="button" onClick={() => app.go("themes")}>Themes</button>
          <button type="button" onClick={() => app.go("privacy")}>Privacy</button>
          <button type="button" onClick={() => app.go("premium")}>Premium</button>
        </div>
        {grid && (
          <div className="mem-grid">
            {[photos.beach, photos.sunset, photos.reel, photos.memory, photos.reel2, photos.smile].map((s) => (
              <img key={s} src={s} alt="" />
            ))}
          </div>
        )}
      </div>
      {edit && (
        <Sheet title="Edit Profile" onClose={() => setEdit(false)}>
          <label className="field">
            <Icon name="user" size={16} />
            <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </label>
          <label className="field">
            <Icon name="spark" size={16} />
            <input value={draft.handle} onChange={(e) => setDraft({ ...draft, handle: e.target.value })} />
          </label>
          <label className="field">
            <Icon name="heart" size={16} />
            <input value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} />
          </label>
          <button
            type="button"
            className="btn-pink"
            onClick={() => {
              app.setProfile(draft);
              setEdit(false);
              app.notify("Profile updated");
            }}
          >
            Save
          </button>
        </Sheet>
      )}
    </div>
  );
}

