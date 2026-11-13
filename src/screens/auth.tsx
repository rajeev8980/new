import { useState } from "react";
import { api } from "../api";
import { Header, IconButton, Sheet, StatusBar } from "../components";
import { AppleMark, FacebookMark, GoogleMark, Icon, Logo } from "../icons";
import { useApp } from "../state";

const slides = [
  {
    kicker: "All-in-One",
    title: "Chatting & Romantic\nSocial Platform",
    line: "",
  },
  {
    kicker: "",
    title: "",
    line: "Chat · Love · Share",
  },
  {
    kicker: "One home",
    title: "Memories, calls\n& secret chats",
    line: "",
  },
];

export function Splash() {
  const { setAuthScreen } = useApp();
  const [i, setI] = useState(1);
  const slide = slides[i];
  return (
    <div className="bleed splash">
      <div className="dusk" aria-hidden>
        <div className="sun-glow" />
        <div className="sun" />
        <div className="water" />
        <Couple />
      </div>
      <StatusBar light />
      <div className="splash-brand">
        <Logo size={86} className="logo-glow" />
        <div className="wordmark large">
          <span>New</span>
          <Logo size={22} />
        </div>
      </div>
      <div className="splash-copy">
        {slide.kicker && <p className="kicker">{slide.kicker}</p>}
        {slide.title && <h1>{slide.title}</h1>}
        {slide.line && <p className="tagline">{slide.line}</p>}
        <div className="dots" role="tablist" aria-label="Intro slides">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={idx === i ? "on" : ""}
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setI(idx)}
            />
          ))}
        </div>
        <button type="button" className="btn-pink" onClick={() => setAuthScreen("signin")}>
          Get Started <Icon name="back" size={16} className="flip" />
        </button>
      </div>
    </div>
  );
}

function Couple() {
  return (
    <svg className="couple" viewBox="0 0 420 300" aria-hidden>
      <path fill="#12010c" d="M0 232c40-28 78-36 120-28 8-46 28-86 62-104 12-6 22-2 28 10 8-18 24-28 42-26 14 2 24 12 28 26 22 8 40 36 48 78 36-6 78 8 92 36v76H0V232z" />
      <circle cx="168" cy="118" r="30" fill="#12010c" />
      <circle cx="248" cy="124" r="27" fill="#12010c" />
      <path fill="#12010c" d="M230 104c22-22 62-18 84 8 6 22 2 46-10 64-18-8-34-6-48 6 4-24-8-48-26-78z" />
      <path fill="#12010c" d="M128 150c6-28 24-42 46-40 4 16 2 28-6 40-14 6-28 4-40 0z" />
      <path fill="#12010c" d="M96 300l18-92c8-16 22-26 42-28 16 10 22 26 18 48l-8 72H96z" />
      <path fill="#12010c" d="M214 300l6-78c2-22 16-40 38-46 20 6 34 24 36 48l8 76h-88z" />
    </svg>
  );
}

export function SignIn() {
  const { enter, setAuthScreen, notify } = useApp();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [error, setError] = useState("");
  const [social, setSocial] = useState("");

  async function submit() {
    if (!id.trim() || !pw.trim()) {
      setError("Enter your mobile or email and password.");
      return;
    }
    setError("");
    try {
      enter(await api.signin(id, pw));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    }
  }

  function socialIn(name: string) {
    setSocial(name);
    window.setTimeout(async () => {
      try {
        enter(await api.social(name));
      } catch (err) {
        setSocial("");
        setError(err instanceof Error ? err.message : "Sign in failed.");
      }
    }, 700);
  }

  return (
    <div className="page auth-page">
      <StatusBar />
      <div className="auth-scroll">
        <div className="auth-logo">
          <Logo size={72} className="logo-glow" />
          <div className="wordmark large">
            <span>New</span>
            <Logo size={18} />
          </div>
          <h1>Welcome Back</h1>
        </div>
        <form
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <label className="field">
            <Icon name="user" size={18} />
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Mobile / Email"
              autoComplete="username"
            />
          </label>
          <label className="field">
            <Icon name="lock" size={18} />
            <input
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
            />
            <button type="button" className="ghost" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((v) => !v)}>
              <Icon name={show ? "eyeOff" : "eye"} size={18} />
            </button>
          </label>
          <div className="auth-row">
            <button type="button" className={`check ${remember ? "on" : ""}`} onClick={() => setRemember((v) => !v)}>
              <i>{remember && <Icon name="check" size={12} />}</i>
              Remember me
            </button>
            <button type="button" className="link" onClick={() => setForgot(true)}>
              Forgot?
            </button>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-pink">
            Sign In
          </button>
        </form>
        <p className="or">or continue with</p>
        <div className="socials">
          <button type="button" aria-label="Continue with Google" onClick={() => socialIn("Google")}>
            <GoogleMark />
          </button>
          <button type="button" aria-label="Continue with Apple" onClick={() => socialIn("Apple")}>
            <AppleMark />
          </button>
          <button type="button" aria-label="Continue with Facebook" onClick={() => socialIn("Facebook")}>
            <FacebookMark />
          </button>
        </div>
        {social && <p className="social-note">Connecting with {social}…</p>}
        <p className="auth-foot">
          Don’t have an account?{" "}
          <button type="button" className="link" onClick={() => setAuthScreen("signup")}>
            Sign Up
          </button>
        </p>
      </div>
      {forgot && (
        <Forgot
          email={id}
          onClose={() => setForgot(false)}
          onSent={() => {
            setForgot(false);
            notify("Reset link sent. Check your inbox.");
          }}
        />
      )}
    </div>
  );
}

function Forgot({
  email,
  onClose,
  onSent,
}: {
  email: string;
  onClose: () => void;
  onSent: () => void;
}) {
  const [value, setValue] = useState(email);
  return (
    <Sheet title="Forgot password" onClose={onClose}>
      <p className="sheet-copy">We’ll send a reset link to your mobile or email.</p>
      <label className="field">
        <Icon name="mail" size={18} />
        <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Mobile / Email" />
      </label>
      <button
        type="button"
        className="btn-pink"
        onClick={async () => {
          if (!value.trim()) return;
          try {
            await api.forgot(value);
          } catch {
            /* The screen still confirms so a missing account is not revealed. */
          }
          onSent();
        }}
      >
        Send reset link
      </button>
    </Sheet>
  );
}

export function SignUp() {
  const { enter, setAuthScreen } = useApp();
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  return (
    <div className="page auth-page">
      <StatusBar />
      <Header back={false} title="Create account" left={
        <IconButton label="Back to sign in" onClick={() => setAuthScreen("signin")}>
          <Icon name="back" />
        </IconButton>
      } />
      <form
        className="auth-form signup"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!name.trim() || !id.trim() || pw.length < 4) {
            setError("Add your name, mobile or email, and a password.");
            return;
          }
          try {
            enter(await api.signup(name, id, pw));
          } catch (err) {
            setError(err instanceof Error ? err.message : "Couldn’t create the account.");
          }
        }}
      >
        <label className="field">
          <Icon name="user" size={18} />
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </label>
        <label className="field">
          <Icon name="mail" size={18} />
          <input value={id} onChange={(e) => setId(e.target.value)} placeholder="Mobile / Email" />
        </label>
        <label className="field">
          <Icon name="lock" size={18} />
          <input value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" type="password" />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="btn-pink" type="submit">
          Create Account
        </button>
        <p className="auth-foot">
          Already on New?{" "}
          <button type="button" className="link" onClick={() => setAuthScreen("signin")}>
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
}
