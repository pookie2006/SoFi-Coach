import { ignoredLabels } from "../data/typicalPrices";

type Detector = {
  detect: (
    input: HTMLVideoElement,
  ) => Promise<Array<{ class: string; score: number }>>;
};

export type Detection = {
  label: string;
  score: number;
};

let detectorPromise: Promise<Detector | null> | null = null;

export function loadDetector() {
  if (!detectorPromise) {
    detectorPromise = (async () => {
      try {
        const tf = await import("@tensorflow/tfjs");
        await tf.setBackend("webgl").catch(() => tf.setBackend("cpu"));
        await tf.ready();
        const coco = await import("@tensorflow-models/coco-ssd");
        return (await coco.load({ base: "lite_mobilenet_v2" })) as Detector;
      } catch {
        return null;
      }
    })();
  }
  return detectorPromise;
}

export async function matchFrame(
  video: HTMLVideoElement,
): Promise<Detection | null> {
  const detector = await loadDetector();
  if (!detector || video.readyState < 2) return null;
  const hits = await detector.detect(video);
  const ranked = [...hits].sort((a, b) => b.score - a.score);
  for (const hit of ranked) {
    if (hit.score < 0.45) continue;
    const label = hit.class.toLowerCase();
    if (ignoredLabels.has(label)) continue;
    return { label, score: hit.score };
  }
  return null;
}
