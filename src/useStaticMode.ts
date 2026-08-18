import {
  createContext,
  useCallback,
  useContext,
  type ReactNode,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PlaybackLockContext = createContext(false);

export function PlaybackLock({ children }: { children: ReactNode }) {
  return (
    <PlaybackLockContext.Provider value={true}>
      {children}
    </PlaybackLockContext.Provider>
  );
}

export function usePlaybackLock() {
  return useContext(PlaybackLockContext);
}

export function useStaticMode() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const locked = usePlaybackLock();
  const isStatic = searchParams.get("static") === "1";

  const go = useCallback(
    (path: string) => {
      if (locked) return;
      navigate(isStatic ? `${path}?static=1` : path);
    },
    [isStatic, locked, navigate],
  );

  return { isStatic, go };
}
