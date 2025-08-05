import { PrismaClient } from "@prisma/client";

// Next.js のホットリロード時に PrismaClient のインスタンスが
// 複数生成されるのを防ぐためのシングルトンパターン。
// 詳細は Prisma 公式ドキュメントの
// 「Next.js と Prisma のトラブルシューティング」ページを参照。
// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;