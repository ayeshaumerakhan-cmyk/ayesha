type LogoProps = { className?: string; draw?: boolean; showWord?: boolean };

/** Monogram: tiny wordmark over an arch-in-a-square mark. */
export function Logo({ className = "", draw = false, showWord = true }: LogoProps) {
  return (
    <span className={`logo ${className}`}>
      {showWord && <span className="logo__word">AU</span>}
      <svg
        className={`logo__mark ${draw ? "logo__mark--draw" : ""}`}
        viewBox="0 0 34 34"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden="true"
      >
        <rect x="0.5" y="0.5" width="33" height="33" pathLength={1} />
        <path d="M5 33V17a12 12 0 0 1 24 0v16" pathLength={1} />
        <path d="M17 5v28" pathLength={1} />
        <path d="M5 17l12 16 12-16" pathLength={1} />
      </svg>
    </span>
  );
}
