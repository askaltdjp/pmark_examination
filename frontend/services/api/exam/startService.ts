import { MTestRepository } from '@/lib/repositories/master/mTestRepository';
import { TTestRepository } from '@/lib/repositories/transaction/tTestRepository';
import { transactionPrisma } from '@/lib/prisma/transactionPrisma';
import { currentJST } from '@/lib/utils/timeUtils';
import { TestResult } from '@/lib/constants/labels';

/**
 * 試験開始処理を行うサービス関数
 * 
 * @param employeeId - 従業員ID
 * @param testId - 試験ID
 */
export async function startService(employeeId: number, testId: number) {
    // 試験IDに基づいて試験マスタを取得
    const mTest = await MTestRepository.findById(testId);
    if (!mTest) {
        throw new Error('指定された試験が見つかりません。');
    }

    // 現在の日時を取得
    const now = currentJST();

    // 試験の実施期間内かどうかを確認
    if (mTest.startAt > now || now > mTest.endAt) {
        throw new Error('試験の実施期間外です。');
    }

    // 社員の受験履歴を取得
    const tTests = await TTestRepository.findAllByEmployeeIdAndTestId(employeeId, testId);
    const tTest = tTests ? tTests[0] : null;

    // すでに合格している場合は試験を開始できないようにする
    if (tTest?.result === TestResult.Pass) {
        throw new Error('合格した試験は開始できません。');
    }

    // トランザクション処理
    const result = await transactionPrisma.$transaction(async (tx) => {
        // 受験履歴がない、または受験結果が不合格の場合、新しい受験履歴を作成
        if (!tTest || tTest.result === TestResult.Fail) {
            // 受験回数をカウントし、受験情報を新規作成
            const testCnt = (tTest?.testCnt ?? 0) + 1;
            await TTestRepository.createTTest(employeeId, testId, testCnt, tx);
        }
    });
}