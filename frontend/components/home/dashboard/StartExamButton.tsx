"use client";

import { useRouter } from "next/navigation";
import { MTest } from ".prisma/client_master";
import { TTest } from ".prisma/client_transaction";
import { TestResult } from "@/lib/definitions/labels";
import { SESSION_STORAGE_EXAM_DATA_KEY } from "@/lib/definitions/system";
import { startAction } from "@/app/actions/exam/startAction";
import { ExamData } from "@/lib/definitions/types";

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
            // 試験開始処理の実行
            const { mTestQuestions, testCnt } = await startAction(mTest.id);

            // 試験問題マスタから問題Noと問題文を抽出
            const questions = mTestQuestions.map(mTestQuestion => {
                const { questionNo, question } = mTestQuestion;
                return {
                    questionNo,
                    question
                };
            });

            // 試験データをセッションストレージに保存
            const examData: ExamData = {
                testId: mTest.id,
                testCnt: testCnt,
                questions,
                answers: [],
                questionIndex: 0,
                isExamInProgress: false, // 試験画面に入ったらフラグを立てる
            };
            sessionStorage.setItem(
                SESSION_STORAGE_EXAM_DATA_KEY,
                JSON.stringify(examData),
            );

            // 試験開始に成功した場合、試験画面に遷移
            router.push("/exam/take");

        } catch (error) {
            // エラー発生時、コンソールにエラーメッセージを出力し、アラートを表示
            console.error("試験開始時のエラー:", error);
            alert(error instanceof Error ? error.message : "予期しないエラーが発生しました。");
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
