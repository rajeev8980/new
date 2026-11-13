import { useEffect, useMemo, useState } from "react";
import { Header, IconButton, Sheet, StatusBar } from "../components";
import {
  chatRows,
  communities,
  groups,
  photos,
  stories,
  type ThreadId,
} from "../data";
import { Icon } from "../icons";
import { useApp } from "../state";
import { CommunityList, GroupList } from "./lists";

export function Chats() {
  const { chatTab, setChatTab, openThread, openStory, setDrawer, notify, chats } = useApp();
  const [q, setQ] = useState("");
  const [searching, setSearching] = useState(false);
  const [compose, setCompose] = useState(false);
  const [addStory, setAddStory] = useState(false);

  const rows = chats.filter(
    (r) =>
      !q ||
      r.name.toLowerCase().includes(q.toLowerCase()) ||
      r.preview.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="page">
      <StatusBar />
      <header className="header home-header">
        <IconButton label="Menu" onClick={() => setDrawer(true)}>
          <Icon name="menu" />
        </IconButton>
        <div className="wordmark home-mark">
          <span>New</span>
          <Icon name="heart" size={16} className="title-heart" />
        </div>
        <div className="header-side right">
          <IconButton label="Search" onClick={() => setSearching((v) => !v)}>
            <Icon name="search" />
          </IconButton>
          <IconButton label="New chat" onClick={() => setCompose(true)}>
            <Icon name="plus" />
          </IconButton>
        </div>
      </header>
      {searching && (
        <label className="field search-field">
          <Icon name="search" size={16} />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search chats, groups, people"
          />
        </label>
      )}
      <div className="seg" role="tablist">
        {(["chats", "groups", "communities"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={chatTab === t}
            className={chatTab === t ? "on" : ""}
            onClick={() => setChatTab(t)}
          >
            {t === "chats" ? "Chats" : t === "groups" ? "Groups" : "Communities"}
          </button>
        ))}
      </div>
      <div className="scroll">
        {chatTab === "chats" && (
          <>
            <div className="stories">
              <button type="button" className="story add" onClick={() => setAddStory(true)}>
                <span className="avatar plus">
                  <Icon name="plus" />
                </span>
                <em>Add Story</em>
              </button>
              {stories
                .filter((s) => !q || s.name.toLowerCase().includes(q.toLowerCase()))
                .map((s) => (
                  <button key={s.id} type="button" className="story" onClick={() => openStory(s.id)}>
                    <span className={`avatar ring ${s.online ? "online" : ""}`}>
                      <img src={s.photo} alt="" />
                    </span>
                    <em>{s.name}</em>
                  </button>
                ))}
            </div>
            <div className="chat-list">
              {rows.map((r) => (
                <button key={r.id} type="button" className="chat-row" onClick={() => openThread(r.id)}>
                  <AvatarRow row={r} />
                  <span className="chat-copy">
                    <strong>
                      {r.name} {r.heart && <Icon name="heart" size={12} className="title-heart" />} {r.emoji}
                    </strong>
                    <small className={r.typing || r.previewPink ? "pink" : ""}>{r.preview}</small>
                  </span>
                  <span className="chat-meta">
                    <time>{r.time}</time>
                    {r.badge ? <b>{r.badge}</b> : <b className="ghost-badge" />}
                  </span>
                </button>
              ))}
              {rows.length === 0 && <p className="empty">No chats match “{q}”.</p>}
            </div>
          </>
        )}
        {chatTab === "groups" && <GroupList query={q} />}
        {chatTab === "communities" && <CommunityList query={q} />}
      </div>
      {compose && (
        <Sheet title="New chat" onClose={() => setCompose(false)}>
          {stories.map((s) => (
            <button
              key={s.id}
              type="button"
              className="person-row"
              onClick={() => {
                setCompose(false);
                openThread(s.id === "aarohi" ? "aarohi" : "friends");
              }}
            >
              <img src={s.photo} alt="" />
              <span>{s.name}</span>
            </button>
          ))}
        </Sheet>
      )}
      {addStory && (
        <Sheet title="Add Story" onClose={() => setAddStory(false)}>
          <p className="sheet-copy">Share a moment with the people you love.</p>
          <div className="photo-pick">
            {[photos.sunset, photos.beach, photos.memory, photos.reel].map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => {
                  setAddStory(false);
                  notify("Story shared");
                }}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </Sheet>
      )}
    </div>
  );
}

