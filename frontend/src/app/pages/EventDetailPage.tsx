import { format } from 'date-fns'
import { Link, useParams } from 'react-router-dom'
import { fetchEventById } from '../lib/api'
import { useApiResource } from '../lib/useApiResource'
import { AsyncState } from '../components/shared/AsyncState'

export function EventDetailPage() {
  const params = useParams<{ id: string }>()
  const eventId = params.id ?? ''
  const { data, error, isLoading } = useApiResource(
    () => fetchEventById(eventId),
    [eventId],
  )

  return (
    <main className="px-6 pb-16 pt-32">
      <div className="mx-auto max-w-5xl">
        <Link to="/events" className="text-sm text-amber-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Back to events
        </Link>
        <div className="mt-6">
          <AsyncState isLoading={isLoading} error={error} empty={!data}>
            {data ? (
              <article className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 text-white md:p-12">
                <p className="text-xs uppercase tracking-[0.35em] text-amber-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {data.city}
                </p>
                <h1 className="mt-5 text-5xl leading-[0.95] md:text-7xl" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  {data.title}
                </h1>
                <div className="mt-6 space-y-2 text-zinc-300" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  <p>{format(new Date(data.date), 'dd MMM yyyy, HH:mm')}</p>
                  <p>{data.location}</p>
                </div>
                <p className="mt-8 text-lg text-zinc-300" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {data.description}
                </p>
              </article>
            ) : null}
          </AsyncState>
        </div>
      </div>
    </main>
  )
}
