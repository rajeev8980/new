import type { ReactNode } from "react";
import { discoverItems } from "./data";
import { Icon, Logo } from "./icons";
import { useApp, type Tab } from "./state";

export function StatusBar({ light = false }: { light?: boolean }) {
  return (
    <div className={`status ${light ? "light" : ""}`}>
      <span className="status-time">9:41</span>
      <span className="status-icons">
        <Icon name="signal" size={16} />
        <Icon name="wifi" size={16} />
        <Icon name="battery" size={20} />
      </span>
    </div>
  );
}

export function IconButton({
  label,
  onClick,
  children,
  className = "",
}: {
  label: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button type="button" className={`icon-btn ${className}`} aria-label={label} onClick={onClick}>
      {children}
    </button>
  );
}

export function Header({
  title,
  heart,
  back,
  right,
  left,
  subtitle,
}: {
  title: ReactNode;
  heart?: boolean;
  back?: boolean;
  right?: ReactNode;
  left?: ReactNode;
  subtitle?: string;
}) {
  const { back: goBack } = useApp();
  return (
    <header className="header">
      <div className="header-side">
        {left}
        {back && (
          <IconButton label="Back" onClick={goBack}>
            <Icon name="back" />
          </IconButton>
        )}
      </div>
      <div className="header-title">
        <div className="header-name">
          {title}
          {heart && <Icon name="heart" size={14} className="title-heart" />}
        </div>
        {subtitle && <div className="header-sub">{subtitle}</div>}
      </div>
      <div className="header-side right">{right}</div>
    </header>
  );
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "chats", label: "Chats", icon: "chat" },
  { id: "reels", label: "Reels", icon: "reels" },
];

export function TabBar() {
  const { tab, setTab, go } = useApp();
  return (
    <nav className="tabbar" aria-label="Primary">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`tab ${tab === t.id ? "on" : ""}`}
          onClick={() => setTab(t.id)}
        >
          <Icon name={t.icon} size={22} />
          <span>{t.label}</span>
        </button>
      ))}
      <button type="button" className="tab heart-tab" aria-label="Love" onClick={() => go("love")}>
        <span className="heart-fab">
          <Icon name="heart" size={28} />
        </span>
      </button>
      <button
        type="button"
        className={`tab ${tab === "discover" ? "on" : ""}`}
        onClick={() => setTab("discover")}
      >
        <Icon name="search" size={22} />
        <span>Discover</span>
      </button>
      <button
        type="button"
        className={`tab ${tab === "profile" ? "on" : ""}`}
        onClick={() => setTab("profile")}
      >
        <Icon name="user" size={22} />
        <span>Profile</span>
      </button>
    </nav>
  );
}

export function Drawer() {
  const { drawer, setDrawer, go, setTab } = useApp();
  if (!drawer) return null;
  return (
    <div className="overlay" onClick={() => setDrawer(false)}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <Logo size={36} />
          <div>
            <strong>New</strong>
            <em>Chat · Love · Share</em>
          </div>
          <IconButton label="Close menu" onClick={() => setDrawer(false)}>
            <Icon name="close" />
          </IconButton>
        </div>
        <div className="drawer-list">
          {discoverItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="drawer-item"
              onClick={() => {
                if (item.screen === "chats" || item.screen === "reels") setTab(item.screen);
                else go(item.screen);
              }}
            >
              <span className="ico" style={{ background: item.bg }}>
                <Icon name={item.icon} size={18} />
              </span>
              <span>
                <strong>{item.title}</strong>
                <small>{item.sub}</small>
              </span>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}

export function Sheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="overlay sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={title}>
        <div className="sheet-grab" />
        <div className="sheet-head">
          <h3>{title}</h3>
          <IconButton label="Close" onClick={onClose}>
            <Icon name="close" size={18} />
          </IconButton>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return <div className="toast">{toast}</div>;
}

export function Switch({
  on,
  label,
  onClick,
}: {
  on: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`switch ${on ? "on" : ""}`}
      aria-label={label}
      aria-pressed={on}
      onClick={onClick}
    >
      <i />
    </button>
  );
}

export function Wordmark({ large = false }: { large?: boolean }) {
  return (
    <div className={`wordmark ${large ? "large" : ""}`}>
      <span>New</span>
      <Logo size={large ? 22 : 16} />
    </div>
  );
}
