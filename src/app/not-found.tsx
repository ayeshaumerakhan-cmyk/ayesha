import Link from "next/link";

export default function NotFound() {
  return (
    <main className="nf">
      <p className="nf__code">404</p>
      <h1 className="nf__title">This page does not exist.</h1>
      <Link href="/" className="ulink">
        Back to the home page
      </Link>
    </main>
  );
}
