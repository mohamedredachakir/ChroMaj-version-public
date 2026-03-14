import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchArticlesQuery } from '../lib/api'
import { PaginationControls } from '../components/shared/PaginationControls'
import { useApiResource } from '../lib/useApiResource'
import { AsyncState } from '../components/shared/AsyncState'
import { ListToolbar } from '../components/shared/ListToolbar'
import { PageIntro } from '../components/shared/PageIntro'
import { useDebouncedValue } from '../hooks/useDebouncedValue'

export function StoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentSearch = searchParams.get('q') ?? ''
  const currentPage = Number(searchParams.get('page') ?? '1') || 1
  const currentSort = (searchParams.get('sort') as 'latest' | 'oldest' | null) ?? 'latest'
  const [search, setSearch] = useState(currentSearch)
  const debouncedSearch = useDebouncedValue(search)

  const { data, error, isLoading } = useApiResource(
    () => fetchArticlesQuery({ q: currentSearch || undefined, page: currentPage, limit: 6, sort: currentSort }),
    [currentSearch, currentPage, currentSort],
  )

  useEffect(() => {
    setSearch(currentSearch)
  }, [currentSearch])

  useEffect(() => {
    if (debouncedSearch === currentSearch) {
      return
    }

    updateParams({ q: debouncedSearch.trim(), page: 1, sort: currentSort })
  }, [debouncedSearch])

  function updateParams(next: { q?: string; page?: number; sort?: 'latest' | 'oldest' }) {
    const params = new URLSearchParams(searchParams)

    if (next.q) {
      params.set('q', next.q)
    } else {
      params.delete('q')
    }

    if (next.page && next.page > 1) {
      params.set('page', String(next.page))
    } else {
      params.delete('page')
    }

    if (next.sort && next.sort !== 'latest') {
      params.set('sort', next.sort)
    } else {
      params.delete('sort')
    }

    setSearchParams(params)
  }

  return (
    <>
      <PageIntro
        eyebrow="Magazine"
        title="Editorial stories powered by the live ChroMag API."
        description="The landing page is no longer isolated. These stories come from the backend and PostgreSQL seed data, which is the base for the full magazine workflow."
      />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <ListToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search stories by title, content, or author"
            primarySelect={{
              value: currentSort,
              onChange: (value) => updateParams({ q: currentSearch, page: 1, sort: value as 'latest' | 'oldest' }),
              options: [
                { label: 'Latest first', value: 'latest' },
                { label: 'Oldest first', value: 'oldest' },
              ],
            }}
          />

          <AsyncState isLoading={isLoading} error={error} empty={!data || data.items.length === 0}>
            <div className="grid gap-6 lg:grid-cols-2">
              {data?.items.map((article, index) => (
                <article key={article.id} className={`rounded-[2rem] border border-zinc-800 p-8 ${index === 0 ? 'bg-white text-black' : 'bg-zinc-950 text-white'}`}>
                  <p className={`mb-4 text-xs uppercase tracking-[0.35em] ${index === 0 ? 'text-amber-700' : 'text-amber-500'}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {article.category?.name ?? 'Editorial'}
                  </p>
                  <h2 className="text-4xl leading-none md:text-5xl" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    {article.title}
                  </h2>
                  <p className={`mt-5 text-base ${index === 0 ? 'text-zinc-700' : 'text-zinc-400'}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {article.content}
                  </p>
                  <div className={`mt-8 flex flex-wrap gap-4 text-sm ${index === 0 ? 'text-zinc-600' : 'text-zinc-500'}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <span>Author: {article.author.name}</span>
                    <span>Artist: {article.artist?.user.name ?? 'Editorial Team'}</span>
                    <span>
                      {format(new Date(article.publishedAt ?? article.createdAt), 'dd MMM yyyy')}
                    </span>
                  </div>
                  <Link
                    to={`/stories/${article.id}`}
                    className={`mt-6 inline-flex text-sm underline underline-offset-4 ${index === 0 ? 'text-zinc-800' : 'text-amber-500'}`}
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    Read full story
                  </Link>
                </article>
              ))}
            </div>
            {data ? (
              <PaginationControls
                pagination={data.pagination}
                label="stories"
                onPrevious={() => updateParams({ q: currentSearch, page: Math.max(1, currentPage - 1), sort: currentSort })}
                onNext={() => updateParams({ q: currentSearch, page: currentPage + 1, sort: currentSort })}
              />
            ) : null}
          </AsyncState>
        </div>
      </section>
    </>
  )
}
