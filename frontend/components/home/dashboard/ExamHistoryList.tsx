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
                                    <button className="btn btn-info btn-sm min-w-[80px]">確 認</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}