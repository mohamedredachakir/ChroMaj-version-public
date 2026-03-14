import { format } from 'date-fns'
import { Link, useParams } from 'react-router-dom'
import { fetchArtistById } from '../lib/api'
import { useApiResource } from '../lib/useApiResource'
import { AsyncState } from '../components/shared/AsyncState'

export function ArtistDetailPage() {
  const params = useParams<{ id: string }>()
  const artistId = params.id ?? ''
  const { data, error, isLoading } = useApiResource(
    () => fetchArtistById(artistId),
    [artistId],
  )

  return (
    <main className="px-6 pb-16 pt-32">
      <div className="mx-auto max-w-6xl">
        <Link to="/artists" className="text-sm text-amber-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Back to artists
        </Link>
        <div className="mt-6">
          <AsyncState isLoading={isLoading} error={error} empty={!data}>
            {data ? (
              <div className="space-y-8">
                <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 text-white md:p-12">
                  <p className="text-xs uppercase tracking-[0.35em] text-amber-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {data.user.role}
                  </p>
                  <h1 className="mt-5 text-5xl leading-[0.95] md:text-7xl" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    {data.user.name}
                  </h1>
                  <p className="mt-6 text-zinc-300" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {data.bio}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-6 text-sm text-zinc-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <span>Articles: {data.articles.length}</span>
                    <span>Artworks: {data.artworks.length}</span>
                    <span>Joined: {format(new Date(data.user.createdAt), 'dd MMM yyyy')}</span>
                  </div>
                </section>
                <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
                  <h2 className="text-4xl text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Articles</h2>
                  <div className="mt-6 space-y-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {data.articles.length === 0 ? <p className="text-zinc-500">No articles yet.</p> : null}
                    {data.articles.map((article) => (
                      <Link key={article.id} to={`/stories/${article.id}`} className="block rounded-xl border border-zinc-800 p-4 text-zinc-200 hover:border-amber-500">
                        <p className="text-white">{article.title}</p>
                        <p className="mt-1 text-sm text-zinc-500">{format(new Date(article.publishedAt ?? article.createdAt), 'dd MMM yyyy')}</p>
                      </Link>
                    ))}
                  </div>
                </section>
                <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
                  <h2 className="text-4xl text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Artworks</h2>
                  <div className="mt-6 grid gap-4 md:grid-cols-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {data.artworks.length === 0 ? <p className="text-zinc-500">No artworks yet.</p> : null}
                    {data.artworks.map((artwork) => (
                      <article key={artwork.id} className="rounded-xl border border-zinc-800 p-4 text-zinc-200">
                        <p className="text-white">{artwork.title}</p>
                        <p className="mt-1 text-sm text-zinc-500">{artwork.category?.name ?? 'Uncategorized'}</p>
                        <p className="mt-3 text-sm text-zinc-400">{artwork.description}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            ) : null}
          </AsyncState>
        </div>
      </div>
    </main>
  )
}
