import { Router, type NextFunction, type Request, type Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { env } from '../config/env.js'
import { prisma } from '../lib/prisma.js'

const userRoles = ['ADMIN', 'ARTIST', 'USER'] as const
const publicRegisterRoles = ['ARTIST', 'USER'] as const
const submissionStatuses = ['PENDING', 'APPROVED', 'REJECTED'] as const

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  bio: z.string().min(10).optional(),
  role: z.enum(publicRegisterRoles).optional(),
}).superRefine((payload, context) => {
  if (payload.role === 'ARTIST' && !payload.bio) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['bio'],
      message: 'Artist registration requires a bio.',
    })
  }
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const createArticleSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(20),
  categoryId: z.string().optional(),
  artistId: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
})

const createEventSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  date: z.string().datetime(),
  city: z.string().min(2),
  location: z.string().min(2),
  image: z.string().url().optional(),
})

const createArtworkSchema = z.object({
  artistId: z.string(),
  categoryId: z.string().optional(),
  title: z.string().min(3),
  image: z.string().url(),
  description: z.string().min(20),
})

const createArtworkSubmissionSchema = z.object({
  title: z.string().min(3),
  image: z.string().url(),
  description: z.string().min(20),
  categoryId: z.string().optional(),
})

const reviewSubmissionSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT']),
  reviewNote: z.string().trim().optional(),
}).superRefine((payload, context) => {
  if (payload.action === 'REJECT' && !payload.reviewNote) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['reviewNote'],
      message: 'A review note is required when rejecting a submission.',
    })
  }
})

const createCommentSchema = z.object({
  content: z.string().trim().min(2).max(1000),
})

const newsletterSubscriptionSchema = z.object({
  email: z.string().trim().email(),
})

const updateArticleSchema = z.object({
  title: z.string().min(5).optional(),
  content: z.string().min(20).optional(),
  categoryId: z.string().nullable().optional(),
  artistId: z.string().nullable().optional(),
  publishedAt: z.string().datetime().nullable().optional(),
})

const updateEventSchema = z.object({
  title: z.string().min(5).optional(),
  description: z.string().min(20).optional(),
  date: z.string().datetime().optional(),
  city: z.string().min(2).optional(),
  location: z.string().min(2).optional(),
  image: z.string().url().nullable().optional(),
})

const updateArtworkSchema = z.object({
  artistId: z.string().optional(),
  categoryId: z.string().nullable().optional(),
  title: z.string().min(3).optional(),
  image: z.string().url().optional(),
  description: z.string().min(20).optional(),
})

const listQuerySchema = z.object({
  q: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(6),
})

const articlesQuerySchema = listQuerySchema.extend({
  categoryId: z.string().optional(),
  sort: z.enum(['latest', 'oldest']).default('latest'),
})

const artistsQuerySchema = listQuerySchema.extend({
  role: z.enum(userRoles).optional(),
  sort: z.enum(['newest', 'oldest']).default('newest'),
})

const eventsQuerySchema = listQuerySchema.extend({
  city: z.string().trim().optional(),
  sort: z.enum(['soonest', 'latest']).default('soonest'),
})

const adminSubmissionsQuerySchema = z.object({
  status: z.enum(submissionStatuses).optional(),
})

type AuthClaims = {
  sub: string
  role: (typeof userRoles)[number]
}

const router = Router()

function getBearerToken(request: Request) {
  const authorizationHeader = request.headers.authorization

  if (!authorizationHeader?.startsWith('Bearer ')) {
    return null
  }

  return authorizationHeader.slice(7)
}

function getRouteId(rawId: unknown) {
  return z.string().min(1).parse(rawId)
}

function requireAuth(request: Request, response: Response, next: NextFunction) {
  const token = getBearerToken(request)

  if (!token) {
    return response.status(401).json({ message: 'Authentication required.' })
  }

  try {
    response.locals.auth = jwt.verify(token, env.JWT_SECRET) as AuthClaims
    return next()
  } catch {
    return response.status(401).json({ message: 'Invalid token.' })
  }
}

function requireAdmin(request: Request, response: Response, next: NextFunction) {
  requireAuth(request, response, () => {
    const claims = response.locals.auth as AuthClaims

    if (claims.role !== 'ADMIN') {
      return response.status(403).json({ message: 'Admin access required.' })
    }

    return next()
  })
}

function requireArtist(request: Request, response: Response, next: NextFunction) {
  requireAuth(request, response, () => {
    const claims = response.locals.auth as AuthClaims

    if (claims.role !== 'ARTIST') {
      return response.status(403).json({ message: 'Artist access required.' })
    }

    return next()
  })
}

