import React from "react";
import { headers } from "next/headers";
import { getEmployeeFromRequest } from "@/lib/utils/employeeUtils";
import { resultService } from "@/services/web/exam/resultService";
import { withRedirectErrorHandler } from "@/lib/utils/withRedirectErrorHandler";
import HomeButton from "@/components/exam/result/HomeButton";

/**
 * 試験結果画面のサーバコンポーネント
 */
export default async function ResultPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { mTest, mTestQuestionMap, tTest, tTestAnswers, isPass } = await withRedirectErrorHandler(async () => {
        // リクエストヘッダから社員情報を取得し、認証済みかを判定
        const requestHeaders = await headers();
        const tEmployee = await getEmployeeFromRequest(requestHeaders);

        // クエリパラメータを取得
        const params = await searchParams;

        // クエリパラメータから試験IDを取得
        if (!params.testId) {
            throw new Error("試験IDが提供されていません。");
        }
        const testId = Number(params.testId);

        // クエリパラメータから受験回数を取得
        if (!params.testCnt) {
            throw new Error("受験回数が提供されていません。");
        }
        const testCnt = Number(params.testCnt);

        // 試験結果表示用の試験マスタ、試験問題マップ、受験履歴、解答履歴、合否判定を取得
        return await resultService(tEmployee.id, testId, testCnt);
    });

    return (
        <div className="px-6">
            <div className="max-w-6xl mx-auto">
                {/* 見出し */}
                <div className="mb-6">
                    <div className="bg-base-300 text-gray-800 text-4xl font-bold py-4 text-center rounded-lg shadow-md">
                        試験結果
                    </div>
                </div>

                {/* 合否表示 */}
                <div className="flex justify-center mb-6">
                    <div className={`${isPass ? 'bg-success' : 'bg-error'} text-white text-lg font-semibold py-4 px-10 rounded-md shadow`}>
                        【{isPass ? '合格' : '不合格'}】正解率： {Number(tTest.correctNum * 100 / mTest.questionNum)}%
                    </div>
                </div>

                {/* 結果テーブル */}
                <div className="p-3 bg-white shadow rounded">
                    <div className="overflow-x-auto max-h-[500px]">
                        <table className="table table-pin-rows table-pin-cols">
                            <thead>
                                <tr className="text-center text-gray-600">
                                    <th>No</th>
                                    <th colSpan={2}>問題 / 解説</th>
                                    <th>解答</th>
                                    <th>正解</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tTestAnswers.map((tTestAnswer, i) => {
                                    const mTestQuestion = mTestQuestionMap[tTestAnswer.questionNo];
                                    if (mTestQuestion.commentary) {
                                        return (
                                            <React.Fragment key={i}>
                                                <tr className={`text-gray-600 ${i % 2 === 0 ? 'bg-base-100' : 'bg-base-200'}`}>
                                                    <td rowSpan={2} className="text-center">{i + 1}</td>
                                                    <td className="text-center">問<br />題</td>
                                                    <td>{mTestQuestion.question}</td>
                                                    <td rowSpan={2} className="text-center">{tTestAnswer.answer ? 'Yes' : 'No'}</td>
                                                    <td rowSpan={2} className="text-center">{tTestAnswer.answer === mTestQuestion.correct ? '〇' : '×'}</td>
                                                </tr>
                                                <tr className={`text-gray-600 ${i % 2 === 0 ? 'bg-base-100' : 'bg-base-200'}`}>
                                                    <td className="text-center">解<br />答</td>
                                                    <td>{mTestQuestion.commentary}</td>
                                                </tr>
                                            </React.Fragment>
                                        );
                                    } else {
                                        return (
                                            <tr key={i} className={`text-gray-600 ${i % 2 === 0 ? 'bg-base-100' : 'bg-base-200'}`}>
                                                <td className="text-center">{i + 1}</td>
                                                <td className="text-center">問<br />題</td>
                                                <td>{mTestQuestion.question}</td>
                                                <td className="text-center">{tTestAnswer.answer ? 'Yes' : 'No'}</td>
                                                <td className="text-center">{tTestAnswer.answer === mTestQuestion.correct ? '〇' : '×'}</td>
                                            </tr>
                                        );
                                    }
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ホームへボタン */}
                <HomeButton />

            </div>
        </div >
    );
}