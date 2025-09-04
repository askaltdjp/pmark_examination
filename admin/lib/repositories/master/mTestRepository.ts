import { MTest } from ".prisma/client_master";
import { masterPrisma } from "@/lib/prisma/masterPrisma";

/**
 * MTestモデルのデータ操作を行うリポジトリクラス
 */
export class MTestRepository {
    /**
     * すべてのMTestレコードを取得する
     * @returns のすべての MTest オブジェクトの配列
     */
    static async findAll(): Promise<MTest[]> {
        return await masterPrisma.mTest.findMany({
            where: {
                deleteAt: null,
            },
        });
    }
}