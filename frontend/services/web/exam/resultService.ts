import { MTest } from ".prisma/client_master";
import { MTestRepository } from "@/lib/repositories/master/mTestRepository";
import { MTestQuestion } from ".prisma/client_master";
import { MTestQuestionRepository } from "@/lib/repositories/master/mTestQuestionRepository";
import { TTest } from ".prisma/client_transaction/";
import { TTestRepository } from "@/lib/repositories/transaction/tTestRepository";
import { TTestAnswer } from ".prisma/client_transaction/";
import { TTestAnswerRepository } from "@/lib/repositories/transaction/tTestAnswerRepository";

/**
 * 試験結果取得処理を行うサービス関数
 *
 * @param employeeId - 社員ID
 * @param testId - 試験ID
 * @param testCnt - 受験回数
 * @returns オブジェクト（試験情報、試験問題マップ、受験履歴、解答履歴、合否判定）
 * @throws 試験マスタ・受験履歴・解答履歴が存在しない場合はエラーをスロー
 */
export async function resultService(
    employeeId: number,
    testId: number,
    testCnt: number
): Promise<{
    mTest: MTest,
    mTestQuestionMap: Record<number, MTestQuestion>,
    tTest: TTest,
    tTestAnswers: TTestAnswer[],
    isPass: boolean
}> {
    // 試験IDに基づいて試験マスタを取得
    const mTest = await MTestRepository.findById(testId);
    if (!mTest) {
        throw new Error(`試験マスタが存在しません。[testId=${testId}]`);
    }

    // 試験問題マスタ取得
    const mTestQuestions = await MTestQuestionRepository.findAllByTestId(testId);

    // 試験問題マスタを Record<number, MTestQuestion> 形式に変換（key: questionNo, value: MTestQuestionオブジェクト）
    const mTestQuestionMap = mTestQuestions.reduce<Record<number, MTestQuestion>>((acc, mTestQuestion) => {
        acc[mTestQuestion.questionNo] = mTestQuestion;
        return acc;
    }, {});

    // 社員の該当試験とその受験回数に応じた受験履歴を取得
    const tTest = await TTestRepository.findByEmployeeIdAndTestIdAndTestCnt(
        employeeId,
        testId,
        testCnt,
    );
    if (!tTest) {
        throw Error(`受験履歴が存在しません。[employeeId=${employeeId}] [testId=${testId}] [testCnt=${testCnt}]`);
    }

    // 社員の受験時の解答履歴を取得
    const tTestAnswers = await TTestAnswerRepository.findAllByEmployeeIdAndTestIdAndTestCnt(
        employeeId,
        testId,
        testCnt,
    );
    if (!tTestAnswers) {
        throw Error(`解答履歴が存在しません。[employeeId=${employeeId}] [testId=${testId}] [testCnt=${testCnt}]`);
    }

    // 合格判定を行う（正解数が合格基準以上かどうか）
    const isPass = tTest.correctNum >= mTest.passNum;

    return {
        mTest,
        mTestQuestionMap,
        tTest,
        tTestAnswers,
        isPass,
    };
}