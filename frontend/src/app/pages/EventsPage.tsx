import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchEventsQuery } from '../lib/api'
import { AsyncState } from '../components/shared/AsyncState'
import { ListToolbar } from '../components/shared/ListToolbar'
import { PageIntro } from '../components/shared/PageIntro'
import { PaginationControls } from '../components/shared/PaginationControls'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useApiResource } from '../lib/useApiResource'

export function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentSearch = searchParams.get('q') ?? ''
  const currentCity = searchParams.get('city') ?? ''
  const currentPage = Number(searchParams.get('page') ?? '1') || 1
  const currentSort = (searchParams.get('sort') as 'soonest' | 'latest' | null) ?? 'soonest'
  const [search, setSearch] = useState(currentSearch)
  const [city, setCity] = useState(currentCity)
  const debouncedSearch = useDebouncedValue(search)
  const debouncedCity = useDebouncedValue(city)

  const { data, error, isLoading } = useApiResource(
    () => fetchEventsQuery({ q: currentSearch || undefined, city: currentCity || undefined, page: currentPage, limit: 6, sort: currentSort }),
    [currentSearch, currentCity, currentPage, currentSort],
  )

  useEffect(() => {
    setSearch(currentSearch)
  }, [currentSearch])

  useEffect(() => {
    setCity(currentCity)
  }, [currentCity])

  useEffect(() => {
    if (debouncedSearch === currentSearch && debouncedCity === currentCity) {
      return
    }

    updateParams({ q: debouncedSearch.trim(), city: debouncedCity.trim(), page: 1, sort: currentSort })
  }, [debouncedSearch, debouncedCity])

  function updateParams(next: { q?: string; city?: string; page?: number; sort?: 'soonest' | 'latest' }) {
    const params = new URLSearchParams(searchParams)

    if (next.q) {
      params.set('q', next.q)
    } else {
      params.delete('q')
    }

    if (next.city) {
      params.set('city', next.city)
    } else {
      params.delete('city')
    }

    if (next.page && next.page > 1) {
      params.set('page', String(next.page))
    } else {
      params.delete('page')
    }

    if (next.sort && next.sort !== 'soonest') {
      params.set('sort', next.sort)
    } else {
      params.delete('sort')
    }

    setSearchParams(params)
  }

  return (
    <>
      <PageIntro
        eyebrow="Events"
        title="A live cultural calendar for exhibitions, workshops, and gatherings."
        description="This page is the first step toward the PRD event calendar. It already reads from PostgreSQL through the API and is ready for search, filters, and city views next."
      />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <ListToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search events by title or summary"
            primarySelect={{
              value: currentSort,
              onChange: (value) => updateParams({ q: currentSearch, city: currentCity, page: 1, sort: value as 'soonest' | 'latest' }),
              options: [
                { label: 'Soonest first', value: 'soonest' },
                { label: 'Latest first', value: 'latest' },
              ],
            }}
            secondaryInput={{
              value: city,
              onChange: setCity,
              placeholder: 'Filter by city',
            }}
          />

          <AsyncState isLoading={isLoading} error={error} empty={!data || data.items.length === 0}>
            <div className="grid gap-6 lg:grid-cols-2">
              {data?.items.map((event) => (
                <article key={event.id} className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 text-white">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-amber-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {event.city}
                      </p>
                      <h2 className="mt-4 text-4xl leading-none md:text-5xl" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                        {event.title}
                      </h2>
                    </div>
                    <p className="text-sm text-zinc-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {format(new Date(event.date), 'dd MMM yyyy')}
                    </p>
                  </div>
                  <p className="mt-5 text-zinc-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {event.description}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4 text-sm text-zinc-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <span>{event.location}</span>
                    <span>{event.image ? 'Visual available' : 'Details only'}</span>
                  </div>
                  <Link
                    to={`/events/${event.id}`}
                    className="mt-6 inline-flex text-sm text-amber-500 underline underline-offset-4"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    View event details
                  </Link>
                </article>
              ))}
            </div>
            {data ? (
              <PaginationControls
                pagination={data.pagination}
                label="events"
                onPrevious={() => updateParams({ q: currentSearch, city: currentCity, page: Math.max(1, currentPage - 1), sort: currentSort })}
                onNext={() => updateParams({ q: currentSearch, city: currentCity, page: currentPage + 1, sort: currentSort })}
              />
            ) : null}
          </AsyncState>
        </div>
      </section>
    </>
  )
}
