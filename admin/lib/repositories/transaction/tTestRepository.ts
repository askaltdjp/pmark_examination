import { Prisma } from ".prisma/client_transaction";
import { TestSummaryRecord } from "@/lib/definitions/types";
import { transactionPrisma } from "@/lib/prisma/transactionPrisma";
import { currentJST } from "@/lib/utils/timeUtils";

/**
 * TTestモデルのデータ操作を行うリポジトリクラス
 */
export class TTestRepository {
    /**
     * testId ごとの受験者数（distinct employee_id）と合格者数（result = 1 の合計）を取得する
     * 
     * @returns testId をキー、受験者数・合格者数を値に持つオブジェクト（Record）
     */
    static async findTestSummary(): Promise<TestSummaryRecord> {
        const result = await transactionPrisma.$queryRaw<{
            testId: number;
            examineeNum: number;
            passerNum: number
        }[]>`
            SELECT
                test_id AS "testId",
                COUNT(DISTINCT employee_id) AS "examineeNum",
                SUM(CASE WHEN result = 1 THEN 1 ELSE 0 END) AS "passerNum"
            FROM
                t_test
            GROUP BY
                test_id
            `;

        return result.reduce<TestSummaryRecord>((acc, cur) => {
            acc[cur.testId] = { examineeNum: cur.examineeNum, passerNum: cur.passerNum };
            return acc;
        }, {});
    }

    /**
     * 指定された testId に一致する TTest レコードを論理削除する
     * 
     * @param testId - 論理削除対象の testId
     * @param tx - トランザクションオブジェクト
     */
    static async deleteByTestId(testId: number, tx: Prisma.TransactionClient): Promise<void> {
        const now = currentJST();

        await tx.tTest.updateMany({
            where: { testId },
            data: {
                deleteAt: now,
                updateAt: now,
            },
        });
    }
}