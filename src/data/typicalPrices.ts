export type TypicalPrice = {
  query: string;
  mid: number;
  high: number;
  label: string;
};

/** Street-typical USD for COCO classes the camera can name. */
export const typicalPrices: Record<string, TypicalPrice> = {
  bicycle: { query: "bicycle", mid: 450, high: 890, label: "Bicycle" },
  backpack: { query: "backpack", mid: 55, high: 120, label: "Backpack" },
  umbrella: { query: "umbrella", mid: 25, high: 45, label: "Umbrella" },
  handbag: { query: "handbag", mid: 80, high: 220, label: "Handbag" },
  suitcase: { query: "suitcase", mid: 90, high: 180, label: "Suitcase" },
  bottle: { query: "water bottle", mid: 18, high: 40, label: "Bottle" },
  "wine glass": { query: "wine glass", mid: 14, high: 30, label: "Wine glass" },
  cup: { query: "coffee mug", mid: 16, high: 32, label: "Cup" },
  fork: { query: "fork set", mid: 12, high: 24, label: "Fork" },
  knife: { query: "kitchen knife", mid: 22, high: 45, label: "Knife" },
  spoon: { query: "spoon set", mid: 12, high: 24, label: "Spoon" },
  bowl: { query: "bowl", mid: 15, high: 28, label: "Bowl" },
  banana: { query: "banana", mid: 2, high: 4, label: "Banana" },
  apple: { query: "apple", mid: 2, high: 4, label: "Apple" },
  sandwich: { query: "sandwich", mid: 9, high: 14, label: "Sandwich" },
  orange: { query: "orange", mid: 2, high: 4, label: "Orange" },
  broccoli: { query: "broccoli", mid: 3, high: 5, label: "Broccoli" },
  carrot: { query: "carrot", mid: 2, high: 4, label: "Carrot" },
  "hot dog": { query: "hot dog", mid: 6, high: 10, label: "Hot dog" },
  pizza: { query: "pizza", mid: 16, high: 28, label: "Pizza" },
  donut: { query: "donut", mid: 3, high: 5, label: "Donut" },
  cake: { query: "cake", mid: 28, high: 48, label: "Cake" },
  chair: { query: "chair", mid: 85, high: 180, label: "Chair" },
  couch: { query: "sofa", mid: 650, high: 1400, label: "Couch" },
  "potted plant": { query: "potted plant", mid: 28, high: 55, label: "Potted plant" },
  bed: { query: "bed frame", mid: 320, high: 700, label: "Bed" },
  "dining table": { query: "dining table", mid: 280, high: 600, label: "Dining table" },
  tv: { query: "tv", mid: 380, high: 800, label: "TV" },
  laptop: { query: "laptop", mid: 1_200, high: 1_999, label: "Laptop" },
  mouse: { query: "computer mouse", mid: 25, high: 80, label: "Mouse" },
  remote: { query: "remote control", mid: 18, high: 35, label: "Remote" },
  keyboard: { query: "keyboard", mid: 45, high: 120, label: "Keyboard" },
  "cell phone": { query: "smartphone", mid: 800, high: 1_199, label: "Phone" },
  microwave: { query: "microwave", mid: 120, high: 220, label: "Microwave" },
  oven: { query: "oven", mid: 700, high: 1_400, label: "Oven" },
  toaster: { query: "toaster", mid: 35, high: 70, label: "Toaster" },
  refrigerator: { query: "refrigerator", mid: 1_100, high: 2_200, label: "Refrigerator" },
  book: { query: "book", mid: 18, high: 32, label: "Book" },
  clock: { query: "clock", mid: 22, high: 45, label: "Clock" },
  vase: { query: "vase", mid: 28, high: 60, label: "Vase" },
  scissors: { query: "scissors", mid: 12, high: 22, label: "Scissors" },
  "teddy bear": { query: "teddy bear", mid: 20, high: 40, label: "Teddy bear" },
  "hair drier": { query: "hair dryer", mid: 40, high: 90, label: "Hair dryer" },
  toothbrush: { query: "toothbrush", mid: 6, high: 12, label: "Toothbrush" },
  motorcycle: { query: "motorcycle", mid: 7_500, high: 14_000, label: "Motorcycle" },
  car: { query: "car", mid: 18_000, high: 32_000, label: "Car" },
  skateboard: { query: "skateboard", mid: 70, high: 140, label: "Skateboard" },
  surfboard: { query: "surfboard", mid: 350, high: 700, label: "Surfboard" },
  "tennis racket": { query: "tennis racket", mid: 80, high: 180, label: "Tennis racket" },
  "sports ball": { query: "soccer ball", mid: 25, high: 50, label: "Ball" },
  "baseball bat": { query: "baseball bat", mid: 45, high: 90, label: "Baseball bat" },
  snowboard: { query: "snowboard", mid: 280, high: 500, label: "Snowboard" },
  skis: { query: "skis", mid: 300, high: 550, label: "Skis" },
  headphones: { query: "headphones", mid: 80, high: 249, label: "Headphones" },
};

export const ignoredLabels = new Set([
  "person",
  "tie",
  "traffic light",
  "fire hydrant",
  "stop sign",
  "parking meter",
  "bench",
  "bird",
  "cat",
  "dog",
  "horse",
  "sheep",
  "cow",
  "elephant",
  "bear",
  "zebra",
  "giraffe",
  "airplane",
  "bus",
  "train",
  "truck",
  "boat",
  "sink",
]);

export function typicalFor(label: string): TypicalPrice {
  const key = label.toLowerCase();
  return (
    typicalPrices[key] ?? {
      query: key,
      mid: 40,
      high: 80,
      label: key.replace(/\b\w/g, (c) => c.toUpperCase()),
    }
  );
}
