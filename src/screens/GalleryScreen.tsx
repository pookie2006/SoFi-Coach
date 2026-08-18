import { DeviceFrame } from "../components/DeviceFrame";
import { ActionScreen } from "./ActionScreen";
import { BreadthScreen } from "./BreadthScreen";
import { DoneScreen } from "./DoneScreen";
import { EndScreen } from "./EndScreen";
import { ExecuteScreen } from "./ExecuteScreen";
import styles from "./GalleryScreen.module.css";
import { ProcessingScreen } from "./ProcessingScreen";
import { ShareScreen } from "./ShareScreen";
import { SourceScreen } from "./SourceScreen";

const frames = [
  { path: "/", Screen: SourceScreen },
  { path: "/share", Screen: ShareScreen },
  { path: "/processing", Screen: ProcessingScreen },
  { path: "/execute", Screen: ExecuteScreen },
  { path: "/action", Screen: ActionScreen },
  { path: "/done", Screen: DoneScreen },
  { path: "/breadth", Screen: BreadthScreen },
  { path: "/end", Screen: EndScreen },
] as const;

export function GalleryScreen() {
  return (
    <div className={styles.gallery}>
      {frames.map(({ path, Screen }) => (
        <div key={path} className={styles.frozen}>
          <DeviceFrame caption={path} variant="item">
            <Screen />
          </DeviceFrame>
        </div>
      ))}
    </div>
  );
}
