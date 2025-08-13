import { redirect } from "next/navigation";
import { headers } from 'next/headers';
import { MTestRepository } from "@/lib/repositories/master/mTestRepository";
import { TEmployeeRepository } from "@/lib/repositories/transaction/tEmployeeRepository";
import { TTestRepository } from "@/lib/repositories/transaction/tTestRepository";
import { EMPLOYEE_ID_HEADER } from "@/lib/constants/system";
import ExamHistoryList from "@/components/home/dashboard/ExamHistoryList";
import StartExamButton from "@/components/home/dashboard/StartExamButton";

/**
 * ホーム画面のサーバコンポーネント
 */
export default async function DashBoardPage() {
    // カスタムヘッダから従業員IDを取得し、数値に変換
    const requestHeaders = await headers();
    const employeeId = Number(requestHeaders.get(EMPLOYEE_ID_HEADER));

    // 従業員IDを元にDBから従業員情報を取得
    const tEmployee = await TEmployeeRepository.findById(employeeId);

    // 従業員情報が取得できなければログイン画面へリダイレクト
    if (!tEmployee) {
        redirect("/auth/login");
    }

    // 実施中の試験情報取得
    const mTest = await MTestRepository.findActive();

    // 実施中の試験に対する受験履歴取得
    const tTests = mTest ? await TTestRepository.findAllByEmployeeIdAndTestId(employeeId, mTest.id) : [];

    return (
        <div className="max-w-6xl mx-auto text-gray-900 rounded pt-2 pb-6 px-6">
            {/* 情報テーブル */}
            <table className="w-full border border-gray-600 border-collapse mb-10 text-sm">
                <tbody>
                    <tr>
                        <th className="text-left align-middle pl-4 pr-4 py-3 w-28 text-black font-semibold bg-gray-300 border border-gray-600">
                            氏名
                        </th>
                        <td className="align-middle pl-4 py-3 w-auto border border-gray-600 bg-white">
                            {tEmployee.name}
                        </td>
                    </tr>
                    <tr>
                        <th className="text-left align-middle pl-4 pr-4 py-3 w-28 text-black font-semibold bg-gray-300 border border-gray-600">
                            試験内容
                        </th>
                        <td className="align-middle pl-4 py-3 w-auto border border-gray-600 bg-white">
                            {mTest?.name ?? "実施中の試験はありません"}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* 「受験履歴」テキスト */}
            <h2 className="text-center text-lg font-semibold mb-4">受験履歴</h2>

            {/* 受験履歴テーブル */}
            <ExamHistoryList mTest={mTest} tTests={tTests} />

            {/* 試験開始ボタン */}
            <StartExamButton mTest={mTest} tTest={tTests.length > 0 ? tTests[0] : null} />
        </div>
    );
}