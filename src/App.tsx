import { Drawer, TabBar, Toast } from "./components";
import { Splash, SignIn, SignUp } from "./screens/auth";
import { Call, Chats, StoryView, Thread } from "./screens/chats";
import {
  AI,
  CommunitiesScreen,
  Discover,
  Games,
  GroupsScreen,
  Location,
  Love,
  Premium,
  Privacy,
  Profile,
  Reels,
  Secret,
  Themes,
} from "./screens/features";
import { useApp, AppState, type Screen } from "./state";

function ScreenSwitch() {
  const { screen } = useApp();
  const map: Record<Screen, JSX.Element> = {
    splash: <Splash />,
    signin: <SignIn />,
    signup: <SignUp />,
    chats: <Chats />,
    thread: <Thread />,
    secretThread: <Thread />,
    call: <Call />,
    reels: <Reels />,
    discover: <Discover />,
    love: <Love />,
    ai: <AI />,
    groups: <GroupsScreen />,
    communities: <CommunitiesScreen />,
    games: <Games />,
    location: <Location />,
    secret: <Secret />,
    privacy: <Privacy />,
    premium: <Premium />,
    themes: <Themes />,
    profile: <Profile />,
    story: <StoryView />,
  };
  return map[screen];
}

function Shell() {
  const app = useApp();
  return (
    <div className="stage">
      <div className="glow a" />
      <div className="glow b" />
      <div className="glow c" />
      <div
        className={`phone ${app.wallpaper ? "has-wall" : ""}`}
        data-theme={app.theme}
        data-wall={app.wallpaper ?? "none"}
        data-screen={app.screen}
      >
        <div className="phone-inner">
          <div className="screen">
            <ScreenSwitch />
          </div>
          {app.showTabs && <TabBar />}
          <Drawer />
          <Toast />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppState>
      <Shell />
    </AppState>
  );
}
