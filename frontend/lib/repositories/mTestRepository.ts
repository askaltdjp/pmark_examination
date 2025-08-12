import { MTest } from '.prisma/client_master';
import { masterPrisma } from '@/lib/prisma/masterPrisma';

/**
 * MTestモデルのデータ操作を行うリポジトリクラス
 */
export class MTestRepository {
    /**
     * startDate <= 現在日時 < endDate を満たすMTestレコードを取得する
     * @returns 条件に合致するMTestオブジェクト（存在すれば1件）、なければnull
     */
    static async findActive(): Promise<MTest | null> {
        // TODO: 時間操作は共通関数に移す

        // !!!!!!!!!!!!!!!!!!!!! 重要 !!!!!!!!!!!!!!!!!!!!!
        // 本来、JavaScriptでは時間をUTCしか扱えないが、本アプリではUTCをJSTとみなして扱う
        // 
        // 例：現在時間がJSTの12:00の場合
        // const nowUtc = new Date();
        // nowUtcは、実際のデータ上ではUTCの3:00（＝JSTの12:00）になる
        // 本アプリではこれをJSTの3:00とみなすので、JSTの12:00にするために9時間を加算する
        // const nowJst = new Date(nowUtc.getTime() + 9 * 60 * 60 * 1000);

        // UTC → JST に変換（+9時間）
        const nowUtc = new Date();
        const nowJst = new Date(nowUtc.getTime() + 9 * 60 * 60 * 1000);
        console.log("UTC:", nowUtc.toISOString());
        console.log("JST:", nowJst.toISOString());

        return await masterPrisma.mTest.findFirst({
            where: {
                startAt: { lte: nowJst },
                endAt: { gt: nowJst },
                deleteAt: null,
            },
        });
    }
}