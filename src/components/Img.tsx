import Image from "next/image";
import { SUPABASE_URL } from "@/lib/env";

let supabaseHost = "";
try {
  supabaseHost = SUPABASE_URL ? new URL(SUPABASE_URL).hostname : "";
} catch {
  supabaseHost = "";
}

type Props = {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Used when the image is not absolutely positioned. */
  width?: number;
  height?: number;
};

/**
 * next/image wrapper that never crashes on an unknown host.
 * Local files and your Supabase bucket are optimised. Any other remote URL
 * (for example a link pasted into the admin panel) is shown as-is.
 */
export function Img({ src, alt, sizes = "100vw", priority = false, className, width, height }: Props) {
  if (!src) return null;
  const local = src.startsWith("/");
  const fromSupabase = Boolean(supabaseHost) && src.includes(supabaseHost);
  const unoptimized = !(local || fromSupabase);

  if (width && height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
        className={className}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={unoptimized}
      className={className}
      style={{ objectFit: "cover" }}
    />
  );
}
