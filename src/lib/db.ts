import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const libsql = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!,
})

const adapter = new PrismaLibSQL(libsql)

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter, log: ['query'] })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db