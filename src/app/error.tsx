"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="nf">
      <p className="nf__code">Oops</p>
      <h1 className="nf__title">Something went wrong while loading this page.</h1>
      <button type="button" className="ulink" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