router.get('/health', async (_request, response) => {
  await prisma.$queryRaw`SELECT 1`

  response.json({
    status: 'ok',
    service: 'chromag-api',
    timestamp: new Date().toISOString(),
  })
})

router.get('/meta/stack', (_request, response) => {
  response.json({
    product: 'ChroMag',
    frontend: 'React + Vite + Tailwind CSS',
    backend: 'Express + Prisma + PostgreSQL',
    features: [
      'JWT authentication',
      'Articles',
      'Artists',
      'Artworks',
      'Events',
      'Admin-ready data model',
    ],
  })
})

router.post('/auth/register', async (request, response) => {
  const payload = registerSchema.parse(request.body)
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  })

  if (existingUser) {
    return response.status(409).json({ message: 'Email already exists.' })
  }

  const passwordHash = await bcrypt.hash(payload.password, 10)
  const role = payload.role ?? 'USER'

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      passwordHash,
      role,
      artist: role === 'ARTIST' && payload.bio
        ? {
            create: {
              bio: payload.bio,
            },
          }
        : undefined,
    },
    include: {
      artist: true,
    },
  })

  const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: '1d',
  })

  return response.status(201).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      artist: user.artist,
    },
  })
})

router.post('/auth/login', async (request, response) => {
  const payload = loginSchema.parse(request.body)
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
    include: {
      artist: true,
    },
  })

  if (!user) {
    return response.status(401).json({ message: 'Invalid credentials.' })
  }

  const isValidPassword = await bcrypt.compare(payload.password, user.passwordHash)

  if (!isValidPassword) {
    return response.status(401).json({ message: 'Invalid credentials.' })
  }

  const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: '1d',
  })

  return response.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      artist: user.artist,
    },
  })
})

router.get('/auth/me', requireAuth, async (_request, response) => {
  const claims = response.locals.auth as AuthClaims
  const user = await prisma.user.findUnique({
    where: { id: claims.sub },
    include: {
      artist: true,
    },
  })

  if (!user) {
    return response.status(404).json({ message: 'User not found.' })
  }

  return response.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      artist: user.artist,
    },
  })
})

router.get('/articles', async (_request, response) => {
  const articles = await prisma.article.findMany({
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
      artist: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      category: true,
    },
  })

  response.json(articles)
})

router.get('/articles/query', async (request, response) => {
  const query = articlesQuerySchema.parse(request.query)
  const skip = (query.page - 1) * query.limit

  const whereClause = {
    ...(query.categoryId ? { categoryId: query.categoryId } : {}),
    ...(query.q
      ? {
          OR: [
            { title: { contains: query.q, mode: 'insensitive' as const } },
            { content: { contains: query.q, mode: 'insensitive' as const } },
            { author: { name: { contains: query.q, mode: 'insensitive' as const } } },
            { artist: { user: { name: { contains: query.q, mode: 'insensitive' as const } } } },
          ],
        }
      : {}),
  }

  const [items, totalItems] = await Promise.all([
    prisma.article.findMany({
      where: whereClause,
      skip,
      take: query.limit,
      orderBy: query.sort === 'oldest'
        ? [{ publishedAt: 'asc' }, { createdAt: 'asc' }]
        : [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        artist: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        category: true,
      },
    }),
    prisma.article.count({ where: whereClause }),
  ])

  const totalPages = Math.max(1, Math.ceil(totalItems / query.limit))

  response.json({
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      totalItems,
      totalPages,
      hasNext: query.page < totalPages,
      hasPrevious: query.page > 1,
    },
  })
})

router.get('/articles/:id', async (request, response) => {
  const article = await prisma.article.findUnique({
    where: { id: getRouteId(request.params.id) },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
      artist: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      category: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
  })

  if (!article) {
    return response.status(404).json({ message: 'Article not found.' })
  }

  return response.json(article)
})

router.get('/articles/:id/comments', async (request, response) => {
  const articleId = getRouteId(request.params.id)
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { id: true },
  })

  if (!article) {
    return response.status(404).json({ message: 'Article not found.' })
  }

  const comments = await prisma.comment.findMany({
    where: { articleId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  })

  return response.json(comments)
})

