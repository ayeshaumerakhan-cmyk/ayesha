import { Img } from "@/components/Img";
import type { GalleryImage } from "@/types";

/** Endless strip of images. CSS only, pauses on hover. */
export function Marquee({ images }: { images: GalleryImage[] }) {
  const list = images.filter((i) => i.url);
  if (list.length === 0) return null;
  const loop = [...list, ...list];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {loop.map((img, i) => (
          <span className="marquee__item" key={`${img.id}-${i}`}>
            <Img src={img.url} alt={img.alt} sizes="25vw" />
          </span>
        ))}
      </div>
    </div>
  );
}
