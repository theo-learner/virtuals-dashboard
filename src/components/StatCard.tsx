export default function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="glass-card p-5 flex flex-col gap-2">
      <span className="text-2xl">{icon}</span>
      <span className="text-text-secondary text-xs font-mono uppercase tracking-wider">{label}</span>
      <span className="text-2xl font-bold font-mono text-cyan-neon glow-cyan">{value}</span>
    </div>
  );
}