router.post('/articles/:id/comments', requireAuth, async (request, response) => {
  const claims = response.locals.auth as AuthClaims
  const articleId = getRouteId(request.params.id)
  const payload = createCommentSchema.parse(request.body)

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { id: true },
  })

  if (!article) {
    return response.status(404).json({ message: 'Article not found.' })
  }

  const comment = await prisma.comment.create({
    data: {
      articleId,
      userId: claims.sub,
      content: payload.content,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  })

  return response.status(201).json(comment)
})

router.delete('/comments/:id', requireAuth, async (request, response) => {
  const claims = response.locals.auth as AuthClaims
  const commentId = getRouteId(request.params.id)

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  })

  if (!comment) {
    return response.status(404).json({ message: 'Comment not found.' })
  }

  if (claims.role !== 'ADMIN' && comment.userId !== claims.sub) {
    return response.status(403).json({ message: 'Not allowed to delete this comment.' })
  }

  await prisma.comment.delete({
    where: { id: commentId },
  })

  return response.status(204).send()
})

router.get('/articles/:id/likes/me', requireAuth, async (request, response) => {
  const claims = response.locals.auth as AuthClaims
  const articleId = getRouteId(request.params.id)

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { id: true },
  })

  if (!article) {
    return response.status(404).json({ message: 'Article not found.' })
  }

  const existingLike = await prisma.articleLike.findUnique({
    where: {
      articleId_userId: {
        articleId,
        userId: claims.sub,
      },
    },
  })

  const likesCount = await prisma.articleLike.count({
    where: { articleId },
  })

  return response.json({
    liked: Boolean(existingLike),
    likesCount,
  })
})

router.post('/articles/:id/likes/toggle', requireAuth, async (request, response) => {
  const claims = response.locals.auth as AuthClaims
  const articleId = getRouteId(request.params.id)

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { id: true },
  })

  if (!article) {
    return response.status(404).json({ message: 'Article not found.' })
  }

  const existingLike = await prisma.articleLike.findUnique({
    where: {
      articleId_userId: {
        articleId,
        userId: claims.sub,
      },
    },
  })

  if (existingLike) {
    await prisma.articleLike.delete({
      where: {
        articleId_userId: {
          articleId,
          userId: claims.sub,
        },
      },
    })
  } else {
    await prisma.articleLike.create({
      data: {
        articleId,
        userId: claims.sub,
      },
    })
  }

  const likesCount = await prisma.articleLike.count({
    where: { articleId },
  })

  return response.json({
    liked: !existingLike,
    likesCount,
  })
})

router.post('/newsletter/subscribe', async (request, response) => {
  const payload = newsletterSubscriptionSchema.parse(request.body)

  const subscription = await prisma.newsletterSubscription.upsert({
    where: { email: payload.email },
    update: {},
    create: {
      email: payload.email,
    },
  })

  return response.status(201).json(subscription)
})

router.get('/admin/newsletter/subscribers', requireAdmin, async (_request, response) => {
  const subscribers = await prisma.newsletterSubscription.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return response.json(subscribers)
})

router.post('/admin/articles', requireAdmin, async (request, response) => {
  const claims = response.locals.auth as AuthClaims
  const payload = createArticleSchema.parse(request.body)

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    })

    if (!category || category.type !== 'ARTICLE') {
      return response.status(400).json({ message: 'Invalid article category.' })
    }
  }

  if (payload.artistId) {
    const artist = await prisma.artist.findUnique({
      where: { id: payload.artistId },
    })

    if (!artist) {
      return response.status(400).json({ message: 'Invalid artist.' })
    }
  }

  const article = await prisma.article.create({
    data: {
      title: payload.title,
      content: payload.content,
      authorId: claims.sub,
      artistId: payload.artistId,
      categoryId: payload.categoryId,
      publishedAt: payload.publishedAt ? new Date(payload.publishedAt) : null,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
      artist: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      category: true,
    },
  })

  return response.status(201).json(article)
})

router.put('/admin/articles/:id', requireAdmin, async (request, response) => {
  const payload = updateArticleSchema.parse(request.body)

  const existingArticle = await prisma.article.findUnique({
    where: { id: getRouteId(request.params.id) },
  })

  if (!existingArticle) {
    return response.status(404).json({ message: 'Article not found.' })
  }

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    })

    if (!category || category.type !== 'ARTICLE') {
      return response.status(400).json({ message: 'Invalid article category.' })
    }
  }

  if (payload.artistId) {
    const artist = await prisma.artist.findUnique({
      where: { id: payload.artistId },
    })

    if (!artist) {
      return response.status(400).json({ message: 'Invalid artist.' })
    }
  }

  const article = await prisma.article.update({
    where: { id: getRouteId(request.params.id) },
    data: {
      title: payload.title,
      content: payload.content,
      categoryId: payload.categoryId,
      artistId: payload.artistId,
      publishedAt: payload.publishedAt === null ? null : payload.publishedAt ? new Date(payload.publishedAt) : undefined,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
      artist: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      category: true,
    },
  })

  return response.json(article)
})

