import { PrismaClient as MasterPrismaClient } from ".prisma/client_master";

// Next.js のホットリロード時に PrismaClient のインスタンスが
// 複数生成されるのを防ぐためのシングルトンパターン。
// 詳細は Prisma 公式ドキュメントの
// 「Next.js と Prisma のトラブルシューティング」ページを参照。
// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help

// globalオブジェクトを拡張して、prismaの型を定義
const globalForPrisma = global as unknown as { masterPrisma: MasterPrismaClient };

// すでにインスタンスがあれば使う。なければ新しく作る。
export const masterPrisma = globalForPrisma.masterPrisma || new MasterPrismaClient();

// 開発モードの場合だけglobalに保存しておく（本番は不要）
if (process.env.NODE_ENV !== "production") globalForPrisma.masterPrisma = masterPrisma;