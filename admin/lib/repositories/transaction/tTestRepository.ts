import { Prisma, TTest } from ".prisma/client_transaction";
import { TestSummaryRecord } from "@/lib/definitions/types";
import { transactionPrisma } from "@/lib/prisma/transactionPrisma";
import { currentJST } from "@/lib/utils/timeUtils";

/**
 * TTestモデルのデータ操作を行うリポジトリクラス
 */
export class TTestRepository {
    /**
     * employeeId と testId と testCnt を条件に TTest レコードを1件検索する
     * 
     * @param employeeId - 検索する社員ID
     * @param testId - 検索する試験ID
     * @param testCnt - 検索する受験回数
     * @returns 条件に一致する TTest オブジェクト（存在しない場合は null）
     */
    static async findByEmployeeIdAndTestIdAndTestCnt(
        employeeId: number,
        testId: number,
        testCnt: number,
    ): Promise<TTest | null> {
        return transactionPrisma.tTest.findFirst({
            where: {
                employeeId,
                testId,
                testCnt,
                deleteAt: null,
            },
        });
    }

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
     * 指定された testId に対して、各 employee_id ごとの最新の受験結果（test_cnt が最大）を取得する
     * 
     * @param testId - 対象の testId
     * @returns employee_id をキーとした最新受験結果のマップ
     */
    static async getLatestResultMapByTestId(testId: number): Promise<Record<number, {
        testCnt: number;
        result: number;
        testAt: Date;
    }>> {
        const result = await transactionPrisma.$queryRaw<
            {
                employeeId: number;
                testCnt: number;
                result: number;
                testAt: Date;
            }[]
        >`
            SELECT DISTINCT ON (employee_id)
                employee_id AS "employeeId"
               ,test_cnt AS "testCnt"
               ,result
               ,test_at AS "testAt"
            FROM
                t_test
            WHERE
                test_id = ${testId}
            AND delete_at IS NULL
            ORDER BY
                employee_id
               ,test_cnt DESC
        `;

        return result.reduce<Record<number, {
            testCnt: number;
            result: number;
            testAt: Date;
        }>>((acc, cur) => {
            acc[cur.employeeId] = { testCnt: cur.testCnt, result: cur.result, testAt: cur.testAt };
            return acc;
        }, {});
    }

    /**
     * 指定された testId に一致する削除されていない TTest レコードを論理削除する
     * 
     * @param testId - 論理削除対象の testId
     * @param tx - トランザクションオブジェクト
     */
    static async deleteByTestId(testId: number, tx: Prisma.TransactionClient): Promise<void> {
        const now = currentJST();

        await tx.tTest.updateMany({
            where: {
                testId,
                deleteAt: null, // 削除されていないレコードのみ対象
            },
            data: {
                deleteAt: now,
                updateAt: now,
            },
        });
    }
}