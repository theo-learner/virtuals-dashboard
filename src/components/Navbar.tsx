import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="glass-card mb-6 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold font-mono">
        <span className="text-cyan-neon glow-cyan">VIRTUALS</span>
        <span className="text-violet-accent"> aGDP</span>
      </Link>
      <div className="flex gap-6 text-sm font-mono">
        <Link href="/" className="hover:text-cyan-neon transition-colors">대시보드</Link>
        <Link href="/analytics" className="hover:text-cyan-neon transition-colors">분석</Link>
        <Link href="/insights" className="hover:text-cyan-neon transition-colors">인사이트</Link>
      </div>
    </nav>
  );
}
