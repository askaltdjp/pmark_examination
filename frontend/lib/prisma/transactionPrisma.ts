import { PrismaClient as TransactionPrismaClient } from ".prisma/client_transaction";

// Next.js のホットリロード時に PrismaClient のインスタンスが
// 複数生成されるのを防ぐためのシングルトンパターン。
// 詳細は Prisma 公式ドキュメントの
// 「Next.js と Prisma のトラブルシューティング」ページを参照。
// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help

// 開発環境での PrismaClient の多重インスタンス生成を防ぐため、
// グローバルオブジェクトにキャッシュ（シングルトンパターン）を保持
const globalForTransactionPrisma = globalThis as typeof globalThis & {
    transactionPrisma?: TransactionPrismaClient;
};

// 既存のインスタンスがあればそれを使い、なければ新しく作成
export const transactionPrisma =
    globalForTransactionPrisma.transactionPrisma || new TransactionPrismaClient();

// 本番環境以外では、作成したインスタンスをグローバルに保存
if (process.env.NODE_ENV !== "production") {
    globalForTransactionPrisma.transactionPrisma = transactionPrisma;
}
