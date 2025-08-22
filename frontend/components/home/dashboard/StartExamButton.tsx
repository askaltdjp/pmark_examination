"use client";

import { useRouter } from "next/navigation";
import { MTest, MTestQuestion } from '.prisma/client_master';
import { TTest } from '.prisma/client_transaction';
import { TestResult } from '@/lib/constants/labels';
import { SESSION_STORAGE_EXAM_DATA_KEY } from '@/lib/constants/system';

type Props = {
    mTest: MTest | null,
    tTest: TTest | null,
};

/**
 * 試験開始ボタンのクライアントコンポーネント
 */
export default function StartExamButton({ mTest, tTest }: Props) {
    const router = useRouter();

    // 試験開始ボタン押下時の処理
    const handleStartButtonClick = async () => {
        // 実施中の試験がない場合に万が一呼ばれたら即座に終了
        if (!mTest) {
            return;
        }

        try {
            // 試験開始APIへPOSTリクエスト
            const response = await fetch('/api/exam/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    testId: mTest.id,
                }),
            });

            // レスポンスのJSONデータをパース
            const data: {
                mTestQuestions: MTestQuestion[],
                testCnt: number,
                error?: string,
            } = await response.json();

            // レスポンスの正常確認
            if (!response.ok) {
                throw new Error(data.error || '試験開始に失敗しました。もう一度お試しください。');
            }

            // 試験問題を抽出
            const mTestQuestions = data.mTestQuestions;
            const questions = mTestQuestions.map(mTestQuestion => {
                const { questionNo, question } = mTestQuestion;
                return {
                    questionNo,
                    question
                };
            });

            // 試験データをセッションストレージに保存
            sessionStorage.setItem(
                SESSION_STORAGE_EXAM_DATA_KEY,
                JSON.stringify({
                    testId: mTest.id,
                    testCnt: data.testCnt,
                    questions,
                    answers: [],
                    questionIndex: 0,
                })
            );

            // 試験開始に成功した場合、試験画面に遷移
            router.push('/exam/take');

        } catch (error) {
            // エラー発生時、コンソールにエラーメッセージを出力し、アラートを表示
            console.error('試験開始時のエラー:', error);
            alert(error instanceof Error ? error.message : '予期しないエラーが発生しました。');
        }
    }

    // 実施中の試験がない場合、または合格している場合、試験開始ボタンを非活性化
    const disabled = !mTest || tTest?.result === TestResult.Pass;

    return (
        <div className="mt-6 flex justify-center">
            <button className="btn btn-lg bg-slate-600 hover:bg-slate-500 text-white" disabled={disabled} onClick={handleStartButtonClick}>試験開始</button>
        </div>
    );
}
