import { StyleSheet, Text, View } from "react-native";

export function WorkingScreen({ step }: { step: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>SoFi It</Text>
      <Text style={styles.title}>{step}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "#201747",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  kicker: {
    color: "#00A2C7",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    marginTop: 12,
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
});
