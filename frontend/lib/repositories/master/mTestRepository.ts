import { MTest } from ".prisma/client_master";
import { masterPrisma } from "@/lib/prisma/masterPrisma";
import { currentJST } from "../../utils/timeUtils";

/**
 * MTestモデルのデータ操作を行うリポジトリクラス
 */
export class MTestRepository {
    /**
     * IDをキーにMTestレコードを検索する
     * @param id - 検索する試験ID
     * @returns 見つかったMTestオブジェクト、なければnull
     */
    static async findById(id: number): Promise<MTest | null> {
        return await masterPrisma.mTest.findFirst({
            where: {
                id,
                deleteAt: null,
            },
        });
    }

    /**
     * startDate <= 現在日時 <= endDate を満たすMTestレコードを取得する
     * @returns 条件に合致するMTestオブジェクト（存在すれば1件）、なければnull
     */
    static async findActive(): Promise<MTest | null> {
        const now = currentJST();
        return await masterPrisma.mTest.findFirst({
            where: {
                startAt: { lte: now },
                endAt: { gte: now },
                deleteAt: null,
            },
        });
    }
}