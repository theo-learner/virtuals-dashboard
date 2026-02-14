export default function StatCard({
  label,
  value,
  icon,
  trend,
  trendLabel,
}: {
  label: string;
  value: string;
  icon: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
}) {
  const trendColor = trend === "up" ? "text-accent-green" : trend === "down" ? "text-error" : "text-text-secondary";
  const trendArrow = trend === "up" ? "↑" : trend === "down" ? "↓" : "";

  return (
    <div className="glass-card p-5 flex flex-col gap-2 relative overflow-hidden group">
      {/* Subtle purple gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-transparent pointer-events-none" />

      <div className="relative flex items-center justify-between">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent-primary/15 text-xl">
          {icon}
        </span>
        {trend && (
          <span className={`text-xs font-mono ${trendColor} flex items-center gap-1`}>
            {trendArrow} {trendLabel}
          </span>
        )}
      </div>
      <span className="relative text-text-secondary text-xs font-mono uppercase tracking-wider mt-1">{label}</span>
      <span className="relative text-2xl font-bold font-mono text-accent-primary glow-primary">{value}</span>
    </div>
  );
}
