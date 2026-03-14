import { FormEvent, useMemo, useState } from 'react'
import {
  createArticle,
  createArtwork,
  fetchAdminArtworkSubmissions,
  createEvent,
  deleteArtwork,
  deleteArticle,
  deleteEvent,
  reviewArtworkSubmission,
  fetchArtworks,
  fetchArtists,
  fetchArticles,
  fetchCategories,
  fetchDashboardSummary,
  fetchEvents,
  fetchNewsletterSubscribers,
  updateArtwork,
  updateArticle,
  updateEvent,
} from '../lib/api'
import { useApiResource } from '../lib/useApiResource'
import { PageIntro } from '../components/shared/PageIntro'
import { AsyncState } from '../components/shared/AsyncState'
import { useAuth } from '../auth/AuthProvider'

export function AdminPage() {
  const { token, user } = useAuth()
  const [reloadKey, setReloadKey] = useState(0)
  const [articleState, setArticleState] = useState({
    title: '',
    content: '',
    categoryId: '',
    artistId: '',
    publishedAt: '',
  })
  const [eventState, setEventState] = useState({
    title: '',
    description: '',
    date: '',
    city: '',
    location: '',
    image: '',
  })
  const [artworkState, setArtworkState] = useState({
    artistId: '',
    categoryId: '',
    title: '',
    image: '',
    description: '',
  })
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [articleUpdateState, setArticleUpdateState] = useState({
    id: '',
    title: '',
    content: '',
  })
  const [eventUpdateState, setEventUpdateState] = useState({
    id: '',
    title: '',
    city: '',
    location: '',
  })
  const [artworkUpdateState, setArtworkUpdateState] = useState({
    id: '',
    artistId: '',
    categoryId: '',
    title: '',
    image: '',
    description: '',
  })
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({})
  const [submissionFilter, setSubmissionFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL')

  const { data, error, isLoading } = useApiResource(
    () => fetchDashboardSummary(token ?? ''),
    [token, reloadKey],
  )
  const categoriesResource = useApiResource(fetchCategories, [])
  const artistsResource = useApiResource(fetchArtists, [])
  const articlesResource = useApiResource(fetchArticles, [reloadKey])
  const eventsResource = useApiResource(fetchEvents, [reloadKey])
  const artworksResource = useApiResource(fetchArtworks, [reloadKey])
  const submissionsResource = useApiResource(
    () => fetchAdminArtworkSubmissions(token ?? '', submissionFilter === 'ALL' ? undefined : submissionFilter),
    [token, reloadKey, submissionFilter],
  )
  const allSubmissionsResource = useApiResource(
    () => fetchAdminArtworkSubmissions(token ?? ''),
    [token, reloadKey],
  )
  const newsletterResource = useApiResource(
    () => fetchNewsletterSubscribers(token ?? ''),
    [token, reloadKey],
  )

  const articleCategories = useMemo(
    () => (categoriesResource.data ?? []).filter((category) => category.type === 'ARTICLE'),
    [categoriesResource.data],
  )
  const artworkCategories = useMemo(
    () => (categoriesResource.data ?? []).filter((category) => category.type === 'ARTWORK'),
    [categoriesResource.data],
  )
  const submissionCounts = useMemo(() => {
    const submissions = allSubmissionsResource.data ?? []

    return {
      pending: submissions.filter((submission) => submission.status === 'PENDING').length,
      approved: submissions.filter((submission) => submission.status === 'APPROVED').length,
      rejected: submissions.filter((submission) => submission.status === 'REJECTED').length,
    }
  }, [allSubmissionsResource.data])

  async function handleCreateArticle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!token) {
      return
    }

    setSubmitMessage(null)
    setSubmitError(null)

    try {
      await createArticle(token, {
        title: articleState.title,
        content: articleState.content,
        categoryId: articleState.categoryId || undefined,
        artistId: articleState.artistId || undefined,
        publishedAt: articleState.publishedAt ? new Date(articleState.publishedAt).toISOString() : undefined,
      })
      setSubmitMessage('Article created successfully.')
      setArticleState({
        title: '',
        content: '',
        categoryId: '',
        artistId: '',
        publishedAt: '',
      })
      setReloadKey((current) => current + 1)
    } catch (creationError) {
      setSubmitError(creationError instanceof Error ? creationError.message : 'Failed to create article.')
    }
  }

  async function handleUpdateArticle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!token || !articleUpdateState.id) {
      return
    }

    setSubmitMessage(null)
    setSubmitError(null)

    try {
      await updateArticle(token, articleUpdateState.id, {
        title: articleUpdateState.title || undefined,
        content: articleUpdateState.content || undefined,
      })
      setSubmitMessage('Article updated successfully.')
      setReloadKey((current) => current + 1)
    } catch (updateError) {
      setSubmitError(updateError instanceof Error ? updateError.message : 'Failed to update article.')
    }
  }

  async function handleDeleteArticle(id: string) {
    if (!token) {
      return
    }

    setSubmitMessage(null)
    setSubmitError(null)

    try {
      await deleteArticle(token, id)
      setSubmitMessage('Article deleted successfully.')
      setReloadKey((current) => current + 1)
    } catch (deleteError) {
      setSubmitError(deleteError instanceof Error ? deleteError.message : 'Failed to delete article.')
    }
  }

  async function handleCreateEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!token) {
      return
    }

    setSubmitMessage(null)
    setSubmitError(null)

    try {
      await createEvent(token, {
        title: eventState.title,
        description: eventState.description,
        date: new Date(eventState.date).toISOString(),
        city: eventState.city,
        location: eventState.location,
        image: eventState.image || undefined,
      })
      setSubmitMessage('Event created successfully.')
      setEventState({
        title: '',
        description: '',
        date: '',
        city: '',
        location: '',
        image: '',
      })
      setReloadKey((current) => current + 1)
    } catch (creationError) {
      setSubmitError(creationError instanceof Error ? creationError.message : 'Failed to create event.')
    }
  }

  async function handleUpdateEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!token || !eventUpdateState.id) {
      return
    }

    setSubmitMessage(null)
    setSubmitError(null)

    try {
      await updateEvent(token, eventUpdateState.id, {
        title: eventUpdateState.title || undefined,
        city: eventUpdateState.city || undefined,
        location: eventUpdateState.location || undefined,
      })
      setSubmitMessage('Event updated successfully.')
      setReloadKey((current) => current + 1)
    } catch (updateError) {
      setSubmitError(updateError instanceof Error ? updateError.message : 'Failed to update event.')
    }
  }

  async function handleDeleteEvent(id: string) {
    if (!token) {
      return
    }

    setSubmitMessage(null)
    setSubmitError(null)

    try {
      await deleteEvent(token, id)
      setSubmitMessage('Event deleted successfully.')
      setReloadKey((current) => current + 1)
    } catch (deleteError) {
      setSubmitError(deleteError instanceof Error ? deleteError.message : 'Failed to delete event.')
    }
  }

  async function handleCreateArtwork(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!token) {
      return
    }

    setSubmitMessage(null)
    setSubmitError(null)

    try {
      await createArtwork(token, {
        artistId: artworkState.artistId,
        categoryId: artworkState.categoryId || undefined,
        title: artworkState.title,
        image: artworkState.image,
        description: artworkState.description,
      })

      setSubmitMessage('Artwork created successfully.')
      setArtworkState({
        artistId: '',
        categoryId: '',
        title: '',
        image: '',
        description: '',
      })
      setReloadKey((current) => current + 1)
    } catch (creationError) {
      setSubmitError(creationError instanceof Error ? creationError.message : 'Failed to create artwork.')
    }
  }

  async function handleUpdateArtwork(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!token || !artworkUpdateState.id) {
      return
    }

    setSubmitMessage(null)
    setSubmitError(null)

    try {
      await updateArtwork(token, artworkUpdateState.id, {
        artistId: artworkUpdateState.artistId || undefined,
        categoryId: artworkUpdateState.categoryId ? artworkUpdateState.categoryId : null,
        title: artworkUpdateState.title || undefined,
        image: artworkUpdateState.image || undefined,
        description: artworkUpdateState.description || undefined,
      })

      setSubmitMessage('Artwork updated successfully.')
      setReloadKey((current) => current + 1)
    } catch (updateError) {
      setSubmitError(updateError instanceof Error ? updateError.message : 'Failed to update artwork.')
    }
  }

  async function handleDeleteArtwork(id: string) {
    if (!token) {
      return
    }

    setSubmitMessage(null)
    setSubmitError(null)

    try {
      await deleteArtwork(token, id)
      setSubmitMessage('Artwork deleted successfully.')
      setReloadKey((current) => current + 1)
    } catch (deleteError) {
      setSubmitError(deleteError instanceof Error ? deleteError.message : 'Failed to delete artwork.')
    }
  }

  async function handleReviewSubmission(id: string, action: 'APPROVE' | 'REJECT') {
    if (!token) {
      return
    }

    setSubmitMessage(null)
    setSubmitError(null)

    try {
      await reviewArtworkSubmission(token, id, {
        action,
        reviewNote: reviewNotes[id]?.trim() || undefined,
      })

      setSubmitMessage(action === 'APPROVE' ? 'Submission approved and artwork published.' : 'Submission rejected.')
      setReloadKey((current) => current + 1)
    } catch (reviewError) {
      setSubmitError(reviewError instanceof Error ? reviewError.message : 'Failed to review submission.')
    }
  }

  return (
    <>
      <PageIntro
        eyebrow="Admin"
        title={`Welcome back, ${user?.name ?? 'Admin'}.`}
        description="This protected route is the first admin surface wired to the API. It summarizes the current database state and gives the frontend a stable base for future CRUD flows."
      />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <AsyncState isLoading={isLoading} error={error} empty={!data}>
            {data ? (
              <div className="space-y-10">
                <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
                  {Object.entries(data.totals).map(([key, value]) => (
                    <div key={key} className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 text-white">
                      <p className="text-xs uppercase tracking-[0.35em] text-zinc-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {key}
                      </p>
                      <p className="mt-4 text-5xl leading-none" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                  <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
                    <h2 className="text-3xl text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Latest Articles</h2>
                    <div className="mt-6 space-y-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {data.latest.articles.map((article) => (
                        <div key={article.id} className="border-b border-zinc-800 pb-4 text-zinc-300 last:border-b-0">
                          <p className="text-white">{article.title}</p>
                          <p className="mt-1 text-sm text-zinc-500">{article.author.name}</p>
                          <button
                            onClick={() => handleDeleteArticle(article.id)}
                            className="mt-3 text-xs text-red-300 underline underline-offset-2"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
                    <h2 className="text-3xl text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Latest Artists</h2>
                    <div className="mt-6 space-y-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {data.latest.artists.map((artist) => (
                        <div key={artist.id} className="border-b border-zinc-800 pb-4 text-zinc-300 last:border-b-0">
                          <p className="text-white">{artist.user.name}</p>
                          <p className="mt-1 text-sm text-zinc-500">{artist.bio}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
                    <h2 className="text-3xl text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Upcoming Events</h2>
                    <div className="mt-6 space-y-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {data.latest.events.map((event) => (
                        <div key={event.id} className="border-b border-zinc-800 pb-4 text-zinc-300 last:border-b-0">
                          <p className="text-white">{event.title}</p>
                          <p className="mt-1 text-sm text-zinc-500">{event.city} · {event.location}</p>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="mt-3 text-xs text-red-300 underline underline-offset-2"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
                <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
                  <h2 className="text-3xl text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Artwork Library</h2>
                  <div className="mt-6 grid gap-3 md:grid-cols-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {(artworksResource.data ?? []).length === 0 ? <p className="text-zinc-500">No artworks yet.</p> : null}
                    {(artworksResource.data ?? []).map((artwork) => (
                      <article key={artwork.id} className="rounded-xl border border-zinc-800 p-4 text-zinc-200">
                        <p className="text-white">{artwork.title}</p>
                        <p className="mt-1 text-sm text-zinc-500">{artwork.artist.user.name} · {artwork.category?.name ?? 'Uncategorized'}</p>
                        <button
                          type="button"
                          onClick={() => handleDeleteArtwork(artwork.id)}
                          className="mt-3 text-xs text-red-300 underline underline-offset-2"
                        >
                          Delete
                        </button>
                      </article>
                    ))}
                  </div>
                </section>
                <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
                  <h2 className="text-3xl text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Artwork Submission Queue</h2>
                  <div className="mt-5 flex flex-wrap items-center gap-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-300">Pending: {submissionCounts.pending}</span>
                    <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-300">Approved: {submissionCounts.approved}</span>
                    <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-300">Rejected: {submissionCounts.rejected}</span>
                    <select
                      value={submissionFilter}
                      onChange={(event) => setSubmissionFilter(event.target.value as 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED')}
                      className="rounded-xl border border-zinc-800 bg-black px-4 py-2 text-sm text-white"
                    >
                      <option value="ALL">All statuses</option>
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                  <div className="mt-6 space-y-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {submissionsResource.isLoading ? <p className="text-zinc-500">Loading submissions...</p> : null}
                    {submissionsResource.error ? <p className="text-red-300">{submissionsResource.error}</p> : null}
                    {(submissionsResource.data ?? []).length === 0 ? <p className="text-zinc-500">No submissions yet.</p> : null}
                    {(submissionsResource.data ?? []).map((submission) => (
                      <article key={submission.id} className="rounded-xl border border-zinc-800 p-4 text-zinc-200">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="text-white">{submission.title}</p>
                            <p className="mt-1 text-sm text-zinc-500">
                              Artist: {submission.artist.user.name} · {submission.category?.name ?? 'Uncategorized'}
                            </p>
                          </div>
                          <span className={`text-xs uppercase tracking-[0.3em] ${submission.status === 'APPROVED' ? 'text-green-400' : submission.status === 'REJECTED' ? 'text-red-400' : 'text-amber-500'}`}>{submission.status}</span>
                        </div>
                        <p className="mt-3 text-sm text-zinc-400">{submission.description}</p>
                        {submission.status === 'PENDING' ? (
                          <div className="mt-4 space-y-3">
                            <input
                              value={reviewNotes[submission.id] ?? ''}
                              onChange={(event) => setReviewNotes((current) => ({ ...current, [submission.id]: event.target.value }))}
                              className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-2 text-sm"
                              placeholder="Optional review note (required for reject)"
                            />
                            <div className="flex flex-wrap gap-3">
                              <button
                                onClick={() => handleReviewSubmission(submission.id, 'APPROVE')}
                                className="rounded-lg bg-green-500 px-4 py-2 text-sm text-black"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReviewSubmission(submission.id, 'REJECT')}
                                className="rounded-lg bg-red-500 px-4 py-2 text-sm text-black"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="mt-3 text-sm text-zinc-500">
                            Reviewed by {submission.reviewedBy?.name ?? 'Unknown'}
                            {submission.reviewNote ? ` · Note: ${submission.reviewNote}` : ''}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
                <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
                  <h2 className="text-3xl text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Newsletter Subscribers</h2>
                  <div className="mt-6 space-y-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {newsletterResource.isLoading ? <p className="text-zinc-500">Loading subscribers...</p> : null}
                    {newsletterResource.error ? <p className="text-red-300">{newsletterResource.error}</p> : null}
                    {(newsletterResource.data ?? []).length === 0 ? <p className="text-zinc-500">No subscribers yet.</p> : null}
                    {(newsletterResource.data ?? []).map((subscriber) => (
                      <article key={subscriber.id} className="rounded-xl border border-zinc-800 p-4 text-zinc-200">
                        <p className="text-white">{subscriber.email}</p>
                        <p className="mt-1 text-sm text-zinc-500">Joined {new Date(subscriber.createdAt).toLocaleString()}</p>
                      </article>
                    ))}
                  </div>
                </section>
                <div className="grid gap-6 lg:grid-cols-2">
                  <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
                    <h2 className="text-3xl text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Create Article</h2>
                    <form onSubmit={handleCreateArticle} className="mt-6 space-y-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      <input
                        value={articleState.title}
                        onChange={(event) => setArticleState((current) => ({ ...current, title: event.target.value }))}
                        className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                        placeholder="Article title"
                        required
                      />
                      <textarea
                        value={articleState.content}
                        onChange={(event) => setArticleState((current) => ({ ...current, content: event.target.value }))}
                        className="min-h-32 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                        placeholder="Article content"
                        required
                      />
                      <div className="grid gap-4 md:grid-cols-2">
                        <select
                          value={articleState.categoryId}
                          onChange={(event) => setArticleState((current) => ({ ...current, categoryId: event.target.value }))}
                          className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                        >
                          <option value="">No category</option>
                          {articleCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <select
                          value={articleState.artistId}
                          onChange={(event) => setArticleState((current) => ({ ...current, artistId: event.target.value }))}
                          className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                        >
                          <option value="">No artist link</option>
                          {(artistsResource.data ?? []).map((artist) => (
                            <option key={artist.id} value={artist.id}>
                              {artist.user.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <input
                        value={articleState.publishedAt}
                        onChange={(event) => setArticleState((current) => ({ ...current, publishedAt: event.target.value }))}
                        className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                        type="datetime-local"
                      />
                      <button className="rounded-xl bg-white px-5 py-3 text-black">Create article</button>
                    </form>
                  </section>
                  <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
                    <h2 className="text-3xl text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Create Event</h2>
                    <form onSubmit={handleCreateEvent} className="mt-6 space-y-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      <input
                        value={eventState.title}
                        onChange={(event) => setEventState((current) => ({ ...current, title: event.target.value }))}
                        className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                        placeholder="Event title"
                        required
                      />
                      <textarea
                        value={eventState.description}
                        onChange={(event) => setEventState((current) => ({ ...current, description: event.target.value }))}
                        className="min-h-28 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                        placeholder="Event description"
                        required
                      />
                      <input
                        value={eventState.date}
                        onChange={(event) => setEventState((current) => ({ ...current, date: event.target.value }))}
                        className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                        type="datetime-local"
                        required
                      />
                      <div className="grid gap-4 md:grid-cols-2">
                        <input
                          value={eventState.city}
                          onChange={(event) => setEventState((current) => ({ ...current, city: event.target.value }))}
                          className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                          placeholder="City"
                          required
                        />
                        <input
                          value={eventState.location}
                          onChange={(event) => setEventState((current) => ({ ...current, location: event.target.value }))}
                          className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                          placeholder="Location"
                          required
                        />
                      </div>
                      <input
                        value={eventState.image}
                        onChange={(event) => setEventState((current) => ({ ...current, image: event.target.value }))}
                        className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                        placeholder="Optional image URL"
                      />
                      <button className="rounded-xl bg-white px-5 py-3 text-black">Create event</button>
                    </form>
                  </section>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
                    <h2 className="text-3xl text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Update Article</h2>
                    <form onSubmit={handleUpdateArticle} className="mt-6 space-y-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      <select
                        value={articleUpdateState.id}
                        onChange={(event) => setArticleUpdateState((current) => ({ ...current, id: event.target.value }))}
                        className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                        required
                      >
                        <option value="">Select article</option>
                        {(articlesResource.data ?? []).map((article) => (
                          <option key={article.id} value={article.id}>
                            {article.title}
                          </option>
                        ))}
                      </select>
                      <input
                        value={articleUpdateState.title}
                        onChange={(event) => setArticleUpdateState((current) => ({ ...current, title: event.target.value }))}
                        className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                        placeholder="New title (optional)"
                      />
                      <textarea
                        value={articleUpdateState.content}
                        onChange={(event) => setArticleUpdateState((current) => ({ ...current, content: event.target.value }))}
                        className="min-h-28 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                        placeholder="New content (optional)"
                      />
                      <button className="rounded-xl bg-white px-5 py-3 text-black">Update article</button>
                    </form>
                  </section>
                  <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
                    <h2 className="text-3xl text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Update Event</h2>
                    <form onSubmit={handleUpdateEvent} className="mt-6 space-y-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      <select
                        value={eventUpdateState.id}
                        onChange={(event) => setEventUpdateState((current) => ({ ...current, id: event.target.value }))}
                        className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                        required
                      >
                        <option value="">Select event</option>
                        {(eventsResource.data ?? []).map((event) => (
                          <option key={event.id} value={event.id}>
                            {event.title}
                          </option>
                        ))}
                      </select>
                      <input
                        value={eventUpdateState.title}
                        onChange={(event) => setEventUpdateState((current) => ({ ...current, title: event.target.value }))}
                        className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                        placeholder="New title (optional)"
                      />
                      <div className="grid gap-4 md:grid-cols-2">
                        <input
                          value={eventUpdateState.city}
                          onChange={(event) => setEventUpdateState((current) => ({ ...current, city: event.target.value }))}
                          className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                          placeholder="New city (optional)"
                        />
                        <input
                          value={eventUpdateState.location}
                          onChange={(event) => setEventUpdateState((current) => ({ ...current, location: event.target.value }))}
                          className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                          placeholder="New location (optional)"
                        />
                      </div>
                      <button className="rounded-xl bg-white px-5 py-3 text-black">Update event</button>
                    </form>
                  </section>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
                    <h2 className="text-3xl text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Create Artwork</h2>
                    <form onSubmit={handleCreateArtwork} className="mt-6 space-y-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      <select
                        value={artworkState.artistId}
                        onChange={(event) => setArtworkState((current) => ({ ...current, artistId: event.target.value }))}
                        className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                        required
                      >
                        <option value="">Select artist</option>
                        {(artistsResource.data ?? []).map((artist) => (
                          <option key={artist.id} value={artist.id}>{artist.user.name}</option>
                        ))}
                      </select>
                      <select
                        value={artworkState.categoryId}
                        onChange={(event) => setArtworkState((current) => ({ ...current, categoryId: event.target.value }))}
                        className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                      >
                        <option value="">No category</option>
                        {artworkCategories.map((category) => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                      <input
                        value={artworkState.title}
                        onChange={(event) => setArtworkState((current) => ({ ...current, title: event.target.value }))}
                        className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                        placeholder="Artwork title"
                        required
                      />
                      <input
                        value={artworkState.image}
                        onChange={(event) => setArtworkState((current) => ({ ...current, image: event.target.value }))}
                        className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                        placeholder="Artwork image URL"
                        required
                      />
                      <textarea
                        value={artworkState.description}
                        onChange={(event) => setArtworkState((current) => ({ ...current, description: event.target.value }))}
                        className="min-h-28 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                        placeholder="Artwork description"
                        required
                      />
                      <button className="rounded-xl bg-white px-5 py-3 text-black">Create artwork</button>
                    </form>
                  </section>
                  <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
                    <h2 className="text-3xl text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Update Artwork</h2>
                    <form onSubmit={handleUpdateArtwork} className="mt-6 space-y-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      <select
                        value={artworkUpdateState.id}
                        onChange={(event) => setArtworkUpdateState((current) => ({ ...current, id: event.target.value }))}
                        className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                        required
                      >
                        <option value="">Select artwork</option>
                        {(artworksResource.data ?? []).map((artwork) => (
                          <option key={artwork.id} value={artwork.id}>{artwork.title}</option>
                        ))}
                      </select>
                      <select
                        value={artworkUpdateState.artistId}
                        onChange={(event) => setArtworkUpdateState((current) => ({ ...current, artistId: event.target.value }))}
                        className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                      >
                        <option value="">Keep current artist</option>
                        {(artistsResource.data ?? []).map((artist) => (
                          <option key={artist.id} value={artist.id}>{artist.user.name}</option>
                        ))}
                      </select>
                      <select
                        value={artworkUpdateState.categoryId}
                        onChange={(event) => setArtworkUpdateState((current) => ({ ...current, categoryId: event.target.value }))}
                        className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                      >
                        <option value="">Remove / keep category (send null)</option>
                        {artworkCategories.map((category) => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                      <input
                        value={artworkUpdateState.title}
                        onChange={(event) => setArtworkUpdateState((current) => ({ ...current, title: event.target.value }))}
                        className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                        placeholder="New title (optional)"
                      />
                      <input
                        value={artworkUpdateState.image}
                        onChange={(event) => setArtworkUpdateState((current) => ({ ...current, image: event.target.value }))}
                        className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                        placeholder="New image URL (optional)"
                      />
                      <textarea
                        value={artworkUpdateState.description}
                        onChange={(event) => setArtworkUpdateState((current) => ({ ...current, description: event.target.value }))}
                        className="min-h-28 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
                        placeholder="New description (optional)"
                      />
                      <button className="rounded-xl bg-white px-5 py-3 text-black">Update artwork</button>
                    </form>
                  </section>
                </div>
                {submitMessage ? (
                  <p className="text-green-300" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{submitMessage}</p>
                ) : null}
                {submitError ? (
                  <p className="text-red-300" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{submitError}</p>
                ) : null}
              </div>
            ) : null}
          </AsyncState>
        </div>
      </section>
    </>
  )
}
