import { type FormEvent, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Link, useParams } from 'react-router-dom'
import {
  createArticleComment,
  deleteComment,
  fetchArticleById,
  fetchArticleComments,
  fetchMyLikeState,
  toggleArticleLike,
} from '../lib/api'
import { useApiResource } from '../lib/useApiResource'
import { AsyncState } from '../components/shared/AsyncState'
import { useAuth } from '../auth/AuthProvider'

export function StoryDetailPage() {
  const { token, user, isAuthenticated } = useAuth()
  const params = useParams<{ id: string }>()
  const articleId = params.id ?? ''
  const [commentsReloadKey, setCommentsReloadKey] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [commentError, setCommentError] = useState<string | null>(null)
  const [commentMessage, setCommentMessage] = useState<string | null>(null)
  const [likeState, setLikeState] = useState<{ liked: boolean; likesCount: number } | null>(null)
  const [likeError, setLikeError] = useState<string | null>(null)

  const { data, error, isLoading } = useApiResource(
    () => fetchArticleById(articleId),
    [articleId],
  )
  const commentsResource = useApiResource(
    () => fetchArticleComments(articleId),
    [articleId, commentsReloadKey],
  )

  useEffect(() => {
    if (!data) {
      return
    }

    setLikeState({
      liked: false,
      likesCount: data._count?.likes ?? 0,
    })
  }, [data])

  useEffect(() => {
    if (!isAuthenticated || !token || !articleId) {
      return
    }

    fetchMyLikeState(token, articleId)
      .then((state) => {
        setLikeState(state)
      })
      .catch(() => {
        // Keep public like count fallback from article payload.
      })
  }, [isAuthenticated, token, articleId])

  async function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!token) {
      return
    }

    setCommentError(null)
    setCommentMessage(null)

    try {
      await createArticleComment(token, articleId, { content: newComment })
      setNewComment('')
      setCommentMessage('Comment posted.')
      setCommentsReloadKey((current) => current + 1)
    } catch (submitError) {
      setCommentError(submitError instanceof Error ? submitError.message : 'Failed to post comment.')
    }
  }

  async function handleDeleteComment(commentId: string) {
    if (!token) {
      return
    }

    setCommentError(null)
    setCommentMessage(null)

    try {
      await deleteComment(token, commentId)
      setCommentMessage('Comment deleted.')
      setCommentsReloadKey((current) => current + 1)
    } catch (deleteError) {
      setCommentError(deleteError instanceof Error ? deleteError.message : 'Failed to delete comment.')
    }
  }

  async function handleToggleLike() {
    if (!token) {
      return
    }

    setLikeError(null)

    try {
      const nextState = await toggleArticleLike(token, articleId)
      setLikeState(nextState)
    } catch (toggleError) {
      setLikeError(toggleError instanceof Error ? toggleError.message : 'Failed to update like.')
    }
  }

  return (
    <main className="px-6 pb-16 pt-32">
      <div className="mx-auto max-w-5xl">
        <Link to="/stories" className="text-sm text-amber-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Back to stories
        </Link>
        <div className="mt-6">
          <AsyncState isLoading={isLoading} error={error} empty={!data}>
            {data ? (
              <article className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 text-white md:p-12">
                <p className="text-xs uppercase tracking-[0.35em] text-amber-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {data.category?.name ?? 'Editorial'}
                </p>
                <h1 className="mt-5 text-5xl leading-[0.95] md:text-7xl" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  {data.title}
                </h1>
                <div className="mt-6 flex flex-wrap gap-5 text-sm text-zinc-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  <span>By {data.author.name}</span>
                  <span>{format(new Date(data.publishedAt ?? data.createdAt), 'dd MMM yyyy')}</span>
                  {data.artist ? <span>Artist: {data.artist.user.name}</span> : null}
                </div>
                <p className="mt-10 whitespace-pre-wrap text-lg text-zinc-300" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {data.content}
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  <span className="text-sm text-zinc-400">{likeState?.likesCount ?? 0} likes</span>
                  {isAuthenticated ? (
                    <button
                      onClick={handleToggleLike}
                      className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-white"
                    >
                      {likeState?.liked ? 'Unlike' : 'Like'}
                    </button>
                  ) : (
                    <Link to="/auth" className="text-sm text-amber-500 underline underline-offset-4">
                      Sign in to like
                    </Link>
                  )}
                  {likeError ? <p className="text-sm text-red-300">{likeError}</p> : null}
                </div>

                <section className="mt-12 border-t border-zinc-800 pt-8">
                  <h2 className="text-4xl text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    Comments
                  </h2>

                  {isAuthenticated ? (
                    <form onSubmit={handleCommentSubmit} className="mt-6 space-y-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      <textarea
                        value={newComment}
                        onChange={(event) => setNewComment(event.target.value)}
                        className="min-h-24 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-white"
                        placeholder="Share your thoughts"
                        required
                      />
                      <button className="rounded-lg bg-white px-4 py-2 text-sm text-black">Post comment</button>
                    </form>
                  ) : (
                    <p className="mt-4 text-zinc-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      <Link to="/auth" className="text-amber-500 underline underline-offset-4">Sign in</Link> to join the conversation.
                    </p>
                  )}

                  {commentMessage ? <p className="mt-3 text-sm text-green-300">{commentMessage}</p> : null}
                  {commentError ? <p className="mt-3 text-sm text-red-300">{commentError}</p> : null}

                  <div className="mt-6 space-y-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {commentsResource.isLoading ? <p className="text-zinc-500">Loading comments...</p> : null}
                    {commentsResource.error ? <p className="text-red-300">{commentsResource.error}</p> : null}
                    {(commentsResource.data ?? []).length === 0 ? <p className="text-zinc-500">No comments yet.</p> : null}
                    {(commentsResource.data ?? []).map((comment) => (
                      <article key={comment.id} className="rounded-xl border border-zinc-800 p-4 text-zinc-200">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="text-sm text-zinc-400">
                            {comment.user.name} · {format(new Date(comment.createdAt), 'dd MMM yyyy, HH:mm')}
                          </p>
                          {isAuthenticated && (comment.userId === user?.id || user?.role === 'ADMIN') ? (
                            <button
                              type="button"
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-xs text-red-300 underline underline-offset-2"
                            >
                              Delete
                            </button>
                          ) : null}
                        </div>
                        <p className="mt-3 text-zinc-200">{comment.content}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </article>
            ) : null}
          </AsyncState>
        </div>
      </div>
    </main>
  )
}
