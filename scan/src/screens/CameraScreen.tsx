import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  onCapture: (uri: string, base64: string) => void;
};

export function CameraScreen({ onCapture }: Props) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [busy, setBusy] = useState(false);

  if (!permission) {
    return <View style={styles.fill} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permission}>
        <Pressable style={styles.allow} onPress={() => void requestPermission()}>
          <Text style={styles.allowLabel}>Allow camera</Text>
        </Pressable>
      </View>
    );
  }

  async function shoot() {
    if (busy) return;
    setBusy(true);
    try {
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.55,
        base64: true,
        skipProcessing: true,
      });
      if (photo?.uri && photo.base64) {
        onCapture(photo.uri, photo.base64);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.fill}>
      <CameraView
        ref={cameraRef}
        style={styles.fill}
        facing="back"
        mode="picture"
      />
      <View style={styles.bar} pointerEvents="box-none">
        <Pressable
          accessibilityLabel="Take photo"
          disabled={busy}
          onPress={() => void shoot()}
          style={[styles.shutter, busy ? styles.shutterBusy : null]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: "#000",
  },
  permission: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  allow: {
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: "#fff",
  },
  allowLabel: {
    fontSize: 17,
    fontWeight: "600",
  },
  bar: {
    position: "absolute",
    right: 0,
    bottom: 48,
    left: 0,
    alignItems: "center",
  },
  shutter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#fff",
    borderWidth: 6,
    borderColor: "rgba(255,255,255,0.35)",
  },
  shutterBusy: {
    opacity: 0.45,
  },
});
