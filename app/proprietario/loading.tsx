// app/proprietario/loading.tsx
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl p-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-44 rounded-2xl bg-muted animate-pulse" />
      ))}
    </div>
  )
}