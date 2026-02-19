export default function AgentLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-48 bg-white/5 rounded mb-6" />

      {/* Header skeleton */}
      <div className="glass-card p-6 mb-6 flex items-start gap-6">
        <div className="w-20 h-20 bg-white/5 rounded-xl flex-shrink-0" />
        <div className="flex-1">
          <div className="h-7 w-48 bg-white/5 rounded mb-3" />
          <div className="flex gap-2 mb-3">
            <div className="h-6 w-16 bg-white/5 rounded" />
            <div className="h-6 w-20 bg-white/5 rounded" />
          </div>
          <div className="h-4 w-full bg-white/5 rounded mb-2" />
          <div className="h-4 w-3/4 bg-white/5 rounded" />
        </div>
      </div>

      {/* Metrics skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-5 text-center">
            <div className="h-3 w-16 bg-white/5 rounded mx-auto mb-3" />
            <div className="h-8 w-20 bg-white/5 rounded mx-auto" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-5 text-center">
            <div className="h-3 w-16 bg-white/5 rounded mx-auto mb-3" />
            <div className="h-8 w-20 bg-white/5 rounded mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
