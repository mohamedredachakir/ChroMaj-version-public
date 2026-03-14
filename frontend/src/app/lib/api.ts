import type {
  Article,
  ArticleComment,
  ArticleLikeState,
  Artist,
  Artwork,
  ArtworkSubmission,
  ArtworkSubmissionStatus,
  AuthResponse,
  AuthUser,
  Category,
  DashboardSummary,
  EventItem,
  NewsletterSubscription,
  PaginatedResponse,
  UserRole,
} from './types'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: 'Request failed.' }))

    if (response.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('chromag:unauthorized'))
    }

    throw new ApiError(body.message ?? 'Request failed.', response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const responseContentType = response.headers.get('content-type')
  if (!responseContentType?.includes('application/json')) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export function fetchArticles() {
  return request<Article[]>('/articles')
}

export function fetchArticlesQuery(params: { q?: string; page?: number; limit?: number; categoryId?: string; sort?: 'latest' | 'oldest' }) {
  const searchParams = new URLSearchParams()
  if (params.q) searchParams.set('q', params.q)
  if (params.page) searchParams.set('page', String(params.page))
  if (params.limit) searchParams.set('limit', String(params.limit))
  if (params.categoryId) searchParams.set('categoryId', params.categoryId)
  if (params.sort) searchParams.set('sort', params.sort)

  return request<PaginatedResponse<Article>>(`/articles/query?${searchParams.toString()}`)
}

export function fetchArtists() {
  return request<Artist[]>('/artists')
}

export function fetchArtistsQuery(params: { q?: string; page?: number; limit?: number; role?: UserRole; sort?: 'newest' | 'oldest' }) {
  const searchParams = new URLSearchParams()
  if (params.q) searchParams.set('q', params.q)
  if (params.page) searchParams.set('page', String(params.page))
  if (params.limit) searchParams.set('limit', String(params.limit))
  if (params.role) searchParams.set('role', params.role)
  if (params.sort) searchParams.set('sort', params.sort)

  return request<PaginatedResponse<Artist>>(`/artists/query?${searchParams.toString()}`)
}

export function fetchArticleById(id: string) {
  return request<Article>(`/articles/${id}`)
}

export function fetchArticleComments(id: string) {
  return request<ArticleComment[]>(`/articles/${id}/comments`)
}

export function createArticleComment(token: string, id: string, payload: { content: string }) {
  return request<ArticleComment>(`/articles/${id}/comments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
}

export async function deleteComment(token: string, id: string) {
  await request<void>(`/comments/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export function fetchMyLikeState(token: string, articleId: string) {
  return request<ArticleLikeState>(`/articles/${articleId}/likes/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export function toggleArticleLike(token: string, articleId: string) {
  return request<ArticleLikeState>(`/articles/${articleId}/likes/toggle`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export function fetchArtistById(id: string) {
  return request<Artist>(`/artists/${id}`)
}

export function fetchArtworks() {
  return request<Artwork[]>('/artworks')
}

export function fetchEvents() {
  return request<EventItem[]>('/events')
}

export function fetchEventsQuery(params: { q?: string; page?: number; limit?: number; city?: string; sort?: 'soonest' | 'latest' }) {
  const searchParams = new URLSearchParams()
  if (params.q) searchParams.set('q', params.q)
  if (params.page) searchParams.set('page', String(params.page))
  if (params.limit) searchParams.set('limit', String(params.limit))
  if (params.city) searchParams.set('city', params.city)
  if (params.sort) searchParams.set('sort', params.sort)

  return request<PaginatedResponse<EventItem>>(`/events/query?${searchParams.toString()}`)
}

export function fetchEventById(id: string) {
  return request<EventItem>(`/events/${id}`)
}

export function login(payload: { email: string; password: string }) {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function register(payload: {
  name: string
  email: string
  password: string
  role?: 'ARTIST' | 'USER'
  bio?: string
}) {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function fetchCurrentUser(token: string) {
  return request<{ user: AuthUser }>('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export function fetchDashboardSummary(token: string) {
  return request<DashboardSummary>('/dashboard/summary', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export function subscribeToNewsletter(payload: { email: string }) {
  return request<NewsletterSubscription>('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function fetchNewsletterSubscribers(token: string) {
  return request<NewsletterSubscription[]>('/admin/newsletter/subscribers', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export function fetchCategories() {
  return request<Category[]>('/categories')
}

export function createArticle(
  token: string,
  payload: {
    title: string
    content: string
    categoryId?: string
    artistId?: string
    publishedAt?: string
  },
) {
  return request<Article>('/admin/articles', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
}

export function createEvent(
  token: string,
  payload: {
    title: string
    description: string
    date: string
    city: string
    location: string
    image?: string
  },
) {
  return request<EventItem>('/admin/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
}

export function updateArticle(
  token: string,
  id: string,
  payload: {
    title?: string
    content?: string
    categoryId?: string | null
    artistId?: string | null
    publishedAt?: string | null
  },
) {
  return request<Article>(`/admin/articles/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
}

export async function deleteArticle(token: string, id: string) {
  await request<void>(`/admin/articles/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export function updateEvent(
  token: string,
  id: string,
  payload: {
    title?: string
    description?: string
    date?: string
    city?: string
    location?: string
    image?: string | null
  },
) {
  return request<EventItem>(`/admin/events/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
}

export async function deleteEvent(token: string, id: string) {
  await request<void>(`/admin/events/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export function createArtwork(
  token: string,
  payload: {
    artistId: string
    categoryId?: string
    title: string
    image: string
    description: string
  },
) {
  return request<Artwork>('/admin/artworks', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
}

export function updateArtwork(
  token: string,
  id: string,
  payload: {
    artistId?: string
    categoryId?: string | null
    title?: string
    image?: string
    description?: string
  },
) {
  return request<Artwork>(`/admin/artworks/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
}

export async function deleteArtwork(token: string, id: string) {
  await request<void>(`/admin/artworks/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export function createArtworkSubmission(
  token: string,
  payload: {
    title: string
    image: string
    description: string
    categoryId?: string
  },
) {
  return request<ArtworkSubmission>('/submissions/artworks', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
}

export function fetchMyArtworkSubmissions(token: string) {
  return request<ArtworkSubmission[]>('/submissions/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export function fetchAdminArtworkSubmissions(token: string, status?: ArtworkSubmissionStatus) {
  const searchParams = new URLSearchParams()
  if (status) searchParams.set('status', status)

  return request<ArtworkSubmission[]>(`/admin/submissions?${searchParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export function reviewArtworkSubmission(
  token: string,
  id: string,
  payload: {
    action: 'APPROVE' | 'REJECT'
    reviewNote?: string
  },
) {
  return request<ArtworkSubmission>(`/admin/submissions/${id}/review`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
}
