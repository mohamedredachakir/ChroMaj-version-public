export type UserRole = 'ADMIN' | 'ARTIST' | 'USER'
export type ArtworkSubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface ArtistProfileSummary {
  id: string
  userId: string
  bio: string
  avatar: string | null
  website: string | null
  instagram: string | null
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  artist: ArtistProfileSummary | null
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export interface Article {
  id: string
  title: string
  content: string
  publishedAt: string | null
  createdAt: string
  author: {
    id: string
    name: string
    role: UserRole
  }
  artist: (ArtistProfileSummary & {
    user: {
      name: string
    }
  }) | null
  category: {
    id: string
    name: string
    type: 'ARTICLE' | 'ARTWORK' | 'EVENT'
  } | null
  _count?: {
    comments: number
    likes: number
  }
}

export interface ArticleComment {
  id: string
  articleId: string
  userId: string
  content: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    role: UserRole
  }
}

export interface ArticleLikeState {
  liked: boolean
  likesCount: number
}

export interface Artwork {
  id: string
  title: string
  image: string
  description: string
  createdAt: string
  artist: ArtistProfileSummary & {
    user: {
      name: string
    }
  }
  category: {
    id: string
    name: string
    type: 'ARTICLE' | 'ARTWORK' | 'EVENT'
  } | null
}

export interface Artist {
  id: string
  user: {
    id: string
    name: string
    email: string
    role: UserRole
    createdAt: string
  }
  bio: string
  avatar: string | null
  website: string | null
  instagram: string | null
  artworks: Array<{
    id: string
    title: string
    image: string
    description: string
    createdAt: string
    category: {
      id: string
      name: string
      type: 'ARTICLE' | 'ARTWORK' | 'EVENT'
    } | null
  }>
  articles: Array<{
    id: string
    title: string
    publishedAt: string | null
    createdAt: string
  }>
}

export interface EventItem {
  id: string
  title: string
  description: string
  date: string
  city: string
  location: string
  image: string | null
}

export interface ArtworkSubmission {
  id: string
  artistId: string
  categoryId: string | null
  title: string
  image: string
  description: string
  status: ArtworkSubmissionStatus
  reviewNote: string | null
  reviewedAt: string | null
  reviewedById: string | null
  approvedArtworkId: string | null
  createdAt: string
  updatedAt: string
  category: Category | null
  approvedArtwork: Artwork | null
  reviewedBy: {
    id: string
    name: string
    email: string
    role: UserRole
  } | null
  artist: {
    id: string
    user: {
      id: string
      name: string
      email: string
      role: UserRole
    }
  }
}

export interface NewsletterSubscription {
  id: string
  email: string
  createdAt: string
}

export interface DashboardSummary {
  totals: {
    articles: number
    artists: number
    artworks: number
    events: number
    users: number
    submissions: number
    subscribers: number
  }
  latest: {
    articles: Article[]
    artists: Artist[]
    events: EventItem[]
    submissions: ArtworkSubmission[]
    subscribers: NewsletterSubscription[]
  }
}

export interface Category {
  id: string
  name: string
  type: 'ARTICLE' | 'ARTWORK' | 'EVENT'
}

export interface PaginationMeta {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: PaginationMeta
}
