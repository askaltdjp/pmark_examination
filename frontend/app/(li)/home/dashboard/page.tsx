import { redirect } from "next/navigation";
import { headers } from 'next/headers';
import { TEmployeeRepository } from "@/lib/repositories/tEmployeeRepository";
import { EMPLOYEE_ID_HEADER } from "@/lib/constants";
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
    const tEmployeeRepository = new TEmployeeRepository();
    const tEmployee = await tEmployeeRepository.findById(employeeId);

    // 従業員情報が取得できなければログイン画面へリダイレクト
    if (!tEmployee) {
        redirect("/auth/login");
    }

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
                            〇〇〇〇〇〇
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* 「受験履歴」テキスト */}
            <h2 className="text-center text-lg font-semibold mb-4">受験履歴</h2>

            {/* 受験履歴テーブル */}
            <ExamHistoryList />

            {/* 試験開始ボタン */}
            <StartExamButton />
        </div>
    );
}