import { PrismaClient as TransactionPrismaClient } from ".prisma/client_transaction";

// Next.js のホットリロード時に PrismaClient のインスタンスが
// 複数生成されるのを防ぐためのシングルトンパターン。
// 詳細は Prisma 公式ドキュメントの
// 「Next.js と Prisma のトラブルシューティング」ページを参照。
// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help

// globalオブジェクトを拡張して、prismaの型を定義
const globalForPrisma = global as unknown as { transactionPrisma: TransactionPrismaClient };

// すでにインスタンスがあれば使う。なければ新しく作る。
export const transactionPrisma = globalForPrisma.transactionPrisma || new TransactionPrismaClient(
    // { log: ['query', 'info', 'warn', 'error'] },
);

// 開発モードの場合だけglobalに保存しておく（本番は不要）
if (process.env.NODE_ENV !== "production") globalForPrisma.transactionPrisma = transactionPrisma;