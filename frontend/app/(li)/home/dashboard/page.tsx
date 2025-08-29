import { headers } from "next/headers";
import { getEmployeeFromRequest } from "@/lib/utils/employeeUtils";
import { dashboardService } from "@/services/web/home/dashboardService";
import { withRedirectErrorHandler } from "@/lib/utils/withRedirectErrorHandler";
import { formatDate } from "@/lib/utils/timeUtils";
import { TestResult, testResultLabels } from "@/lib/definitions/labels";
import ConfirmButton from "@/components/home/dashboard/ConfirmButton";
import StartExamButton from "@/components/home/dashboard/StartExamButton";

/**
 * ホーム画面のサーバコンポーネント
 */
export default async function DashBoardPage() {
    const { tEmployee, mTest, tTests } = await withRedirectErrorHandler(async () => {
        // リクエストヘッダから社員情報を取得し、認証済みかを判定
        const requestHeaders = await headers();
        const tEmployee = await getEmployeeFromRequest(requestHeaders);

        // ダッシュボード用の試験マスタと受験履歴を取得
        const dashboardData = await dashboardService(tEmployee.id);

        return { tEmployee, ...dashboardData };
    });

    return (
        <div className="max-w-6xl mx-auto text-gray-900 rounded">
            {/* 社員情報と試験内容の概要表示 */}
            <div className="p-3 bg-white shadow rounded">
                <div className="rounded-box border border-base-content/5 bg-base-100">
                    <table className="table">
                        <tbody>
                            <tr className="text-center">
                                <th className="text-gray-600 bg-base-200 w-[30%]">
                                    氏名
                                </th>
                                <td>
                                    {tEmployee.name}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="rounded-box border border-base-content/5 bg-base-100 mt-2">
                    <table className="table">
                        <tbody>
                            <tr className="text-center">
                                <th className="text-gray-600 bg-base-200 w-[30%]">
                                    試験内容
                                </th>
                                <td>
                                    {mTest?.name ?? "実施中の試験はありません"}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 受験履歴テキスト */}
            <h2 className="text-gray-600 text-3xl font-bold text-center mb-4 pt-8">受験履歴</h2>

            {/* 受験履歴一覧 */}
            {(!mTest || tTests.length === 0) ? (
                <div className="text-center text-gray-800 text-lg font-semibold py-6">
                    受験履歴がありません
                </div>
            ) : (
                <div className="p-3 bg-white shadow rounded">
                    <div className="overflow-x-auto max-h-[500px]">
                        <table className="table table-zebra table-pin-rows table-pin-cols">
                            <thead>
                                <tr className="text-center text-gray-600">
                                    <th>受験日時</th>
                                    <th>正解状況</th>
                                    <th>結果</th>
                                    <th>解答</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tTests.map((tTest, i) => {
                                    const date = formatDate(tTest.testAt);
                                    const correctNum = (tTest.result === TestResult.Interrupted) ? '?'.repeat(String(mTest.questionNum).length) : tTest.correctNum;
                                    const correct = `${correctNum} / ${mTest.questionNum}`;
                                    const result = testResultLabels[tTest.result];
                                    return (
                                        <tr key={i} className="text-center">
                                            <td>{date}</td>
                                            <td>{correct}</td>
                                            <td>{result}</td>
                                            {/* 確認ボタン */}
                                            <td><ConfirmButton tTest={tTest} /></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 試験開始ボタン */}
            <StartExamButton mTest={mTest} tTest={tTests.length > 0 ? tTests[0] : null} />
        </div >
    );
}