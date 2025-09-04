import { TestSummaryRecord } from "@/lib/definitions/types";
import { transactionPrisma } from "@/lib/prisma/transactionPrisma";

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
}