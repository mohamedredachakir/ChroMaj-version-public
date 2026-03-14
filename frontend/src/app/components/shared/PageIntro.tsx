export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="border-b border-zinc-900 bg-zinc-950/80 px-6 pb-14 pt-32">
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 text-sm uppercase tracking-[0.4em] text-amber-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          {eyebrow}
        </p>
        <h1 className="max-w-4xl text-5xl md:text-7xl leading-[0.95]" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
          {title}
        </h1>
        <p className="mt-6 max-w-3xl text-base text-zinc-400 md:text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          {description}
        </p>
      </div>
    </section>
  )
}
