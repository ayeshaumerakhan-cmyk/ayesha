import type { CSSProperties, ElementType } from "react";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Extra stagger offset, in characters. */
  offset?: number;
};

/**
 * Splits text into characters that rise into view when the page is ready.
 * Pure CSS animation (see .chars in globals.css), so it costs no JS on scroll.
 */
export function AnimatedChars({ text, as: Tag = "span", className = "", offset = 0 }: Props) {
  const words = text.split(" ");
  let index = offset;

  return (
    <Tag className={`chars ${className}`} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi}>
          <span className="word" aria-hidden="true">
            {Array.from(word).map((ch, ci) => {
              const style = { "--i": index++ } as CSSProperties;
              return (
                <span className="char" style={style} key={ci}>
                  {ch}
                </span>
              );
            })}
          </span>
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
