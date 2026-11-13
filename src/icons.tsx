import { useId } from "react";

type Props = { size?: number; className?: string };

export function Logo({ size = 64, className }: Props) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <defs>
        <linearGradient id={id} x1="8" y1="6" x2="56" y2="58">
          <stop offset="0%" stopColor="#ffd0ee" />
          <stop offset="32%" stopColor="#ff4fa3" />
          <stop offset="70%" stopColor="#ff2d8a" />
          <stop offset="100%" stopColor="#c026ff" />
        </linearGradient>
        <linearGradient id={`${id}s`} x1="20" y1="10" x2="40" y2="36">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="M32 56C32 56 8 40 8 24 8 15 15 8 24 8c5 0 8.2 2.2 8 6.4C32.2 10.2 35 8 40 8c9 0 16 7 16 16C56 40 32 56 32 56z"
      />
      <path
        fill={`url(#${id}s)`}
        d="M22 11c6 1 9 6 10 11-4-6-8-8-10-11z"
        opacity="0.85"
      />
      <path
        fill="#fff"
        d="M32 44.5c-6.2-5.2-13-10.6-13-17.6 0-3.6 2.7-6.4 6.2-6.4 2.2 0 3.7 1.2 4.8 3 .3.5.8.8 1.3.8s1-.3 1.3-.8c1.1-1.8 2.6-3 4.8-3 3.5 0 6.2 2.8 6.2 6.4 0 7-6.8 12.4-13 17.6z"
        opacity="0.92"
      />
    </svg>
  );
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function Icon({
  name,
  size = 22,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const body = paths[name] ?? paths.heart;
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      {body}
    </svg>
  );
}