router.delete('/admin/articles/:id', requireAdmin, async (request, response) => {
  const existingArticle = await prisma.article.findUnique({
    where: { id: getRouteId(request.params.id) },
  })

  if (!existingArticle) {
    return response.status(404).json({ message: 'Article not found.' })
  }

  await prisma.article.delete({
    where: { id: getRouteId(request.params.id) },
  })

  return response.status(204).send()
})

router.get('/artists', async (_request, response) => {
  const artists = await prisma.artist.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      },
      artworks: true,
      articles: true,
    },
  })

  response.json(artists)
})

router.get('/artists/query', async (request, response) => {
  const query = artistsQuerySchema.parse(request.query)
  const skip = (query.page - 1) * query.limit

  const whereClause = {
    ...(query.role ? { user: { role: query.role } } : {}),
    ...(query.q
      ? {
          OR: [
            { bio: { contains: query.q, mode: 'insensitive' as const } },
            { instagram: { contains: query.q, mode: 'insensitive' as const } },
            { user: { name: { contains: query.q, mode: 'insensitive' as const } } },
          ],
        }
      : {}),
  }

  const [items, totalItems] = await Promise.all([
    prisma.artist.findMany({
      where: whereClause,
      skip,
      take: query.limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
        artworks: true,
        articles: true,
      },
      orderBy: {
        user: {
          createdAt: query.sort === 'oldest' ? 'asc' : 'desc',
        },
      },
    }),
    prisma.artist.count({ where: whereClause }),
  ])

  const totalPages = Math.max(1, Math.ceil(totalItems / query.limit))

  response.json({
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      totalItems,
      totalPages,
      hasNext: query.page < totalPages,
      hasPrevious: query.page > 1,
    },
  })
})

router.get('/artists/:id', async (request, response) => {
  const artist = await prisma.artist.findUnique({
    where: { id: getRouteId(request.params.id) },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      },
      artworks: {
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      articles: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
          category: true,
        },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      },
    },
  })

  if (!artist) {
    return response.status(404).json({ message: 'Artist not found.' })
  }

  return response.json(artist)
})

router.get('/artworks', async (_request, response) => {
  const artworks = await prisma.artwork.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      artist: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      category: true,
    },
  })

  response.json(artworks)
})

router.post('/admin/artworks', requireAdmin, async (request, response) => {
  const payload = createArtworkSchema.parse(request.body)

  const artist = await prisma.artist.findUnique({
    where: { id: payload.artistId },
  })

  if (!artist) {
    return response.status(400).json({ message: 'Invalid artist.' })
  }

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    })

    if (!category || category.type !== 'ARTWORK') {
      return response.status(400).json({ message: 'Invalid artwork category.' })
    }
  }

  const artwork = await prisma.artwork.create({
    data: {
      artistId: payload.artistId,
      categoryId: payload.categoryId,
      title: payload.title,
      image: payload.image,
      description: payload.description,
    },
    include: {
      artist: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      category: true,
    },
  })

  return response.status(201).json(artwork)
})

router.put('/admin/artworks/:id', requireAdmin, async (request, response) => {
  const payload = updateArtworkSchema.parse(request.body)
  const artworkId = getRouteId(request.params.id)

  const existingArtwork = await prisma.artwork.findUnique({
    where: { id: artworkId },
  })

  if (!existingArtwork) {
    return response.status(404).json({ message: 'Artwork not found.' })
  }

  if (payload.artistId) {
    const artist = await prisma.artist.findUnique({
      where: { id: payload.artistId },
    })

    if (!artist) {
      return response.status(400).json({ message: 'Invalid artist.' })
    }
  }

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    })

    if (!category || category.type !== 'ARTWORK') {
      return response.status(400).json({ message: 'Invalid artwork category.' })
    }
  }

  const artwork = await prisma.artwork.update({
    where: { id: artworkId },
    data: {
      artistId: payload.artistId,
      categoryId: payload.categoryId,
      title: payload.title,
      image: payload.image,
      description: payload.description,
    },
    include: {
      artist: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      category: true,
    },
  })

  return response.json(artwork)
})

