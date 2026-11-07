import { getLoaderPaths } from "@/lib/loader-shapes";

type Props = {
  shape: string;
  customPath?: string;
  style?: string;
  className?: string;
};

/** The animated geometry shown in the loader. Also used for the live preview in the admin panel. */
export function LoaderShape({ shape, customPath = "", style = "draw", className = "" }: Props) {
  const paths = getLoaderPaths(shape, customPath);
  return (
    <svg
      className={`lshape lshape--${style} ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} pathLength={1} style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
    </svg>
  );
}
