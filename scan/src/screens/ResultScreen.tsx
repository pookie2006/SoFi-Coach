import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { ScanResult } from "../types";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function ResultScreen({
  result,
  onReshoot,
}: {
  result: ScanResult;
  onReshoot: () => void;
}) {
  const { photoUri, vision, comps, range } = result;

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.body}>
      <Image source={{ uri: photoUri }} style={styles.photo} />
      <Text style={styles.kicker}>
        {vision.brand ? `${vision.brand} · ${vision.category}` : vision.category}
      </Text>
      <Text style={styles.name}>{vision.name}</Text>
      {vision.details.length > 0 ? (
        <Text style={styles.details}>{vision.details.join(" · ")}</Text>
      ) : null}

      <Text style={styles.range}>{usd.format(range.typical)}</Text>
      <Text style={styles.rangeLabel}>typical from live comps</Text>
      <Text style={styles.band}>
        {usd.format(range.low)} low · {usd.format(range.high)} high
      </Text>

      <Text style={styles.section}>Comparable listings</Text>
      {comps.slice(0, 5).map((comp) => (
        <Pressable
          key={comp.link}
          style={styles.comp}
          onPress={() => void Linking.openURL(comp.link)}
        >
          <Text style={styles.compTitle}>{comp.title}</Text>
          <Text style={styles.compMeta}>
            {usd.format(comp.price)} · {comp.source}
          </Text>
        </Pressable>
      ))}

      <Pressable style={styles.again} onPress={onReshoot}>
        <Text style={styles.againLabel}>Scan another</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
  },
  body: {
    paddingBottom: 48,
  },
  photo: {
    width: "100%",
    height: 320,
    backgroundColor: "#111",
  },
  kicker: {
    marginTop: 20,
    marginHorizontal: 24,
    color: "#00A2C7",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  name: {
    marginTop: 8,
    marginHorizontal: 24,
    color: "#201747",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  details: {
    marginTop: 8,
    marginHorizontal: 24,
    color: "#5C5868",
    fontSize: 15,
    lineHeight: 21,
  },
  range: {
    marginTop: 28,
    marginHorizontal: 24,
    color: "#201747",
    fontSize: 52,
    fontWeight: "800",
    letterSpacing: -1.6,
  },
  rangeLabel: {
    marginHorizontal: 24,
    color: "#212121",
    fontSize: 17,
    fontWeight: "600",
  },
  band: {
    marginTop: 6,
    marginHorizontal: 24,
    color: "#5C5868",
    fontSize: 15,
  },
  section: {
    marginTop: 32,
    marginBottom: 8,
    marginHorizontal: 24,
    color: "#201747",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  comp: {
    marginHorizontal: 24,
    marginBottom: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(32,23,71,0.12)",
    borderRadius: 16,
  },
  compTitle: {
    color: "#212121",
    fontSize: 15,
    fontWeight: "600",
  },
  compMeta: {
    marginTop: 6,
    color: "#5C5868",
    fontSize: 14,
  },
  again: {
    marginTop: 28,
    marginHorizontal: 24,
    height: 50,
    borderRadius: 18,
    backgroundColor: "#00A2C7",
    alignItems: "center",
    justifyContent: "center",
  },
  againLabel: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
