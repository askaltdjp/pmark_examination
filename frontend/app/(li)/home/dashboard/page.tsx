import { redirect } from "next/navigation";
import { headers } from 'next/headers';
import { getEmployeeFromRequest } from "@/lib/utils/employeeUtils";
import { MTestRepository } from "@/lib/repositories/master/mTestRepository";
import { TTestRepository } from "@/lib/repositories/transaction/tTestRepository";
import ExamHistoryList from "@/components/home/dashboard/ExamHistoryList";
import StartExamButton from "@/components/home/dashboard/StartExamButton";

/**
 * ホーム画面のサーバコンポーネント
 */
export default async function DashBoardPage() {
    // リクエストヘッダから社員情報を取得
    // 社員情報が取得できなければログイン画面へリダイレクト
    const tEmployee = await (async () => {
        try {
            const requestHeaders = await headers();
            return await getEmployeeFromRequest(requestHeaders);
        } catch (error) {
            redirect("/auth/login");
        }
    })();

    // 実施中の試験情報取得
    const mTest = await MTestRepository.findActive();

    // 実施中の試験に対する受験履歴取得
    const tTests = mTest ? await TTestRepository.findAllByEmployeeIdAndTestId(tEmployee.id, mTest.id) : [];

    return (
        <div className="max-w-6xl mx-auto text-gray-900 rounded">
            {/* 情報テーブル */}
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