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
     * MTestテーブルのIDの最大値を取得する
     * @returns 最大のID
     */
    static async findMaxId(): Promise<number> {
        const result = await masterPrisma.mTest.aggregate({
            _max: {
                id: true,
            },
        });

        return result._max.id ?? 0;
    }

    /**
     * 入力された期間が重複しているMTestレコードを1件だけ取得する
     * @param startAt - 開始日
     * @param endAt - 終了日
     * @param id - 試験ID（オプション）
     * @returns 重複しているMTestレコード1件 または null
     */
    static async findOverlappingRecord(
        startAt: Date,
        endAt: Date,
        id?: number,
    ): Promise<MTest | null> {
        return await masterPrisma.mTest.findFirst({
            where: {
                startAt: { lte: endAt },
                endAt: { gte: startAt },
                deleteAt: null,
                // 試験IDが指定されたら、そのレコードは抽出対象外にする
                ...(id !== undefined && {
                    id: { not: id },
                })
            },
        });
    }

    /**
     * 新しいMTestレコードを追加する（トランザクション内で実行）
     * @param name - 名前
     * @param startAt - 開始日
     * @param endAt - 終了日
     * @param questionNum - 出題数
     * @param passNum - 合格数
     * @param tx - トランザクションオブジェクト
     * @returns 作成したMTestレコード
     */
    static async insert(
        name: string,
        startAt: Date,
        endAt: Date,
        questionNum: number,
        passNum: number,
        tx: Prisma.TransactionClient,
    ): Promise<MTest> {
        const now = currentJST();

        return await tx.mTest.create({
            data: {
                name,
                startAt,
                endAt,
                questionNum,
                passNum,
                createAt: now,
                updateAt: now,
                deleteAt: null,
            },
        });
    }

    /**
     * 指定されたMTestレコードを更新する（トランザクション内で実行）
     * @param id - 試験ID
     * @param name - 名前
     * @param startAt - 開始日
     * @param endAt - 終了日
     * @param questionNum - 出題数
     * @param passNum - 合格数
     * @param tx - トランザクションオブジェクト
     * @returns 更新後のMTestレコード
     */
    static async update(
        id: number,
        name: string,
        startAt: Date,
        endAt: Date,
        questionNum: number,
        passNum: number,
        tx: Prisma.TransactionClient,
    ): Promise<void> {
        const now = currentJST();

        await tx.mTest.update({
            where: { id },
            data: {
                name,
                startAt,
                endAt,
                questionNum,
                passNum,
                updateAt: now,
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