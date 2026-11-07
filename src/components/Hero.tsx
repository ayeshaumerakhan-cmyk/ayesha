import { AnimatedChars } from "@/components/AnimatedChars";
import { Img } from "@/components/Img";
import { ScrollButton } from "@/components/ScrollButton";
import type { CSSProperties } from "react";
import type { GalleryImage, SiteSettings } from "@/types";

type Props = { settings: SiteSettings; chips: GalleryImage[] };

/** Home hero: huge thin title, a CLICK hint, then the tagline with small image chips set inline. */
export function Hero({ settings, chips }: Props) {
  const words = settings.tagline.split(" ");
  const usable = chips.filter((c) => c.url);
  const step = usable.length > 0 ? Math.max(1, Math.floor(words.length / (usable.length + 1))) : 0;
  let chipIndex = 0;

  return (
    <section className="hero">
      <h1 className="hero__title">
        <AnimatedChars text={settings.hero_title} />
      </h1>

      <ScrollButton target="#intro" className="hero__hint" cursor="Scroll down">
        <span className="hero__hint-text">{settings.hero_hint}</span>
        <span className="hero__hint-line" />
      </ScrollButton>

      <h2 id="intro" className="hero__tagline">
        {words.map((w, i) => {
          const showChip = step > 0 && (i + 1) % step === 0 && chipIndex < usable.length && i < words.length - 1;
          const chip = showChip ? usable[chipIndex++] : null;
          return (
            <span key={i} className="hero__word">
              {w}{" "}
              {chip && (
                <span className="chip" style={{ "--k": chipIndex } as CSSProperties}>
                  <Img src={chip.url} alt={chip.alt} sizes="160px" />
                </span>
              )}
            </span>
          );
        })}
      </h2>
    </section>
  );
}
