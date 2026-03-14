import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="max-w-xl text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-amber-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          404
        </p>
        <h1 className="mt-6 text-7xl leading-none" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
          PAGE NOT FOUND
        </h1>
        <p className="mt-6 text-zinc-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          The route exists in neither the editorial frontend nor the new full-stack application shell.
        </p>
        <Link to="/" className="mt-10 inline-flex bg-white px-6 py-4 text-black" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Return home
        </Link>
      </div>
    </main>
  )
}
