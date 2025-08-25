import { headers } from "next/headers";
import { getEmployeeFromRequest } from "@/lib/utils/employeeUtils";
import { dashboardService } from "@/services/web/home/dashboardService";
import { withRedirectErrorHandler } from "@/lib/utils/withRedirectErrorHandler";
import ExamHistoryList from "@/components/home/dashboard/ExamHistoryList";
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
            {/* 氏名と試験内容 */}
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

            {/* 受験履歴テーブル */}
            <ExamHistoryList mTest={mTest} tTests={tTests} />

            {/* 試験開始ボタン */}
            <StartExamButton mTest={mTest} tTest={tTests.length > 0 ? tTests[0] : null} />
        </div >
    );
}