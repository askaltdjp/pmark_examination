import { Prisma, MTest } from ".prisma/client_master";
import { masterPrisma } from "@/lib/prisma/masterPrisma";
import { currentJST } from "@/lib/utils/timeUtils";

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

    /**
     * 指定されたIDのMTestレコードを論理削除する（deleteAtに現在時刻を設定）
     * @param id - 削除対象のMTestレコードのID
     * @param tx - トランザクションオブジェクト
     */
    static async deleteById(id: number, tx: Prisma.TransactionClient): Promise<void> {
        const now = currentJST();

        await tx.mTest.update({
            where: { id },
            data: {
                deleteAt: now,
                updateAt: now,
            },
        });
    }
}