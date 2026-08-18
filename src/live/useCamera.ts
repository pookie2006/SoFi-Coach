import { useEffect, useRef, useState } from "react";

export function useCamera(active: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!active) return;
    const video = videoRef.current;
    if (!video) return;
    let stream: MediaStream | null = null;
    let cancelled = false;

    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 } },
      })
      .then((next) => {
        if (cancelled) {
          next.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = next;
        video.srcObject = next;
        return video.play();
      })
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Camera blocked. Pick the object instead — the demo still runs.");
        }
      });

    return () => {
      cancelled = true;
      setReady(false);
      stream?.getTracks().forEach((track) => track.stop());
      if (video) video.srcObject = null;
    };
  }, [active]);

  return { videoRef, error, ready };
}
