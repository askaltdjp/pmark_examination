import { headers } from "next/headers";
import { getEmployeeFromRequest } from "@/lib/utils/employeeUtils";
import { TEmployee } from ".prisma/client_transaction";
import { startService } from "@/services/actions/exam/startService";
import { MTestQuestion } from ".prisma/client_master/client";
import { startAction } from "@/app/actions/exam/startAction";

// 固定された日時（全テストで共通に使用）
const fixedDate = new Date("2025-08-29T11:01:20Z");

// モック化（startActionの依存モジュール）
jest.mock("next/headers");
jest.mock("@/lib/utils/employeeUtils");
jest.mock("@/services/actions/exam/startService");

describe("startActions.ts", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe("startAction", () => {
        test("試験開始用のデータを返却する", async () => {
            // モックの定義
            (headers as jest.Mock).mockResolvedValue({});
            const tEmployee: TEmployee = {
                id: 1,
                employeeNo: "001",
                name: "テスト太郎",
                emailAddress: "test_taro@aska-ltd.jp",
                password: "testpassword",
                joinDate: fixedDate,
                createAt: fixedDate,
                updateAt: fixedDate,
                deleteAt: null,
            };
            (getEmployeeFromRequest as jest.Mock).mockResolvedValue(tEmployee);
            const testId = 1;
            const mTestQuestions: MTestQuestion[] = [
                {
                    id: 1,
                    testId,
                    questionNo: 1,
                    question: "質問1",
                    commentary: "解説1",
                    correct: true,
                    createAt: fixedDate,
                    updateAt: fixedDate,
                    deleteAt: null,
                },
                {
                    id: 2,
                    testId,
                    questionNo: 2,
                    question: "質問2",
                    commentary: "解説2",
                    correct: false,
                    createAt: fixedDate,
                    updateAt: fixedDate,
                    deleteAt: null,
                }
            ];
            const testCnt = 1;
            (startService as jest.Mock).mockResolvedValue({ mTestQuestions, testCnt });

            // startActionの実行
            const result = await startAction(testId);

            // startActionの戻り値の検証
            expect(result).toEqual({ mTestQuestions, testCnt });
        });

        test("試験IDが提供されていない場合に例外が発生する", async () => {
            await expect(startAction(0)).rejects.toThrow("試験IDが提供されていません");
        });
    });
});