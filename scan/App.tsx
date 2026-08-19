import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { searchComps } from "./src/lib/comps";
import { missingKeys } from "./src/lib/env";
import { priceRange } from "./src/lib/range";
import { identifyObject } from "./src/lib/vision";
import { CameraScreen } from "./src/screens/CameraScreen";
import { ResultScreen } from "./src/screens/ResultScreen";
import { WorkingScreen } from "./src/screens/WorkingScreen";
import type { ScanResult } from "./src/types";

type Phase = "camera" | "working" | "result" | "error";

export default function App() {
  const [phase, setPhase] = useState<Phase>("camera");
  const [step, setStep] = useState("Naming the object…");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const blocked = missingKeys();

  async function runLoop(uri: string, base64: string) {
    setPhase("working");
    setError(null);
    try {
      setStep("Naming the object…");
      const vision = await identifyObject(base64);
      setStep("Searching comps…");
      const comps = await searchComps(vision);
      const range = priceRange(comps);
      setResult({ photoUri: uri, vision, comps, range });
      setPhase("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed.");
      setPhase("error");
    }
  }

  function reset() {
    setResult(null);
    setError(null);
    setPhase("camera");
  }

  if (blocked.length > 0) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingTitle}>Add keys to run V1</Text>
        <Text style={styles.missingBody}>
          Copy scan/.env.example to scan/.env and fill: {blocked.join("; ")}.
          Then restart Expo.
        </Text>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <View style={styles.fill}>
      {phase === "camera" ? (
        <CameraScreen onCapture={(uri, base64) => void runLoop(uri, base64)} />
      ) : null}
      {phase === "working" ? <WorkingScreen step={step} /> : null}
      {phase === "result" && result ? (
        <ResultScreen result={result} onReshoot={reset} />
      ) : null}
      {phase === "error" ? (
        <View style={styles.missing}>
          <Text style={styles.missingTitle}>Couldn’t finish the loop</Text>
          <Text style={styles.missingBody}>{error}</Text>
          <Pressable style={styles.retry} onPress={reset}>
            <Text style={styles.retryLabel}>Try again</Text>
          </Pressable>
        </View>
      ) : null}
      <StatusBar style={phase === "result" ? "dark" : "light"} />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: "#000" },
  missing: {
    flex: 1,
    backgroundColor: "#201747",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  missingTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  missingBody: {
    marginTop: 12,
    color: "rgba(255,255,255,0.88)",
    fontSize: 16,
    lineHeight: 23,
  },
  retry: {
    marginTop: 28,
    height: 50,
    borderRadius: 18,
    backgroundColor: "#00A2C7",
    alignItems: "center",
    justifyContent: "center",
  },
  retryLabel: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
