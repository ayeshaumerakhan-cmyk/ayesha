/**
 * Geometry for the intro loader. Every shape is drawn in a 100 by 100 box
 * and animated by stroke, so any set of paths works.
 * Admins pick a shape (or paste their own SVG path) in Admin, Site settings.
 */

export type LoaderShapeKey =
  | "arch"
  | "circle"
  | "square"
  | "triangle"
  | "diamond"
  | "hexagon"
  | "orbit"
  | "wave"
  | "lines"
  | "custom";

export const LOADER_SHAPES: Record<Exclude<LoaderShapeKey, "custom">, { label: string; paths: string[] }> = {
  arch: {
    label: "Arch in a square",
    paths: ["M4 4H96V96H4Z", "M18 96V56a32 32 0 0 1 64 0v40", "M50 24V96", "M18 56l32 40 32-40"],
  },
  circle: {
    label: "Circles",
    paths: ["M50 6a44 44 0 1 1 0 88a44 44 0 1 1 0-88Z", "M50 24a26 26 0 1 1 0 52a26 26 0 1 1 0-52Z"],
  },
  square: {
    label: "Nested squares",
    paths: ["M10 10H90V90H10Z", "M28 28H72V72H28Z", "M10 10L28 28M90 10L72 28M90 90L72 72M10 90L28 72"],
  },
  triangle: {
    label: "Triangles",
    paths: ["M50 8L94 90H6Z", "M50 36L73 78H27Z"],
  },
  diamond: {
    label: "Diamond",
    paths: ["M50 4L96 50L50 96L4 50Z", "M50 26L74 50L50 74L26 50Z", "M50 4V96M4 50H96"],
  },
  hexagon: {
    label: "Hexagon",
    paths: ["M50 5L90 27.5V72.5L50 95L10 72.5V27.5Z", "M50 27L71 39V61L50 73L29 61V39Z"],
  },
  orbit: {
    label: "Orbit",
    paths: ["M50 6a44 44 0 1 1 0 88a44 44 0 1 1 0-88Z", "M6 50C20 20 80 20 94 50C80 80 20 80 6 50Z"],
  },
  wave: {
    label: "Wave",
    paths: ["M5 50C20 10 35 10 50 50S80 90 95 50", "M5 66C20 26 35 26 50 66S80 106 95 66"],
  },
  lines: {
    label: "Lines",
    paths: ["M10 20H90", "M10 40H90", "M10 60H90", "M10 80H90"],
  },
};

export const LOADER_SHAPE_OPTIONS: string[] = [...Object.keys(LOADER_SHAPES), "custom"];
export const LOADER_STYLE_OPTIONS = ["draw", "fill", "pulse", "spin"] as const;

const SAFE_PATH = /^[MmLlHhVvCcSsQqTtAaZz0-9eE.,\s-]+$/;

/** Returns the SVG path strings for a shape. A custom path is only accepted if it contains path syntax and nothing else. */
export function getLoaderPaths(shape: string, custom: string): string[] {
  if (shape === "custom") {
    const d = custom.trim();
    if (d && d.length <= 4000 && SAFE_PATH.test(d)) return [d];
    return LOADER_SHAPES.arch.paths;
  }
  const found = (LOADER_SHAPES as Record<string, { paths: string[] }>)[shape];
  return (found ?? LOADER_SHAPES.arch).paths;
}

export type LoaderConfig = {
  enabled: boolean;
  shape: string;
  style: string;
  customPath: string;
  labelLeft: string;
  labelRight: string;
  /** Seconds the counter takes to reach 100. */
  duration: number;
};

export function toLoaderConfig(s: {
  loader_enabled: string;
  loader_shape: string;
  loader_style: string;
  loader_custom_path: string;
  loader_label_left: string;
  loader_label_right: string;
  loader_duration: string;
}): LoaderConfig {
  const seconds = parseFloat(s.loader_duration);
  return {
    enabled: s.loader_enabled.trim().toLowerCase() !== "no",
    shape: s.loader_shape || "arch",
    style: s.loader_style || "draw",
    customPath: s.loader_custom_path || "",
    labelLeft: s.loader_label_left,
    labelRight: s.loader_label_right,
    duration: Number.isFinite(seconds) ? Math.min(6, Math.max(0.8, seconds)) : 2,
  };
}
