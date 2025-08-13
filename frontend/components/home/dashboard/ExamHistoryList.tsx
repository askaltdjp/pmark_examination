"use client";

import { MTest } from '.prisma/client_master/';
import { TTest } from '.prisma/client_transaction/';
import { formatDate } from '@/lib/utils/timeUtils';
import { testResultLabels } from '@/lib/constants/labels';

type Props = {
    mTest: MTest | null,
    tTests: TTest[];
};

// 受験履歴テーブルのクライアントコンポーネント
export default function ExamHistoryList({ mTest, tTests }: Props) {
    if (mTest === null || tTests.length === 0) {
        return (
            <div className="text-center text-gray-800 text-lg font-semibold py-6">
                受験履歴がありません
            </div>
        );
    }

    // 確認ボタン押下時の処理
    const handleConfirmButtonClick = async (testId: number, testCnt: number) => {
        try {
            // ファイルダウンロードAPIへPOSTリクエスト
            const response = await fetch('/api/exam/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ testId, testCnt }),
            });

            // レスポンスの正常確認
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            // Content-Dispositionヘッダーからファイル名を取得
            const disposition = response.headers.get('Content-Disposition');
            console.log(disposition);
            if (!disposition) throw new Error('Content-Disposition header is missing');

            // ファイル名を正規表現で抽出
            const match = disposition.match(/filename="([^"]+)"/);
            if (!match || !match[1]) throw new Error('Filename not found in Content-Disposition header');

            const filename = match[1];

            // レスポンスをBlobに変換し、一時URLを生成
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // ダウンロード用リンクを作成してクリックイベントを発火
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            // 使い終わったリンクとURLを削除
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('ファイルのダウンロードに失敗しました:', error);
            alert('ファイルのダウンロードに失敗しました。再度お試しください。');
        }
    };

    return (
        <div className="overflow-y-auto max-h-[400px]">
            <table className="w-full border-collapse text-sm border border-gray-600">
                <thead>
                    <tr className="bg-gray-300 text-gray-900 sticky top-0 z-10">
                        <th className="border border-gray-600 px-3 py-2 text-center">受験日時</th>
                        <th className="border border-gray-600 px-3 py-2 text-center">正解状況</th>
                        <th className="border border-gray-600 px-3 py-2 text-center">結果</th>
                        <th className="border border-gray-600 px-3 py-2 text-center">解答</th>
                    </tr>
                </thead>
                <tbody>
                    {tTests.map((tTest, i) => {
                        console.log(tTest);
                        const date = formatDate(tTest.testAt);
                        const correct = `${tTest.correctNum}/${mTest.questionNum}`;
                        const result = testResultLabels[tTest.result];
                        return (
                            <tr key={i}>
                                <td className="border border-gray-600 px-3 py-2 text-center bg-white">{date}</td>
                                <td className="border border-gray-600 px-3 py-2 text-center bg-white">{correct}</td>
                                <td className="border border-gray-600 px-3 py-2 text-center bg-white">{result}</td>
                                <td className="border border-gray-600 px-3 py-2 text-center bg-white">
                                    <button
                                        className="btn btn-info btn-sm min-w-[80px]"
                                        onClick={() => handleConfirmButtonClick(tTest.testId, tTest.testCnt)}
                                    >確 認</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}