function AvatarRow({ row }: { row: (typeof chatRows)[number] }) {
  if (row.couple) {
    return (
      <span className="avatar couple-av">
        <img src={photos.aarohi} alt="" />
        <img src={photos.man} alt="" />
      </span>
    );
  }
  if (row.icon) {
    return (
      <span className="avatar icon-av" style={{ background: row.iconBg }}>
        <Icon name={row.icon} size={22} />
      </span>
    );
  }
  return (
    <span className="avatar">
      <img src={row.photo} alt="" />
    </span>
  );
}

const titles: Record<ThreadId, { name: string; sub: string; photo?: string; heart?: boolean; online?: boolean }> = {
  aarohi: { name: "Aarohi", sub: "Online", photo: photos.aarohi, heart: true, online: true },
  ourlove: { name: "Our Love", sub: "Aarohi, You", heart: true },
  study: { name: "Study Group", sub: "12 members" },
  friends: { name: "Friends Forever", sub: "Ananya, Pooja, Neha", photo: photos.ananya },
  secret: { name: "Secret Chat", sub: "Disappearing", heart: false },
};

export function Thread() {
  const { threadId, messages, send, back, go, notify } = useApp();
  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState(false);
  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const info = titles[threadId];
  const list = messages[threadId];

  function submit() {
    const value = text.trim();
    if (!value) return;
    send(threadId, value);
    setText("");
  }

  return (
    <div className="page thread">
      <StatusBar />
      <header className="header thread-head">
        <IconButton label="Back" onClick={back}>
          <Icon name="back" />
        </IconButton>
        <button type="button" className="who" onClick={() => go("profile")}>
          {info.photo ? (
            <span className={`avatar sm ${info.online ? "online" : ""}`}>
              <img src={info.photo} alt="" />
            </span>
          ) : (
            <span className="avatar sm icon-av">
              <Icon name="heart" size={16} />
            </span>
          )}
          <span>
            <strong>
              {info.name} {info.heart && <Icon name="heart" size={12} className="title-heart" />}
            </strong>
            <small className={info.online ? "online-text" : ""}>
              {info.online && <i className="dot" />} {info.sub}
            </small>
          </span>
        </button>
        <div className="header-side right">
          <IconButton label="Voice call" onClick={() => go("call")}>
            <Icon name="phone" />
          </IconButton>
          <IconButton label="Video call" onClick={() => go("call")}>
            <Icon name="video" />
          </IconButton>
          <IconButton label="More" onClick={() => setMenu(true)}>
            <Icon name="dots" />
          </IconButton>
        </div>
      </header>
      <div className="scroll messages">
        {threadId === "secret" && (
          <p className="secret-banner">
            <Icon name="lock" size={14} /> Disappearing messages are on
          </p>
        )}
        <span className="float-heart a" aria-hidden>
          <Icon name="heart" />
        </span>
        <span className="float-heart b" aria-hidden>
          <Icon name="heart" />
        </span>
        {list.map((m) => (
          <div key={m.id} className={`bubble-wrap ${m.from}`}>
            {m.kind === "text" && <p className="bubble">{m.text}</p>}
            {m.kind === "photo" && (
              <figure className="photo-bubble">
                <img src={m.photo} alt="Sunset beach with a heart in the sand" />
                <HeartInSand />
              </figure>
            )}
            {m.kind === "voice" && (
              <button
                type="button"
                className={`voice ${playing === m.id ? "playing" : ""}`}
                onClick={() => setPlaying((p) => (p === m.id ? null : m.id))}
              >
                <span className="play">
                  <Icon name={playing === m.id ? "pause" : "play"} size={14} />
                </span>
                <span className="wave">
                  {Array.from({ length: 22 }).map((_, i) => (
                    <i key={i} style={{ height: 6 + ((i * 17) % 16) }} />
                  ))}
                </span>
                <em>{m.duration}</em>
              </button>
            )}
            <time>
              {m.time}
              {m.read && m.from === "me" && <Icon name="check" size={12} />}
            </time>
          </div>
        ))}
        {recording && <p className="rec-pill">Recording… tap mic to send</p>}
      </div>
      {emoji && (
        <div className="emoji-bar">
          {["💛", "🌸", "💕", "😊", "❤️", "✨", "🌙", "😘"].map((e) => (
            <button key={e} type="button" onClick={() => setText((t) => t + e)}>
              {e}
            </button>
          ))}
        </div>
      )}
      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <button type="button" aria-label="Emoji" onClick={() => setEmoji((v) => !v)}>
          <Icon name="emoji" size={20} />
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message..."
        />
        <button
          type="button"
          aria-label="Attach photo"
          onClick={() => {
            send(threadId, "", "photo", { photo: photos.beach });
            notify("Photo sent");
          }}
        >
          <Icon name="paperclip" size={18} />
        </button>
        <button
          type="button"
          aria-label="Camera"
          onClick={() => {
            send(threadId, "", "photo", { photo: photos.sunset });
            notify("Photo sent");
          }}
        >
          <Icon name="camera" size={18} />
        </button>
        <button
          type="button"
          className={`mic ${recording ? "hot" : ""}`}
          aria-label={recording ? "Send voice note" : "Record voice note"}
          onClick={() => {
            if (recording) {
              send(threadId, "", "voice", { duration: "0:04" });
              setRecording(false);
            } else setRecording(true);
          }}
        >
          <Icon name="mic" size={18} />
        </button>
      </form>
      {menu && (
        <Sheet title={info.name} onClose={() => setMenu(false)}>
          <button type="button" className="person-row" onClick={() => { setMenu(false); go("call"); }}>
            <Icon name="video" /> Video call
          </button>
          <button type="button" className="person-row" onClick={() => { setMenu(false); go("secret"); }}>
            <Icon name="lock" /> Start secret chat
          </button>
          <button type="button" className="person-row" onClick={() => { setMenu(false); go("profile"); }}>
            <Icon name="user" /> View profile
          </button>
        </Sheet>
      )}
    </div>
  );
}

