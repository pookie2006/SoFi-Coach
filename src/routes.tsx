import { Route, Routes } from "react-router-dom";
import { ActionScreen } from "./screens/ActionScreen";
import { BreadthScreen } from "./screens/BreadthScreen";
import { DoneScreen } from "./screens/DoneScreen";
import { ExecuteScreen } from "./screens/ExecuteScreen";
import { ProcessingScreen } from "./screens/ProcessingScreen";
import { ShareScreen } from "./screens/ShareScreen";
import { SourceScreen } from "./screens/SourceScreen";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/story" element={<SourceScreen />} />
      <Route path="/share" element={<ShareScreen />} />
      <Route path="/processing" element={<ProcessingScreen />} />
      <Route path="/execute" element={<ExecuteScreen />} />
      <Route path="/action" element={<ActionScreen />} />
      <Route path="/done" element={<DoneScreen />} />
      <Route path="/breadth" element={<BreadthScreen />} />
    </Routes>
  );
}