router.delete('/admin/artworks/:id', requireAdmin, async (request, response) => {
  const artworkId = getRouteId(request.params.id)
  const existingArtwork = await prisma.artwork.findUnique({
    where: { id: artworkId },
  })

  if (!existingArtwork) {
    return response.status(404).json({ message: 'Artwork not found.' })
  }

  await prisma.artwork.delete({
    where: { id: artworkId },
  })

  return response.status(204).send()
})

router.post('/submissions/artworks', requireArtist, async (request, response) => {
  const claims = response.locals.auth as AuthClaims
  const payload = createArtworkSubmissionSchema.parse(request.body)

  const artist = await prisma.artist.findUnique({
    where: { userId: claims.sub },
  })

  if (!artist) {
    return response.status(400).json({ message: 'Artist profile is missing.' })
  }

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    })

    if (!category || category.type !== 'ARTWORK') {
      return response.status(400).json({ message: 'Invalid artwork category.' })
    }
  }

  const submission = await prisma.artworkSubmission.create({
    data: {
      artistId: artist.id,
      categoryId: payload.categoryId,
      title: payload.title,
      image: payload.image,
      description: payload.description,
    },
    include: {
      category: true,
      approvedArtwork: {
        include: {
          category: true,
        },
      },
      reviewedBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      artist: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  })

  return response.status(201).json(submission)
})