const paths: Record<string, JSX.Element> = {
  menu: (
    <g {...stroke}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </g>
  ),
  back: (
    <g {...stroke}>
      <path d="M15 5L8 12l7 7" />
    </g>
  ),
  search: (
    <g {...stroke}>
      <circle cx="11" cy="11" r="6.2" />
      <path d="M16 16.5L20 20.5" />
    </g>
  ),
  plus: (
    <g {...stroke}>
      <path d="M12 5v14M5 12h14" />
    </g>
  ),
  close: (
    <g {...stroke}>
      <path d="M6 6l12 12M18 6L6 18" />
    </g>
  ),
  heart: (
    <path
      fill="currentColor"
      d="M12 20s-7-4.4-7-9.1C5 8 7 6 9.2 6c1.3 0 2.3.6 2.8 1.6C12.5 6.6 13.5 6 14.8 6 17 6 19 8 19 10.9 19 15.6 12 20 12 20z"
    />
  ),
  heartLine: (
    <g {...stroke}>
      <path d="M12 19s-6.2-3.8-6.2-8C5.8 8.4 7.6 6.7 9.6 6.7c1.2 0 2.1.6 2.4 1.5.3-.9 1.2-1.5 2.4-1.5 2 0 3.8 1.7 3.8 4.3C18.2 15.2 12 19 12 19z" />
    </g>
  ),
  chat: (
    <g {...stroke}>
      <path d="M6 16.5l-1.6 3.2a.6.6 0 0 0 .8.8L8.6 19A8 8 0 1 0 6 16.5z" />
    </g>
  ),
  reels: (
    <g {...stroke}>
      <rect x="4" y="5" width="16" height="14" rx="3" />
      <path d="M11 9.2l4 2.8-4 2.8V9.2z" fill="currentColor" stroke="none" />
    </g>
  ),
  user: (
    <g {...stroke}>
      <circle cx="12" cy="8.2" r="3.1" />
      <path d="M5.5 19.2c1.2-3 3.4-4.4 6.5-4.4s5.3 1.4 6.5 4.4" />
    </g>
  ),
  phone: (
    <g {...stroke}>
      <path d="M8 4.8h2.2l1.2 3-1.6 1a12 12 0 0 0 5.4 5.4l1-1.6 3 1.2V16a1.6 1.6 0 0 1-1.7 1.6A13.2 13.2 0 0 1 6.4 6.5 1.6 1.6 0 0 1 8 4.8z" />
    </g>
  ),
  video: (
    <g {...stroke}>
      <rect x="3.5" y="7" width="11" height="10" rx="2" />
      <path d="M14.5 10.5L20 8v8l-5.5-2.5v-3z" />
    </g>
  ),
  videoOff: (
    <g {...stroke}>
      <path d="M4 8h7.5a2 2 0 0 1 2 2v5" />
      <path d="M3.5 16.5V9.2" />
      <path d="M14.5 11l5.5-2.5v7" />
      <path d="M4 20L20 4" />
    </g>
  ),
  mic: (
    <g {...stroke}>
      <rect x="9" y="3.5" width="6" height="10" rx="3" />
      <path d="M7 11a5 5 0 0 0 10 0M12 16v4M9 20h6" />
    </g>
  ),
  micOff: (
    <g {...stroke}>
      <path d="M9 10V6.5a3 3 0 0 1 5.2-2" />
      <path d="M15 11.2V11a3 3 0 0 1-.4 1.5" />
      <path d="M7.5 11a4.5 4.5 0 0 0 7.2 3.6M12 16v4" />
      <path d="M4 20L19 5" />
    </g>
  ),
  speaker: (
    <g {...stroke}>
      <path d="M4 10h3.2L12 6.5v11L7.2 14H4v-4z" />
      <path d="M15.5 9.2a3.5 3.5 0 0 1 0 5.6M17.6 7a6 6 0 0 1 0 10" />
    </g>
  ),
  dots: (
    <g fill="currentColor">
      <circle cx="6" cy="12" r="1.3" />
      <circle cx="12" cy="12" r="1.3" />
      <circle cx="18" cy="12" r="1.3" />
    </g>
  ),
  emoji: (
    <g {...stroke}>
      <circle cx="12" cy="12" r="8" />
      <path d="M8.5 13.5c.8 1.8 2 2.6 3.5 2.6s2.7-.8 3.5-2.6" />
      <path d="M9 10h.01M15 10h.01" strokeWidth="2.4" />
    </g>
  ),
  paperclip: (
    <g {...stroke}>
      <path d="M8 12.5l6.2-6.2a3 3 0 0 1 4.2 4.2l-7.4 7.4a4.2 4.2 0 0 1-6-6L12 5" />
    </g>
  ),
  camera: (
    <g {...stroke}>
      <path d="M4 9.5h2.2l1.3-2h7l1.3 2H20v9.2a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.7V9.5z" />
      <circle cx="12" cy="14" r="2.6" />
    </g>
  ),
  send: (
    <g {...stroke}>
      <path d="M4 12l16-7-6 16-2.2-6.2L4 12z" />
    </g>
  ),
  eye: (
    <g {...stroke}>
      <path d="M2.8 12S6.2 6.8 12 6.8 21.2 12 21.2 12 17.8 17.2 12 17.2 2.8 12 2.8 12z" />
      <circle cx="12" cy="12" r="2.4" />
    </g>
  ),
  eyeOff: (
    <g {...stroke}>
      <path d="M4 5l16 14" />
      <path d="M9.2 6.6A9 9 0 0 1 12 6.2c5.8 0 9.2 5.2 9.2 5.2a16 16 0 0 1-3.2 3.6M6.2 8.4C4.2 9.8 2.8 12 2.8 12S6.2 17.2 12 17.2c1.1 0 2.1-.2 3-.5" />
    </g>
  ),
  check: (
    <g {...stroke}>
      <path d="M5 12.5l4.2 4.2L19 7.5" />
    </g>
  ),
  lock: (
    <g {...stroke}>
      <rect x="5.5" y="10.5" width="13" height="9" rx="2" />
      <path d="M8.2 10.5V8.2a3.8 3.8 0 0 1 7.6 0v2.3" />
    </g>
  ),
  shield: (
    <g {...stroke}>
      <path d="M12 3.5l7 2.6v6.2c0 4.2-2.8 6.8-7 8.2-4.2-1.4-7-4-7-8.2V6.1l7-2.6z" />
      <path d="M9 12.1l2 2 4-4.2" />
    </g>
  ),
  crown: (
    <g {...stroke}>
      <path d="M4 16.5l2-8 4 4 2-6 2 6 4-4 2 8H4z" />
      <path d="M5 18.5h14" />
    </g>
  ),
  pin: (
    <g {...stroke}>
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z" />
      <circle cx="12" cy="11" r="2" />
    </g>
  ),
  users: (
    <g fill="currentColor">
      <circle cx="9" cy="8.2" r="2.5" />
      <circle cx="15.6" cy="8.8" r="2.1" />
      <path d="M4.2 18.2c.7-3 2.6-4.4 4.8-4.4s4 1.4 4.6 4.1c.5-1.8 2-3.2 3.8-3.2 1.8 0 3.2 1 3.8 2.6.2.6-.2 1.1-.8 1.1H5c-.6 0-1-.5-.8-1.1z" />
    </g>
  ),
  spark: (
    <g {...stroke}>
      <path d="M12 3l1.4 5.2L18 9.6l-4.6 1.4L12 16l-1.4-5L6 9.6l4.6-1.4L12 3z" />
      <path d="M18 14l.6 2 2 .6-2 .6-.6 2-.6-2-2-.6 2-.6.6-2z" />
    </g>
  ),
  game: (
    <g {...stroke}>
      <rect x="3.5" y="8" width="17" height="9" rx="4" />
      <path d="M8 12.5h3M9.5 11v3M15.5 11.5h.01M17.2 13.6h.01" strokeWidth="2.2" />
    </g>
  ),
  grid: (
    <g {...stroke}>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.4" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.4" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.4" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.4" />
    </g>
  ),
  calendar: (
    <g {...stroke}>
      <rect x="4" y="5.5" width="16" height="14" rx="2" />
      <path d="M8 3.8v3M16 3.8v3M4 9.5h16" />
    </g>
  ),
  mail: (
    <g {...stroke}>
      <rect x="3.5" y="6" width="17" height="12" rx="2" />
      <path d="M4 7.5l8 6 8-6" />
    </g>
  ),
  gift: (
    <g {...stroke}>
      <rect x="4" y="11" width="16" height="8.5" rx="1.5" />
      <path d="M12 11v8.5M4 14.2h16" />
      <path d="M12 11c-2-3.2-6-2.2-5 .2 1.2.6 3.2.2 5-.2zM12 11c2-3.2 6-2.2 5 .2-1.2.6-3.2.2-5-.2z" />
    </g>
  ),
  image: (
    <g {...stroke}>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.3" />
      <path d="M4 16l4.2-3.4 3 2.4L15 11l5 5" />
    </g>
  ),
  clock: (
    <g {...stroke}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.2l2.8 1.8" />
    </g>
  ),
  bell: (
    <g {...stroke}>
      <path d="M6 16h12l-1.2-2V10a4.8 4.8 0 0 0-9.6 0v4L6 16z" />
      <path d="M10 16.5a2 2 0 0 0 4 0" />
    </g>
  ),
  share: (
    <g {...stroke}>
      <circle cx="6.5" cy="12" r="2" />
      <circle cx="17" cy="6.5" r="2" />
      <circle cx="17" cy="17.5" r="2" />
      <path d="M8.3 11.1l6.6-3.6M8.3 12.9l6.6 3.6" />
    </g>
  ),
  comment: (
    <g {...stroke}>
      <path d="M6 16.2l-1.4 3 3.2-1.4A8 8 0 1 0 6 16.2z" />
    </g>
  ),
  globe: (
    <g {...stroke}>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16M12 4c2.4 2.4 3.6 5 3.6 8s-1.2 5.6-3.6 8c-2.4-2.4-3.6-5-3.6-8S9.6 6.4 12 4z" />
    </g>
  ),
  cap: (
    <g {...stroke}>
      <path d="M3 10l9-4 9 4-9 4-9-4z" />
      <path d="M7 12v3.2c1.6 1.4 3.2 2 5 2s3.4-.6 5-2V12" />
    </g>
  ),
  code: (
    <g {...stroke}>
      <path d="M9 8L5 12l4 4M15 8l4 4-4 4" />
    </g>
  ),
  book: (
    <g {...stroke}>
      <path d="M5 5.5h6.2A2.8 2.8 0 0 1 14 8.2V19a2.4 2.4 0 0 0-2.4-1.6H5V5.5zM19 5.5h-6.2A2.8 2.8 0 0 0 10 8.2V19c.7-.5 1.6-.8 2.6-.8H19V5.5z" />
    </g>
  ),
  plane: (
    <g {...stroke}>
      <path d="M3 12l18-7-5 15-4-5-5-1 4-2" />
    </g>
  ),
  dumbbell: (
    <g {...stroke}>
      <path d="M6 9v6M18 9v6M8 8v8M16 8v8M8 12h8M4 10v4M20 10v4" />
    </g>
  ),
  clapper: (
    <g {...stroke}>
      <rect x="4" y="8" width="16" height="11" rx="2" />
      <path d="M4 8l3-3h4l-2 3M9 8l3-3h4l-2 3" />
    </g>
  ),
  quiz: (
    <g {...stroke}>
      <path d="M12 19s-6-3.6-6-8.1C6 8 8 6.2 10 6.2c1.1 0 2 .5 2.4 1.4.4-.9 1.3-1.4 2.4-1.4 2 0 4 1.8 4 4.7C18.8 15.4 12 19 12 19z" />
      <path d="M12 10.2v.2M12 12.4v2" />
    </g>
  ),
  hearts: (
    <g fill="currentColor">
      <path d="M8.2 15.6S4 12.6 4 9.8C4 8.1 5.3 6.8 6.8 6.8c.8 0 1.5.4 1.8 1 .3-.6 1-1 1.8-1C12 6.8 13.2 8.1 13.2 9.8c0 2.8-4.2 5.8-5 5.8z" opacity=".95" />
      <path d="M15.2 17.2s-3.2-2.3-3.2-4.4c0-1.3 1-2.3 2.1-2.3.6 0 1.1.3 1.4.8.3-.5.8-.8 1.4-.8 1.1 0 2.1 1 2.1 2.3 0 2.1-3.2 4.4-3.8 4.4z" />
    </g>
  ),
  lips: (
    <g {...stroke}>
      <path d="M4 12s2.2-3 4.2-3C10 9 11 10.2 12 11c1-.8 2-2 3.8-2 2 0 4.2 3 4.2 3s-2 4-8 4-8-4-8-4z" />
      <path d="M8 12.2c1.2.8 2.4 1.1 4 1.1s2.8-.3 4-1.1" />
    </g>
  ),
  puzzle: (
    <g {...stroke}>
      <path d="M8 4h4v2.2a1.6 1.6 0 1 0 0 3.2V12H8V9.6a1.6 1.6 0 1 1 0-3.2V4zM12 8h2.4a1.6 1.6 0 1 1 3.2 0H20v4h-2.4a1.6 1.6 0 1 0 0 3.2H20V20h-8v-2.2" />
    </g>
  ),
  bottle: (
    <g {...stroke}>
      <path d="M10 3h4M11 3v3l-2 2.2V19a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V8.2L13 6V3" />
    </g>
  ),
  palette: (
    <g {...stroke}>
      <path d="M12 4a8 8 0 1 0 0 16h1.2a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4 6 6 0 0 0 0-8z" />
      <circle cx="8" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="10" cy="7.2" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.2" cy="8" r="1" fill="currentColor" stroke="none" />
    </g>
  ),
  play: (
    <path fill="currentColor" d="M9 7.5v9l8-4.5-8-4.5z" />
  ),
  pause: (
    <g fill="currentColor">
      <rect x="7" y="6" width="3.2" height="12" rx="1" />
      <rect x="13.8" y="6" width="3.2" height="12" rx="1" />
    </g>
  ),
  userLine: (
    <g {...stroke}>
      <circle cx="12" cy="8" r="3" />
      <path d="M5.8 19c1.1-3 3.2-4.5 6.2-4.5s5.1 1.5 6.2 4.5" />
    </g>
  ),
  sliders: (
    <g {...stroke}>
      <path d="M4 8h16M4 16h16" />
      <circle cx="9" cy="8" r="2" fill="var(--bg, #14091f)" />
      <circle cx="15" cy="16" r="2" fill="var(--bg, #14091f)" />
    </g>
  ),
  signal: (
    <g fill="currentColor">
      <rect x="3" y="14" width="2.2" height="5" rx=".4" />
      <rect x="7.2" y="11" width="2.2" height="8" rx=".4" />
      <rect x="11.4" y="8" width="2.2" height="11" rx=".4" />
      <rect x="15.6" y="5" width="2.2" height="14" rx=".4" />
    </g>
  ),
  wifi: (
    <g {...stroke}>
      <path d="M4 9.5c4.4-3.6 11.6-3.6 16 0" />
      <path d="M7 12.4c2.8-2.2 7.2-2.2 10 0" />
      <path d="M10 15.2c1.2-.8 2.8-.8 4 0" />
      <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
    </g>
  ),
  battery: (
    <g {...stroke}>
      <rect x="3" y="8" width="16" height="8" rx="1.6" />
      <path d="M20 11v2" />
      <rect x="5" y="10" width="9" height="4" rx=".6" fill="currentColor" stroke="none" />
    </g>
  ),
  end: (
    <g fill="currentColor">
      <path d="M3.2 10.6c2-1.6 5-2.4 8.8-2.4s6.8.8 8.8 2.4c.5.4.6 1.1.2 1.6l-1.6 2a1 1 0 0 1-1.2.3l-2.2-.9a1 1 0 0 0-1.1.2l-.8 1a6 6 0 0 1-4.2 0l-.8-1a1 1 0 0 0-1.1-.2l-2.2.9a1 1 0 0 1-1.2-.3l-1.6-2a1.2 1.2 0 0 1 .2-1.6z" />
    </g>
  ),
};

