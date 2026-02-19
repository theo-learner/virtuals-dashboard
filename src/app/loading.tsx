export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 w-64 bg-white/5 rounded-lg mb-2" />
        <div className="h-4 w-96 bg-white/5 rounded-lg" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-5">
            <div className="h-4 w-20 bg-white/5 rounded mb-3" />
            <div className="h-8 w-24 bg-white/5 rounded" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="glass-card p-5">
        <div className="flex gap-3 mb-4">
          <div className="h-10 flex-1 bg-white/5 rounded-xl" />
          <div className="h-10 w-40 bg-white/5 rounded-xl" />
        </div>
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-2">
              <div className="h-4 w-8 bg-white/5 rounded" />
              <div className="h-7 w-7 bg-white/5 rounded-full" />
              <div className="h-4 flex-1 bg-white/5 rounded" />
              <div className="h-4 w-20 bg-white/5 rounded" />
              <div className="h-4 w-16 bg-white/5 rounded" />
              <div className="h-4 w-12 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
