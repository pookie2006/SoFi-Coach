import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export function QrCard({
  value,
  size = 220,
  label,
}: {
  value: string;
  size?: number;
  label?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    void QRCode.toCanvas(canvas, value, {
      width: size,
      margin: 1,
      color: { dark: "#201747", light: "#ffffff" },
    });
  }, [size, value]);

  return (
    <figure style={{ margin: 0, textAlign: "center" }}>
      <canvas ref={canvasRef} width={size} height={size} />
      {label ? (
        <figcaption
          style={{
            marginTop: 8,
            color: "rgba(255,255,255,0.8)",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
}