router.get('/submissions/me', requireArtist, async (_request, response) => {
  const claims = response.locals.auth as AuthClaims
  const artist = await prisma.artist.findUnique({
    where: { userId: claims.sub },
  })

  if (!artist) {
    return response.status(400).json({ message: 'Artist profile is missing.' })
  }

  const submissions = await prisma.artworkSubmission.findMany({
    where: {
      artistId: artist.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      category: true,
      approvedArtwork: {
        include: {
          category: true,
        },
      },
      reviewedBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      artist: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  })

  return response.json(submissions)
})

router.get('/admin/submissions', requireAdmin, async (request, response) => {
  const query = adminSubmissionsQuerySchema.parse(request.query)

  const submissions = await prisma.artworkSubmission.findMany({
    where: {
      status: query.status,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      category: true,
      approvedArtwork: {
        include: {
          category: true,
        },
      },
      reviewedBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      artist: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  })

  return response.json(submissions)
})

router.patch('/admin/submissions/:id/review', requireAdmin, async (request, response) => {
  const claims = response.locals.auth as AuthClaims
  const payload = reviewSubmissionSchema.parse(request.body)
  const submissionId = getRouteId(request.params.id)

  const existingSubmission = await prisma.artworkSubmission.findUnique({
    where: { id: submissionId },
  })

  if (!existingSubmission) {
    return response.status(404).json({ message: 'Submission not found.' })
  }

  if (existingSubmission.status !== 'PENDING') {
    return response.status(409).json({ message: 'Submission has already been reviewed.' })
  }

  if (payload.action === 'APPROVE') {
    if (existingSubmission.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: existingSubmission.categoryId },
      })

      if (!category || category.type !== 'ARTWORK') {
        return response.status(400).json({ message: 'Invalid artwork category.' })
      }
    }

    const [artwork, submission] = await prisma.$transaction([
      prisma.artwork.create({
        data: {
          artistId: existingSubmission.artistId,
          categoryId: existingSubmission.categoryId,
          title: existingSubmission.title,
          image: existingSubmission.image,
          description: existingSubmission.description,
        },
      }),
      prisma.artworkSubmission.update({
        where: { id: submissionId },
        data: {
          status: 'APPROVED',
          reviewedAt: new Date(),
          reviewedById: claims.sub,
          reviewNote: payload.reviewNote,
        },
        include: {
          category: true,
          approvedArtwork: {
            include: {
              category: true,
            },
          },
          reviewedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          artist: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
        },
      }),
    ])

    const linkedSubmission = await prisma.artworkSubmission.update({
      where: { id: submission.id },
      data: {
        approvedArtworkId: artwork.id,
      },
      include: {
        category: true,
        approvedArtwork: {
          include: {
            category: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        artist: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    })

    return response.json(linkedSubmission)
  }

  const submission = await prisma.artworkSubmission.update({
    where: { id: submissionId },
    data: {
      status: 'REJECTED',
      reviewedAt: new Date(),
      reviewedById: claims.sub,
      reviewNote: payload.reviewNote,
    },
    include: {
      category: true,
      approvedArtwork: {
        include: {
          category: true,
        },
      },
      reviewedBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      artist: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  })

  return response.json(submission)
})

router.get('/events', async (_request, response) => {
  const events = await prisma.event.findMany({
    orderBy: {
      date: 'asc',
    },
  })

  response.json(events)
})

router.get('/events/query', async (request, response) => {
  const query = eventsQuerySchema.parse(request.query)
  const skip = (query.page - 1) * query.limit

  const whereClause = {
    ...(query.city
      ? {
          city: {
            contains: query.city,
            mode: 'insensitive' as const,
          },
        }
      : {}),
    ...(query.q
      ? {
          OR: [
            { title: { contains: query.q, mode: 'insensitive' as const } },
            { description: { contains: query.q, mode: 'insensitive' as const } },
            { location: { contains: query.q, mode: 'insensitive' as const } },
            { city: { contains: query.q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const [items, totalItems] = await Promise.all([
    prisma.event.findMany({
      where: whereClause,
      skip,
      take: query.limit,
      orderBy: {
        date: query.sort === 'latest' ? 'desc' : 'asc',
      },
    }),
    prisma.event.count({ where: whereClause }),
  ])

  const totalPages = Math.max(1, Math.ceil(totalItems / query.limit))

  response.json({
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      totalItems,
      totalPages,
      hasNext: query.page < totalPages,
      hasPrevious: query.page > 1,
    },
  })
})

router.get('/events/:id', async (request, response) => {
  const event = await prisma.event.findUnique({
    where: { id: getRouteId(request.params.id) },
  })

  if (!event) {
    return response.status(404).json({ message: 'Event not found.' })
  }

  return response.json(event)
})

router.post('/admin/events', requireAdmin, async (request, response) => {
  const payload = createEventSchema.parse(request.body)

  const event = await prisma.event.create({
    data: {
      title: payload.title,
      description: payload.description,
      date: new Date(payload.date),
      city: payload.city,
      location: payload.location,
      image: payload.image,
    },
  })

  return response.status(201).json(event)
})

router.put('/admin/events/:id', requireAdmin, async (request, response) => {
  const payload = updateEventSchema.parse(request.body)

  const existingEvent = await prisma.event.findUnique({
    where: { id: getRouteId(request.params.id) },
  })

  if (!existingEvent) {
    return response.status(404).json({ message: 'Event not found.' })
  }

  const event = await prisma.event.update({
    where: { id: getRouteId(request.params.id) },
    data: {
      title: payload.title,
      description: payload.description,
      date: payload.date ? new Date(payload.date) : undefined,
      city: payload.city,
      location: payload.location,
      image: payload.image,
    },
  })

  return response.json(event)
})

router.delete('/admin/events/:id', requireAdmin, async (request, response) => {
  const existingEvent = await prisma.event.findUnique({
    where: { id: getRouteId(request.params.id) },
  })

  if (!existingEvent) {
    return response.status(404).json({ message: 'Event not found.' })
  }

  await prisma.event.delete({
    where: { id: getRouteId(request.params.id) },
  })

  return response.status(204).send()
})

router.get('/categories', async (_request, response) => {
  const categories = await prisma.category.findMany({
    orderBy: [{ type: 'asc' }, { name: 'asc' }],
  })

  response.json(categories)
})

router.get('/dashboard/summary', requireAdmin, async (_request, response) => {
  const [users, artists, articles, artworks, events, submissions, subscribers, latestArticles, latestArtists, latestEvents, latestSubmissions, latestSubscribers] = await Promise.all([
    prisma.user.count(),
    prisma.artist.count(),
    prisma.article.count(),
    prisma.artwork.count(),
    prisma.event.count(),
    prisma.artworkSubmission.count(),
    prisma.newsletterSubscription.count(),
    prisma.article.findMany({
      take: 3,
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        artist: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        category: true,
      },
    }),
    prisma.artist.findMany({
      take: 3,
      orderBy: {
        user: {
          createdAt: 'desc',
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
        artworks: true,
        articles: true,
      },
    }),
    prisma.event.findMany({
      take: 3,
      orderBy: {
        date: 'asc',
      },
    }),
    prisma.artworkSubmission.findMany({
      take: 3,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
        artist: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    }),
    prisma.newsletterSubscription.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ])

  return response.json({
    totals: {
      users,
      artists,
      articles,
      artworks,
      events,
      submissions,
      subscribers,
    },
    latest: {
      articles: latestArticles,
      artists: latestArtists,
      events: latestEvents,
      submissions: latestSubmissions,
      subscribers: latestSubscribers,
    },
  })
})

export { router }
