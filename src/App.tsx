import { useLocation } from "react-router-dom";
import { DeviceFrame } from "./components/DeviceFrame";
import { AppRoutes } from "./routes";
import { DemoScreen } from "./screens/DemoScreen";
import { GalleryScreen } from "./screens/GalleryScreen";
import { LiveApp } from "./screens/live/LiveApp";
import { LiveHost } from "./screens/live/LiveHost";
import { useStaticMode } from "./useStaticMode";

export default function App() {
  const location = useLocation();
  const { isStatic } = useStaticMode();

  if (location.pathname === "/gallery") {
    return <GalleryScreen />;
  }

  if (location.pathname === "/live/host") {
    return <LiveHost />;
  }

  if (location.pathname === "/live") {
    return <LiveApp />;
  }

  if (location.pathname === "/" || location.pathname === "/demo") {
    return <DemoScreen />;
  }

  return (
    <DeviceFrame caption={isStatic ? null : "SoFi It · Maya"}>
      <AppRoutes />
    </DeviceFrame>
  );
}
