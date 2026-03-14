import { FormEvent, useMemo, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

const initialForm = {
  name: '',
  email: '',
  password: '',
  bio: '',
}

export function AuthPage() {
  const location = useLocation()
  const { isAuthenticated, login, register, user } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [role, setRole] = useState<'USER' | 'ARTIST'>('USER')
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectTarget = useMemo(() => {
    if (location.state && typeof location.state === 'object' && 'from' in location.state) {
      return String(location.state.from)
    }

    return user?.role === 'ADMIN' ? '/admin' : '/stories'
  }, [location.state, user?.role])

  if (isAuthenticated) {
    return <Navigate to={redirectTarget} replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password })
      } else {
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
          role,
          bio: role === 'ARTIST' ? form.bio : undefined,
        })
      }
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Authentication failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-28 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2.5rem] border border-zinc-900 bg-zinc-950 p-8 md:p-12">
          <p className="text-sm uppercase tracking-[0.4em] text-amber-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Access
          </p>
          <h1 className="mt-6 text-6xl leading-[0.95] md:text-8xl" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            {mode === 'login' ? 'SIGN IN' : 'JOIN CHRO\'MAG'}
          </h1>
          <p className="mt-6 max-w-xl text-zinc-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Use the seeded admin account to access the protected dashboard, or create a new reader or artist account against the live API.
          </p>
          <div className="mt-10 flex gap-3">
            <button type="button" onClick={() => setMode('login')} className={`px-5 py-3 text-sm ${mode === 'login' ? 'bg-white text-black' : 'bg-zinc-900 text-white'}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Login
            </button>
            <button type="button" onClick={() => setMode('register')} className={`px-5 py-3 text-sm ${mode === 'register' ? 'bg-white text-black' : 'bg-zinc-900 text-white'}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Register
            </button>
          </div>
          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            {mode === 'register' ? (
              <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Full name" className="w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 outline-none focus:border-amber-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }} />
            ) : null}
            <input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="Email address" type="email" className="w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 outline-none focus:border-amber-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }} />
            <input value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder="Password" type="password" className="w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 outline-none focus:border-amber-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }} />
            {mode === 'register' ? (
              <>
                <div className="grid gap-3 md:grid-cols-2">
                  <button type="button" onClick={() => setRole('USER')} className={`rounded-2xl border px-4 py-4 text-left ${role === 'USER' ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-800 bg-black'}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Reader account
                  </button>
                  <button type="button" onClick={() => setRole('ARTIST')} className={`rounded-2xl border px-4 py-4 text-left ${role === 'ARTIST' ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-800 bg-black'}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Artist account
                  </button>
                </div>
                {role === 'ARTIST' ? (
                  <textarea value={form.bio} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} placeholder="Short artist bio" className="min-h-32 w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 outline-none focus:border-amber-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }} />
                ) : null}
              </>
            ) : null}
            {error ? <p className="text-sm text-red-300" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{error}</p> : null}
            <button disabled={isSubmitting} className="w-full rounded-2xl bg-white px-6 py-4 text-black disabled:opacity-60" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {isSubmitting ? 'Submitting...' : mode === 'login' ? 'Login' : 'Create account'}
            </button>
          </form>
        </section>
        <aside className="rounded-[2.5rem] border border-zinc-900 bg-gradient-to-br from-amber-500/10 via-black to-red-500/10 p-8 md:p-12">
          <h2 className="text-5xl leading-none" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            DEFAULT ADMIN
          </h2>
          <dl className="mt-10 space-y-4 text-zinc-300" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-zinc-500">Email</dt>
              <dd className="mt-2 text-lg">admin@chromag.local</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-zinc-500">Password</dt>
              <dd className="mt-2 text-lg">admin1234</dd>
            </div>
          </dl>
          <p className="mt-10 text-zinc-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            This page completes the first real auth flow on the frontend. After login, admin users can reach the protected dashboard, while readers and artists can browse the public content pages.
          </p>
        </aside>
      </div>
    </main>
  )
}