export function GoogleMark({ size = 22 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7C21.6 18.8 23 15.8 23 12.3z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.2-6.9-5.1H1.3v3c2 4 6 6.7 10.7 6.7z" />
      <path fill="#FBBC05" d="M5.1 14.3A7.2 7.2 0 0 1 4.7 12c0-.8.1-1.6.4-2.3V6.7H1.3A12 12 0 0 0 0 12c0 1.9.5 3.8 1.3 5.3l3.8-3z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4C17.9 1.1 15.2 0 12 0 7.3 0 3.3 2.7 1.3 6.7l3.8 3C6.1 7 8.8 4.8 12 4.8z" />
    </svg>
  );
}

export function AppleMark({ size = 22 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M16.4 12.6c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.3-.1-2.6.8-3.3.8s-1.7-.8-2.9-.7c-1.5.1-2.8.9-3.6 2.2-1.5 2.7-.4 6.6 1.1 8.8.7 1.1 1.6 2.3 2.7 2.2 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7 1.9-1.1 2.6-2.1c.8-1.2 1.1-2.3 1.2-2.4-.1 0-2.1-.8-2.1-3.7zM14.7 6.8c.6-.7 1-1.7.9-2.8-1 .1-2.1.6-2.8 1.4-.6.7-1.1 1.7-.9 2.7 1 .1 2.1-.5 2.8-1.3z"
      />
    </svg>
  );
}

export function FacebookMark({ size = 22 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#1877F2"
        d="M22 12.1C22 6.5 17.5 2 12 2S2 6.5 2 12.1C2 17.1 5.6 21.2 10.4 22v-7H7.9v-2.9h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6v1.9h2.8l-.4 2.9h-2.4V22C18.4 21.2 22 17.1 22 12.1z"
      />
    </svg>
  );
}
