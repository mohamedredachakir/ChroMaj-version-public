export function AsyncState({ isLoading, error, empty, children }: { isLoading: boolean; error: string | null; empty: boolean; children: React.ReactNode }) {
  if (isLoading) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-zinc-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Loading data...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/40 bg-red-500/10 p-8 text-red-200" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        {error}
      </div>
    )
  }

  if (empty) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-zinc-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        No content available yet.
      </div>
    )
  }

  return <>{children}</>
}