function HeartInSand() {
  return (
    <svg className="sand-heart" viewBox="0 0 120 70" aria-hidden>
      <path
        d="M60 58C40 44 18 36 18 22 18 14 26 10 34 14c6 3 10 10 14 16 2-8 8-16 18-16 10 0 16 8 14 16-2 14-20 28-20 28z"
        fill="none"
        stroke="#6a3a22"
        strokeWidth="3.2"
      />
    </svg>
  );
}

export function Call() {
  const { back } = useApp();
  const [secs, setSecs] = useState(4 * 60 + 26);
  const [muted, setMuted] = useState(false);
  const [video, setVideo] = useState(true);
  const [speaker, setSpeaker] = useState(true);

  useEffect(() => {
    const t = window.setInterval(() => setSecs((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, []);

  const label = useMemo(() => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [secs]);

  return (
    <div className="bleed call">
      <img className="bleed-img" src={photos.aarohi} alt="Aarohi on a video call" />
      <div className="call-shade" />
      <StatusBar light />
      <div className={`pip ${video ? "" : "off"}`}>
        {video ? <img src={photos.man} alt="You" /> : <Icon name="videoOff" />}
      </div>
      <div className="call-id">
        <h2>
          Aarohi <Icon name="heart" size={16} className="title-heart" />
        </h2>
        <p>Video Call · {label}</p>
      </div>
      <div className="call-controls">
        <button type="button" className={video ? "" : "off"} aria-label="Toggle video" aria-pressed={video} onClick={() => setVideo((v) => !v)}>
          <Icon name={video ? "video" : "videoOff"} />
        </button>
        <button type="button" className={muted ? "off" : ""} aria-label="Toggle mute" aria-pressed={!muted} onClick={() => setMuted((v) => !v)}>
          <Icon name={muted ? "micOff" : "mic"} />
        </button>
        <button type="button" className={speaker ? "" : "off"} aria-label="Toggle speaker" aria-pressed={speaker} onClick={() => setSpeaker((v) => !v)}>
          <Icon name="speaker" />
        </button>
        <button type="button" className="end" aria-label="End call" onClick={back}>
          <Icon name="phone" className="hangup" />
        </button>
      </div>
    </div>
  );
}

export function StoryView() {
  const { storyId, back, openStory } = useApp();
  const index = Math.max(0, stories.findIndex((s) => s.id === storyId));
  const story = stories[index] ?? stories[0];
  return (
    <div className="bleed story-view">
      <img className="bleed-img" src={story.image} alt="" />
      <div className="call-shade" />
      <StatusBar light />
      <div className="story-top">
        <div className="bars">
          {stories.map((s, i) => (
            <i key={s.id} className={i <= index ? "on" : ""} />
          ))}
        </div>
        <div className="story-user">
          <img src={story.photo} alt="" />
          <div>
            <strong>{story.name}</strong>
            <small>{story.caption}</small>
          </div>
          <IconButton label="Close story" onClick={back}>
            <Icon name="close" />
          </IconButton>
        </div>
      </div>
      <div className="story-hit">
        <button type="button" aria-label="Previous story" onClick={() => openStory(stories[Math.max(0, index - 1)].id)} />
        <button type="button" aria-label="Next story" onClick={() => index === stories.length - 1 ? back() : openStory(stories[index + 1].id)} />
      </div>
    </div>
  );
}
