import { type FormEvent, useState } from 'react'
import { subscribeToNewsletter } from '../lib/api'

export function NewsletterSignup({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    setError(null)
    setIsSubmitting(true)

    try {
      await subscribeToNewsletter({ email })
      setEmail('')
      setMessage('Subscribed to the newsletter.')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Subscription failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className={compact ? 'flex flex-col gap-3 sm:flex-row' : 'flex flex-col gap-3 md:flex-row'} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          className="min-w-0 flex-1 rounded-xl border border-zinc-800 bg-black px-4 py-3 text-white"
          required
        />
        <button
          disabled={isSubmitting}
          className="rounded-xl bg-white px-5 py-3 text-black disabled:opacity-60"
        >
          {isSubmitting ? 'Joining...' : 'Join newsletter'}
        </button>
      </form>
      {message ? <p className="mt-3 text-sm text-green-300" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-red-300" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{error}</p> : null}
    </div>
  )
}