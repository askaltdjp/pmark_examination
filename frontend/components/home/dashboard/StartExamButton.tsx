"use client";

import { useRouter } from "next/navigation";
import { MTest } from '.prisma/client_master';
import { TTest } from '.prisma/client_transaction';
import { TestResult } from '@/lib/constants/labels';

type Props = {
    mTest: MTest | null,
    tTest: TTest | null,
};

// 試験開始ボタンのクライアントコンポーネント
export default function StartExamButton({ mTest, tTest }: Props) {
    const router = useRouter();

    // 試験開始ボタン押下時の処理
    const handleStartButtonClick = async () => {
        try {
            // 試験開始APIへPOSTリクエスト
            const response = await fetch('/api/exam/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    testId: mTest?.id,
                }),
            });

            // レスポンスの正常確認
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '試験開始に失敗しました');
            }

            // 試験開始に成功した場合、試験画面に遷移
            router.push('/exam/take');

        } catch (error) {
            // エラー発生時、コンソールにエラーメッセージを出力し、アラートを表示
            console.error('試験開始時のエラー:', error);
            alert(error instanceof Error ? error.message : '不明なエラーが発生しました');
        }
    }

    // 実施中の試験がない場合、または合格している場合、試験開始ボタンを非活性化
    const disabled = !mTest || tTest?.result === TestResult.Pass;

    return (
        <div className="mt-6 flex justify-center">
            <button className="btn btn-info btn-lg" disabled={disabled} onClick={() => handleStartButtonClick()}>試験開始</button>
        </div>
    );
}
