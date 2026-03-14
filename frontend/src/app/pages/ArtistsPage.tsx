import { type FormEvent, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { createArtworkSubmission, fetchArtistsQuery, fetchCategories, fetchMyArtworkSubmissions } from '../lib/api'
import { PaginationControls } from '../components/shared/PaginationControls'
import { useApiResource } from '../lib/useApiResource'
import { AsyncState } from '../components/shared/AsyncState'
import { ListToolbar } from '../components/shared/ListToolbar'
import { PageIntro } from '../components/shared/PageIntro'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import type { UserRole } from '../lib/types'
import { useAuth } from '../auth/AuthProvider'

export function ArtistsPage() {
  const { token, user, isAuthenticated } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentSearch = searchParams.get('q') ?? ''
  const currentRole = (searchParams.get('role') as UserRole | 'ALL' | null) ?? 'ALL'
  const currentPage = Number(searchParams.get('page') ?? '1') || 1
  const currentSort = (searchParams.get('sort') as 'newest' | 'oldest' | null) ?? 'newest'
  const [search, setSearch] = useState(currentSearch)
  const [role, setRole] = useState<UserRole | 'ALL'>(currentRole)
  const [submissionReloadKey, setSubmissionReloadKey] = useState(0)
  const [submissionState, setSubmissionState] = useState({
    title: '',
    image: '',
    description: '',
    categoryId: '',
  })
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null)
  const debouncedSearch = useDebouncedValue(search)

  useEffect(() => {
    setSearch(currentSearch)
  }, [currentSearch])

  useEffect(() => {
    setRole(currentRole)
  }, [currentRole])

  useEffect(() => {
    if (debouncedSearch === currentSearch) {
      return
    }

    updateParams({ q: debouncedSearch.trim(), role: currentRole, page: 1, sort: currentSort })
  }, [debouncedSearch])

  function updateParams(next: { q?: string; role?: UserRole | 'ALL'; page?: number; sort?: 'newest' | 'oldest' }) {
    const params = new URLSearchParams(searchParams)

    if (next.q) {
      params.set('q', next.q)
    } else {
      params.delete('q')
    }

    if (next.role && next.role !== 'ALL') {
      params.set('role', next.role)
    } else {
      params.delete('role')
    }

    if (next.page && next.page > 1) {
      params.set('page', String(next.page))
    } else {
      params.delete('page')
    }

    if (next.sort && next.sort !== 'newest') {
      params.set('sort', next.sort)
    } else {
      params.delete('sort')
    }

    setSearchParams(params)
  }

  const { data, error, isLoading } = useApiResource(
    () =>
      fetchArtistsQuery({
        q: currentSearch || undefined,
        role: currentRole === 'ALL' ? undefined : currentRole,
        page: currentPage,
        limit: 6,
        sort: currentSort,
      }),
    [currentSearch, currentRole, currentPage, currentSort],
  )
  const categoriesResource = useApiResource(fetchCategories, [])
  const mySubmissionsResource = useApiResource(
    () => {
      if (!isAuthenticated || !token || user?.role !== 'ARTIST') {
        return Promise.resolve([])
      }

      return fetchMyArtworkSubmissions(token)
    },
    [isAuthenticated, token, user?.role, submissionReloadKey],
  )

  const artworkCategories = (categoriesResource.data ?? []).filter((category) => category.type === 'ARTWORK')

  async function handleCreateSubmission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!token) {
      return
    }

    setSubmissionError(null)
    setSubmissionMessage(null)

    try {
      await createArtworkSubmission(token, {
        title: submissionState.title,
        image: submissionState.image,
        description: submissionState.description,
        categoryId: submissionState.categoryId || undefined,
      })

      setSubmissionMessage('Artwork submitted for review.')
      setSubmissionState({
        title: '',
        image: '',
        description: '',
        categoryId: '',
      })
      setSubmissionReloadKey((current) => current + 1)
    } catch (submitError) {
      setSubmissionError(submitError instanceof Error ? submitError.message : 'Failed to submit artwork.')
    }
  }

  return (
    <>
      <PageIntro
        eyebrow="Artists"
        title="Artist profiles and creative workspaces, prepared for full submissions."
        description="The API already models artists from the ERD. This page exposes the live artist records and gives the frontend a base for profile detail pages and submission workflows."
      />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <ListToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search artists by name or bio"
            primarySelect={{
              value: currentSort,
              onChange: (value) => updateParams({ q: currentSearch, role: currentRole, page: 1, sort: value as 'newest' | 'oldest' }),
              options: [
                { label: 'Newest first', value: 'newest' },
                { label: 'Oldest first', value: 'oldest' },
              ],
            }}
          />

          {isAuthenticated && user?.role === 'ARTIST' ? (
            <section className="mb-10 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 md:p-8">
              <h2 className="text-4xl text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                Submit Artwork For Review
              </h2>
              <form onSubmit={handleCreateSubmission} className="mt-6 space-y-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <input
                  value={submissionState.title}
                  onChange={(event) => setSubmissionState((current) => ({ ...current, title: event.target.value }))}
                  className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-white"
                  placeholder="Artwork title"
                  required
                />
                <input
                  value={submissionState.image}
                  onChange={(event) => setSubmissionState((current) => ({ ...current, image: event.target.value }))}
                  className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-white"
                  placeholder="Image URL"
                  required
                />
                <textarea
                  value={submissionState.description}
                  onChange={(event) => setSubmissionState((current) => ({ ...current, description: event.target.value }))}
                  className="min-h-28 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-white"
                  placeholder="Describe your artwork"
                  required
                />
                <select
                  value={submissionState.categoryId}
                  onChange={(event) => setSubmissionState((current) => ({ ...current, categoryId: event.target.value }))}
                  className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-white"
                >
                  <option value="">No category</option>
                  {artworkCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <button className="rounded-xl bg-white px-5 py-3 text-black">Submit for review</button>
              </form>
              {submissionMessage ? (
                <p className="mt-4 text-green-300" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{submissionMessage}</p>
              ) : null}
              {submissionError ? (
                <p className="mt-4 text-red-300" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{submissionError}</p>
              ) : null}

              <div className="mt-8">
                <h3 className="text-2xl text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>My Submissions</h3>
                {mySubmissionsResource.isLoading ? (
                  <p className="mt-3 text-zinc-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Loading submissions...</p>
                ) : null}
                {mySubmissionsResource.error ? (
                  <p className="mt-3 text-red-300" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{mySubmissionsResource.error}</p>
                ) : null}
                <div className="mt-4 space-y-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {(mySubmissionsResource.data ?? []).length === 0 ? (
                    <p className="text-zinc-500">No submissions yet.</p>
                  ) : null}
                  {(mySubmissionsResource.data ?? []).map((submission) => (
                    <article key={submission.id} className="rounded-xl border border-zinc-800 bg-black/40 p-4 text-zinc-200">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-white">{submission.title}</p>
                        <span className="text-xs uppercase tracking-[0.25em] text-amber-500">{submission.status}</span>
                      </div>
                      <p className="mt-2 text-sm text-zinc-500">{submission.category?.name ?? 'Uncategorized'}</p>
                      {submission.reviewNote ? <p className="mt-3 text-sm text-zinc-400">Review note: {submission.reviewNote}</p> : null}
                    </article>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          <div className="mb-8 max-w-xs">
            <select
              value={role}
              onChange={(event) => updateParams({ q: currentSearch, role: event.target.value as UserRole | 'ALL', page: 1, sort: currentSort })}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              <option value="ALL">All roles</option>
              <option value="ARTIST">Artist</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
            </select>
          </div>

          <AsyncState isLoading={isLoading} error={error} empty={!data || data.items.length === 0}>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {data?.items.map((artist) => (
                <article key={artist.id} className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 text-white">
                  <p className="text-xs uppercase tracking-[0.35em] text-amber-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {artist.user.role}
                  </p>
                  <h2 className="mt-4 text-4xl leading-none" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    {artist.user.name}
                  </h2>
                  <p className="mt-5 text-zinc-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {artist.bio}
                  </p>
                  <dl className="mt-8 space-y-3 text-sm text-zinc-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <div className="flex justify-between gap-4">
                      <dt>Artworks</dt>
                      <dd>{artist.artworks.length}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Articles</dt>
                      <dd>{artist.articles.length}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Instagram</dt>
                      <dd>{artist.instagram ?? 'Not set'}</dd>
                    </div>
                  </dl>
                  <Link
                    to={`/artists/${artist.id}`}
                    className="mt-6 inline-flex text-sm text-amber-500 underline underline-offset-4"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    View profile
                  </Link>
                  {artist.website ? (
                    <a href={artist.website} target="_blank" rel="noreferrer" className="mt-8 inline-flex text-sm text-white underline underline-offset-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      Visit artist page
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
            {data ? (
              <PaginationControls
                pagination={data.pagination}
                label="artists"
                onPrevious={() => updateParams({ q: currentSearch, role: currentRole, page: Math.max(1, currentPage - 1), sort: currentSort })}
                onNext={() => updateParams({ q: currentSearch, role: currentRole, page: currentPage + 1, sort: currentSort })}
              />
            ) : null}
          </AsyncState>
        </div>
      </section>
    </>
  )
}
