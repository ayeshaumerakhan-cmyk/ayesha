import { useId } from "react";

type BadgeProps = { text: string; size?: number; className?: string };

/** Circular text that rotates slowly, with an arrow in the middle. Purely decorative. */
export function RotatingBadge({ text, size = 120, className = "" }: BadgeProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const upper = text.toUpperCase();
  const repeat = Math.max(1, Math.round(28 / (upper.length + 1)));
  const content = Array.from({ length: repeat }, () => upper).join(" ") + " ";

  return (
    <span className={`badge ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <svg className="badge__ring" viewBox="0 0 100 100">
        <defs>
          <path id={`badge-${id}`} d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" />
        </defs>
        <text fontSize="9.5" fill="currentColor">
          <textPath href={`#badge-${id}`} textLength="237" lengthAdjust="spacing">
            {content}
          </textPath>
        </text>
      </svg>
      <svg className="badge__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M4 12h15M13 6l6 6-6 6" />
      </svg>
    </span>
  );
}
