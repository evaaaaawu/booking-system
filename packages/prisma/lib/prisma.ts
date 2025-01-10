import { PrismaClient } from '@prisma/client'
import slugify from 'slugify'

const prisma = new PrismaClient()

// Prisma Middleware to generate slug before creating a User
prisma.$use(async (params, next) => {
  if (params.model === 'User' && params.action === 'create') {
    const { data } = params.args

    if (!data.slug) {
      let baseSlug: string

      if (data.name) {
        baseSlug = slugify(data.name, { lower: true, strict: true })
      } else if (data.email) {
        baseSlug = slugify(data.email.split('@')[0], { lower: true, strict: true })
      } else {
        // Fallback if neither name nor email is available
        baseSlug = `user-${Date.now()}`
      }

      let slug = baseSlug
      let count = 1

      // 確保 slug 唯一
      while (await prisma.user.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${count}`
        count++
      }

      data.slug = slug
    }
  }
  return next(params)
})

export default prisma
