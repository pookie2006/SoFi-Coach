import { IosShareSheet } from "../components/IosShareSheet";
import { useStaticMode } from "../useStaticMode";
import { MessagesThread } from "./SourceScreen";

export function ShareScreen() {
  const { go } = useStaticMode();

  return (
    <>
      <MessagesThread dimmed />
      <IosShareSheet onSofiIt={() => go("/processing")} onClose={() => go("/story")} />
    </>
  );
}
