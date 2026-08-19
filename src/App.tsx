import { useLocation } from "react-router-dom";
import { DeviceFrame } from "./components/DeviceFrame";
import { AppRoutes } from "./routes";
import { DemoScreen } from "./screens/DemoScreen";
import { GalleryScreen } from "./screens/GalleryScreen";
import { LiveApp } from "./screens/live/LiveApp";
import { LiveHost } from "./screens/live/LiveHost";
import { ScanApp } from "./screens/scan/ScanApp";
import { ScanHost } from "./screens/scan/ScanHost";
import { useStaticMode } from "./useStaticMode";

function routePath(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}

export default function App() {
  const location = useLocation();
  const { isStatic } = useStaticMode();
  const path = routePath(location.pathname);

  if (path === "/gallery") {
    return <GalleryScreen />;
  }

  if (path === "/scan/host") {
    return <ScanHost />;
  }

  if (path === "/scan") {
    return <ScanApp />;
  }

  if (path === "/live/host") {
    return <LiveHost />;
  }

  if (path === "/live") {
    return <LiveApp />;
  }

  if (path === "/" || path === "/demo") {
    return <DemoScreen />;
  }

  return (
    <DeviceFrame caption={isStatic ? null : "SoFi It · Luke"}>
      <AppRoutes />
    </DeviceFrame>
  );
}
