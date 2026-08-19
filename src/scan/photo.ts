function toJpeg(source: CanvasImageSource, width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not read the photo.");
  ctx.drawImage(source, 0, 0, width, height);
  const uri = canvas.toDataURL("image/jpeg", 0.62);
  const base64 = uri.split(",")[1] ?? "";
  if (!base64) throw new Error("Could not encode the photo.");
  return { uri, base64 };
}

function fit(width: number, height: number, max = 1280) {
  const scale = Math.min(1, max / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/** Shrink a still photo so the laptop proxy can send it to the vision model. */
export async function fileToJpeg(file: File) {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      const size = fit(bitmap.width, bitmap.height);
      const out = toJpeg(bitmap, size.width, size.height);
      bitmap.close();
      return out;
    } catch {
      // HEIC or other formats fall through to an <img> decode.
    }
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not read the photo."));
      img.src = objectUrl;
    });
    const size = fit(image.naturalWidth, image.naturalHeight);
    return toJpeg(image, size.width, size.height);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
