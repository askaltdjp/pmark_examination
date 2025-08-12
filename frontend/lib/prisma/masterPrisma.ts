import { PrismaClient as MasterPrismaClient } from '.prisma/client_master';

// Next.js のホットリロード時に PrismaClient のインスタンスが
// 複数生成されるのを防ぐためのシングルトンパターン。
// 詳細は Prisma 公式ドキュメントの
// 「Next.js と Prisma のトラブルシューティング」ページを参照。
// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help

// 開発環境での PrismaClient の多重インスタンス生成を防ぐため、
// グローバルオブジェクトにキャッシュ（シングルトンパターン）を保持
const globalForMasterPrisma = globalThis as typeof globalThis & {
    masterPrisma?: MasterPrismaClient;
};

// 既存のインスタンスがあればそれを使い、なければ新しく作成
export const masterPrisma =
    globalForMasterPrisma.masterPrisma || new MasterPrismaClient();

// 本番環境以外では、作成したインスタンスをグローバルに保存
if (process.env.NODE_ENV !== 'production') {
    globalForMasterPrisma.masterPrisma = masterPrisma;
}
