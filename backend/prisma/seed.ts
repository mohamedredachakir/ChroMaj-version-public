import process from 'node:process'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = [
    { name: 'Street Art', type: 'ARTICLE' as const },
    { name: 'Photography', type: 'ARTWORK' as const },
    { name: 'Events', type: 'EVENT' as const },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: { type: category.type },
      create: category,
    })
  }

  const adminPasswordHash = await bcrypt.hash('admin1234', 10)
  const artistPasswordHash = await bcrypt.hash('artist1234', 10)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@chromag.local' },
    update: {
      name: 'ChroMag Admin',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
    create: {
      name: 'ChroMag Admin',
      email: 'admin@chromag.local',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  })

  const artistUser = await prisma.user.upsert({
    where: { email: 'artist@chromag.local' },
    update: {
      name: 'Amina El Idrissi',
      passwordHash: artistPasswordHash,
      role: 'ARTIST',
    },
    create: {
      name: 'Amina El Idrissi',
      email: 'artist@chromag.local',
      passwordHash: artistPasswordHash,
      role: 'ARTIST',
    },
  })

  const artistProfile = await prisma.artist.upsert({
    where: { userId: artistUser.id },
    update: {
      bio: 'Mixed-media artist exploring Moroccan urban identity.',
      instagram: '@amina.chromag',
      website: 'https://chromag.local/artists/amina',
    },
    create: {
      userId: artistUser.id,
      bio: 'Mixed-media artist exploring Moroccan urban identity.',
      instagram: '@amina.chromag',
      website: 'https://chromag.local/artists/amina',
    },
  })

  const articleCategory = await prisma.category.findUniqueOrThrow({
    where: { name: 'Street Art' },
  })
  const artworkCategory = await prisma.category.findUniqueOrThrow({
    where: { name: 'Photography' },
  })

  await prisma.article.upsert({
    where: { id: 'seed-article-casablanca-streets' },
    update: {
      title: 'Casablanca Streets as Living Canvases',
      content: 'A first editorial article seeded for Docker development.',
      publishedAt: new Date('2026-03-13T09:00:00.000Z'),
      authorId: adminUser.id,
      artistId: artistProfile.id,
      categoryId: articleCategory.id,
    },
    create: {
      id: 'seed-article-casablanca-streets',
      title: 'Casablanca Streets as Living Canvases',
      content: 'A first editorial article seeded for Docker development.',
      publishedAt: new Date('2026-03-13T09:00:00.000Z'),
      authorId: adminUser.id,
      artistId: artistProfile.id,
      categoryId: articleCategory.id,
    },
  })

  await prisma.comment.upsert({
    where: { id: 'seed-comment-casablanca-response' },
    update: {
      articleId: 'seed-article-casablanca-streets',
      userId: artistUser.id,
      content: 'This story captures the energy of the streets exactly how we live it.',
    },
    create: {
      id: 'seed-comment-casablanca-response',
      articleId: 'seed-article-casablanca-streets',
      userId: artistUser.id,
      content: 'This story captures the energy of the streets exactly how we live it.',
    },
  })

  await prisma.articleLike.upsert({
    where: {
      articleId_userId: {
        articleId: 'seed-article-casablanca-streets',
        userId: artistUser.id,
      },
    },
    update: {},
    create: {
      articleId: 'seed-article-casablanca-streets',
      userId: artistUser.id,
    },
  })

  await prisma.artwork.upsert({
    where: { id: 'seed-artwork-city-lights' },
    update: {
      title: 'City Lights',
      image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80',
      description: 'Night photography from Casablanca medina.',
      artistId: artistProfile.id,
      categoryId: artworkCategory.id,
    },
    create: {
      id: 'seed-artwork-city-lights',
      title: 'City Lights',
      image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80',
      description: 'Night photography from Casablanca medina.',
      artistId: artistProfile.id,
      categoryId: artworkCategory.id,
    },
  })

  await prisma.event.upsert({
    where: { id: 'seed-event-marrakech-collective' },
    update: {
      title: 'Marrakech Creative Collective',
      description: 'An open studio event for local artists, writers, and musicians.',
      date: new Date('2026-04-01T18:30:00.000Z'),
      city: 'Marrakech',
      location: 'Riad Arts Lab',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    },
    create: {
      id: 'seed-event-marrakech-collective',
      title: 'Marrakech Creative Collective',
      description: 'An open studio event for local artists, writers, and musicians.',
      date: new Date('2026-04-01T18:30:00.000Z'),
      city: 'Marrakech',
      location: 'Riad Arts Lab',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    },
  })

  await prisma.newsletterSubscription.upsert({
    where: { email: 'reader@chromag.local' },
    update: {},
    create: {
      email: 'reader@chromag.local',
    },
  })

  await prisma.newsletterSubscription.upsert({
    where: { email: 'community@chromag.local' },
    update: {},
    create: {
      email: 'community@chromag.local',
    },
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
