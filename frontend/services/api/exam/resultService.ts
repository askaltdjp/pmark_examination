import { MTestRepository } from '@/lib/repositories/master/mTestRepository';
import { TTestRepository } from '@/lib/repositories/transaction/tTestRepository';
import { transactionPrisma } from '@/lib/prisma/transactionPrisma';
import { currentJST } from '@/lib/utils/timeUtils';
import { TestResult } from '@/lib/constants/labels';
import { MTestQuestionRepository } from '@/lib/repositories/master/mTestQuestionRepository';
import { TTestAnswerRepository } from '@/lib/repositories/transaction/tTestAnswerRepository';

/**
 * 試験解答結果の保存を行うサービス関数
 *
 * @param employeeId - 社員ID
 * @param testId - 試験ID
 * @param testCnt - 受験回数
 * @param answers - 解答一覧（{ questionNo, answer } の配列）
 * @returns void
 * @throws 条件に合わない場合や処理中にエラーが発生した場合に例外をスローします
 */
export async function resultService(employeeId: number, testId: number, testCnt: number, answers: { questionNo: number, answer: boolean }[]): Promise<void> {
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

    // 社員の受験履歴を取得（最新情報を取得）
    const tTests = await TTestRepository.findAllByEmployeeIdAndTestId(employeeId, testId);
    const tTest = tTests ? tTests[0] : null;

    // 試験開始処理で作成した受験履歴が存在しない場合はエラー
    if (!tTest) {
        throw new Error('正規の手順で試験開始を行っていません。');
    }
    // すでに結果が確定している場合は処理を中断
    if (tTest.result === TestResult.Fail || tTest.result === TestResult.Pass) {
        throw new Error('結果が確定している試験は受験できません。');
    }

    // 試験問題マスタ取得
    const mTestQuestions = await MTestQuestionRepository.findAllByTestId(testId);
    // 試験問題マスタを Record<number, boolean> 形式に変換（key: questionNo, value: correct）
    const corrects = mTestQuestions.reduce((acc, mTestQuestion) => {
        acc[mTestQuestion.questionNo] = mTestQuestion.correct;
        return acc;
    }, {} as Record<number, boolean>);

    // 正答数を計算
    const correctNum = answers.filter(answer => {
        return answer.answer === corrects[answer.questionNo];
    }).length;

    // 合格・不合格の判定
    const result = (mTest.passNum <= correctNum) ? TestResult.Pass : TestResult.Fail;

    // 解答履歴をDB登録用の形式に変換
    const newTTestAnswers = answers.map(answer => {
        return {
            employeeId,
            testId,
            testCnt,
            questionNo: answer.questionNo,
            answer: answer.answer,
        };
    });

    // トランザクション処理
    await transactionPrisma.$transaction(async (tx) => {
        // 受験履歴を更新
        await TTestRepository.updateCorrectNumAndResult(tTest.id, correctNum, result, tx);
        // 解答履歴を新規作成
        await TTestAnswerRepository.createManyTTestAnswers(newTTestAnswers, tx);
    });
}