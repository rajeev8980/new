import { useState } from "react";
import { api } from "../api";
import { Sheet } from "../components";
import { communities as seedCommunities, groups, photos } from "../data";
import { Icon } from "../icons";
import { useApp } from "../state";

export function GroupList({
  query = "",
  layout = "list",
}: {
  query?: string;
  layout?: "list" | "grid";
}) {
  const { openThread } = useApp();
  const items = groups.filter((g) => !query || g.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className={layout === "grid" ? "group-grid" : "stack-list"}>
      {items.map((g) => (
        <button
          key={g.id}
          type="button"
          className="list-card"
          onClick={() => {
            if (g.id === "g1") openThread("ourlove");
            else if (g.id === "g2" || g.id === "g3") openThread("study");
            else openThread("friends");
          }}
        >
          {g.kind === "couple" ? (
            <span className="avatar couple-av">
              <img src={photos.aarohi} alt="" />
              <img src={photos.man} alt="" />
            </span>
          ) : (
            <span className="avatar icon-av" style={{ background: g.bg }}>
              <Icon name={g.icon || "users"} size={20} />
            </span>
          )}
          <span className="list-copy">
            <strong>
              {g.name} {g.heart && <Icon name="heart" size={12} className="title-heart" />}
            </strong>
            <small>
              {g.members}
              {g.meta ? ` · ${g.meta}` : ""}
            </small>
          </span>
        </button>
      ))}
      {items.length === 0 && <p className="empty">No groups match.</p>}
    </div>
  );
}

export function CommunityList({
  query = "",
  created = [],
}: {
  query?: string;
  created?: { id: string; name: string; sub: string; count: string }[];
}) {
  const { notify, token } = useApp();
  const [joined, setJoined] = useState<string[]>([]);
  const items = [
    ...created.map((c) => ({ ...c, icon: "users", bg: "linear-gradient(145deg,#ff7ab8,#ff2d8a)" })),
    ...seedCommunities,
  ].filter((c) => !query || c.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="stack-list">
      {items.map((c) => (
        <button
          key={c.id}
          type="button"
          className={`list-card ${joined.includes(c.id) ? "joined" : ""}`}
          onClick={() => {
            setJoined((list) => (list.includes(c.id) ? list : [...list, c.id]));
            if (token) api.joinCommunity(token, c.id).catch(() => {});
            notify(joined.includes(c.id) ? `You're in ${c.name}` : `Joined ${c.name}`);
          }}
        >
          <span className="avatar icon-av" style={{ background: c.bg }}>
            <Icon name={c.icon} size={20} />
          </span>
          <span className="list-copy">
            <strong>{c.name}</strong>
            <small>{joined.includes(c.id) ? "Joined · " : ""}{c.sub}</small>
          </span>
          <span className="count">
            <b>{c.count}</b>
            <small>members</small>
          </span>
        </button>
      ))}
    </div>
  );
}

export function CreateCommunity({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string, topic: string) => void;
}) {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("Love, Dating, Advice");
  return (
    <Sheet title="Create Community" onClose={onClose}>
      <label className="field">
        <Icon name="users" size={18} />
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Community name" />
      </label>
      <label className="field">
        <Icon name="spark" size={18} />
        <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="What is it about?" />
      </label>
      <button
        type="button"
        className="btn-pink"
        onClick={() => {
          if (!name.trim()) return;
          onCreate(name.trim(), topic.trim() || "New community");
        }}
      >
        Create community
      </button>
    </Sheet>
  );
}
