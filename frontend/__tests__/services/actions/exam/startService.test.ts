import { MTestRepository } from "@/lib/repositories/master/mTestRepository";
import { MTest } from ".prisma/client_master";
import { MTestQuestion } from ".prisma/client_master";
import { TTestRepository } from "@/lib/repositories/transaction/tTestRepository";
import { transactionPrisma } from "@/lib/prisma/transactionPrisma";
import { MTestQuestionRepository } from "@/lib/repositories/master/mTestQuestionRepository";
import { startService } from "@/services/actions/exam/startService";
import { TTest } from ".prisma/client_transaction/";
import { TestResult } from "@/lib/definitions/labels";

// 固定された日時（全テストで共通に使用）
const fixedDate = new Date("2025-08-29T11:01:20Z");

// モックの宣言（startServiceの依存モジュール）
jest.mock("@/lib/repositories/master/mTestRepository");
jest.mock("@/lib/repositories/transaction/tTestRepository");
jest.mock("@/lib/repositories/master/mTestQuestionRepository");
jest.mock("@/lib/prisma/transactionPrisma", () => ({
    transactionPrisma: {
        // $transactionをモック化しておかないと、後からmockImplementationなどで上書きできない
        $transaction: jest.fn(),
    },
}));

describe("startService.ts", () => {
    describe("startService", () => {

        test("試験開始用のデータを返却する", async () => {
            const testId = 1;
            const questionNum = 10;
            const mTest: MTest = {
                id: testId,
                name: "2025年度 Pマーク試験",
                startAt: new Date("1900-01-01T00:00:00Z"),
                endAt: new Date("2100-12-31T23:59:59Z"),
                questionNum,
                passNum: 8,
                createAt: fixedDate,
                updateAt: fixedDate,
                deleteAt: null,
            };
            (MTestRepository.findById as jest.Mock).mockResolvedValue(mTest);
            (TTestRepository.findAllByEmployeeIdAndTestId as jest.Mock).mockResolvedValue(null); // 未受験
            const mTestQuestions: MTestQuestion[] = Array.from({ length: questionNum * 2 }, (_, i) => ({
                id: i + 1,
                testId,
                questionNo: i + 1,
                question: `問題${i + 1}`,
                commentary: `解説${i + 1}`,
                correct: Math.random() < 0.5,
                createAt: fixedDate,
                updateAt: fixedDate,
                deleteAt: null,
            }));
            (MTestQuestionRepository.findAllByTestId as jest.Mock).mockResolvedValue(mTestQuestions);
            (TTestRepository.findMaxTestCntByEmployeeIdAndTestId as jest.Mock).mockResolvedValue(0);
            (transactionPrisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
                const tx = {};
                await callback(tx);
            });

            const employeeId = 1;
            const result = await startService(employeeId, testId);

            expect(TTestRepository.createTTest).toHaveBeenCalledWith(
                employeeId,
                testId,
                1,
                {},
            );
            expect(result.mTestQuestions).toHaveLength(questionNum); // 厳密な検証ではない
            expect(result.testCnt).toBe(1); // 初回受験
        });

        test("試験マスタが存在しない場合に例外が発生する", async () => {
            (MTestRepository.findById as jest.Mock).mockResolvedValue(null);

            const employeeId = 1;
            const testId = 1;
            await expect(startService(employeeId, testId)).rejects.toThrow(`試験マスタが存在しません。[testId=${testId}]`);
        });

        test("試験の実施期間外の場合に例外が発生する", async () => {
            const testId = 1;
            const mTest: MTest = {
                id: testId,
                name: "2025年度 Pマーク試験",
                startAt: new Date("1900-01-01T00:00:00Z"),
                endAt: new Date("1900-01-01T00:00:00Z"),
                questionNum: 10,
                passNum: 8,
                createAt: fixedDate,
                updateAt: fixedDate,
                deleteAt: null,
            };
            (MTestRepository.findById as jest.Mock).mockResolvedValue(mTest);

            const employeeId = 1;
            await expect(startService(employeeId, testId)).rejects.toThrow(`試験の実施期間外です。[testId=${testId}]`);
        });

        test("試験が合格済みの場合は例外が発生する", async () => {
            const testId = 1;
            const questionNum = 10;
            const passNum = 8;
            const mTest: MTest = {
                id: testId,
                name: "2025年度 Pマーク試験",
                startAt: new Date("1900-01-01T00:00:00Z"),
                endAt: new Date("2100-12-31T23:59:59Z"),
                questionNum,
                passNum: 8,
                createAt: fixedDate,
                updateAt: fixedDate,
                deleteAt: null,
            };
            (MTestRepository.findById as jest.Mock).mockResolvedValue(mTest);
            const employeeId = 1;
            const tTests: TTest[] = [
                {
                    id: 2,
                    employeeId,
                    testId: testId,
                    testCnt: 2,
                    correctNum: passNum,
                    result: TestResult.Pass,
                    testAt: fixedDate,
                    createAt: fixedDate,
                    updateAt: fixedDate,
                    deleteAt: null,
                },
                {
                    id: 1,
                    employeeId,
                    testId: testId,
                    testCnt: 1,
                    correctNum: 0,
                    result: TestResult.Fail,
                    testAt: fixedDate,
                    createAt: fixedDate,
                    updateAt: fixedDate,
                    deleteAt: null,
                },
            ];
            (TTestRepository.findAllByEmployeeIdAndTestId as jest.Mock).mockResolvedValue(tTests);

            await expect(startService(employeeId, testId)).rejects.toThrow(`合格した試験は開始できません。[employeeId=${employeeId}] [testId=${testId}]`);
        });

    });
});