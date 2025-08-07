"use client";

// 受験履歴テーブルコンポーネント
export default function ExamHistoryList() {
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
                    {[...Array(25)].map((_, i) => {
                        const date = `2025/08/${String((i % 30) + 1).padStart(2, '0')} ${String(i % 24).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`;
                        const correct = `${String(10 + (i % 90)).padStart(2, '0')}/90`;
                        const result = ['中断', '不合格', '合格'][i % 3];
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