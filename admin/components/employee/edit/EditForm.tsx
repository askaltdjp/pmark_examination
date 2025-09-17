"use client";

import { EMPLOYEE_DEFAULT_PASSWORD_LENGTH } from "@/lib/definitions/system";
import { formatDate } from "@/lib/utils/timeUtils";
import { TEmployee } from ".prisma/client_transaction";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { editAction } from "@/app/actions/employee/editAction";

/**
 * 変更フォームのクライアントコンポーネント
 */
export default function EditForm({ tEmployee }: { tEmployee: TEmployee; }) {
    const router = useRouter();
    const [employeeNo, setEmployeeNo] = useState(tEmployee.employeeNo);
    const [name, setName] = useState(tEmployee.name);
    const [joinDate, setJoinDate] = useState(formatDate(tEmployee.joinDate, "YYYY-MM-DD"));
    const [emailAddress, setEmailAddress] = useState(tEmployee.emailAddress);
    const [password, setPassword] = useState(tEmployee.password);

    // 変更ボタン押下時の処理
    const handleEditButtonClick = async () => {
        const trimmedEmployeeNo = employeeNo.trim();
        const trimmedName = name.trim();
        const trimmedJoinDate = joinDate.trim();
        const trimmedEmailAddress = emailAddress.trim();
        const trimmedPassword = password.trim();

        try {
            // 社員番号の入力チェック
            if (!trimmedEmployeeNo) {
                throw new Error("社員番号を入力してください。");
            }

            // 氏名の入力チェック
            if (!trimmedName) {
                throw new Error("氏名を入力してください。");
            }

            // 入社日の入力チェック
            if (!trimmedJoinDate) {
                throw new Error("入社日を入力してください。");
            }

            // メールアドレスの入力チェック
            if (!trimmedEmailAddress) {
                throw new Error("メールアドレスを入力してください。");
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmailAddress)) {
                throw new Error("メールアドレスの形式が正しくありません。");
            }

            // パスワードの入力チェック
            if (!trimmedPassword) {
                throw new Error("パスワードを入力してください。");
            }
            if (trimmedPassword.length < EMPLOYEE_DEFAULT_PASSWORD_LENGTH) {
                throw new Error(`パスワードは ${EMPLOYEE_DEFAULT_PASSWORD_LENGTH} 文字以上で入力してください。`);
            }

            // 社員情報の変更
            await editAction(
                tEmployee.id,
                trimmedEmployeeNo,
                trimmedName,
                trimmedEmailAddress,
                trimmedPassword,
                new Date(trimmedJoinDate),
            );
            alert("社員情報の変更に成功しました。\n社員一覧画面に戻ります。");
            router.push("/employee/list");
        } catch (error) {
            console.error("社員変更時のエラー:", error);
            alert(error instanceof Error ? error.message : "予期しないエラーが発生しました。");
        }
    };

    return (
        <>
            <div className="bg-white px-8 py-6 rounded-xl shadow-md text-gray-800">
                <table className="w-full">
                    <tbody>
                        {/* 1行目：社員番号と氏名 */}
                        <tr>
                            <th className="text-left text-sm font-semibold text-gray-700 py-5 pr-6 whitespace-nowrap w-32">
                                社員番号
                            </th>
                            <td className="py-5 pr-10">
                                <input
                                    type="text"
                                    value={employeeNo}
                                    maxLength={64}
                                    onChange={e => setEmployeeNo(e.target.value)}
                                    className="input input-bordered input-md w-[360px] focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </td>

                            <th className="text-left text-sm font-semibold text-gray-700 py-5 pr-6 whitespace-nowrap w-32">
                                氏名
                            </th>
                            <td className="py-5">
                                <input
                                    type="text"
                                    value={name}
                                    maxLength={64}
                                    onChange={e => setName(e.target.value)}
                                    className="input input-bordered input-md w-[360px] focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </td>
                        </tr>

                        {/* 2行目：入社日とメールアドレス */}
                        <tr>
                            <th className="text-left text-sm font-semibold text-gray-700 py-5 pr-6 whitespace-nowrap w-32">
                                入社日
                            </th>
                            <td className="py-5 pr-10">
                                <input
                                    type="date"
                                    value={joinDate}
                                    onChange={e => setJoinDate(e.target.value)}
                                    min="1900-12-31"
                                    max="2100-12-31"
                                    className="input input-bordered input-md w-[360px] focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </td>

                            <th className="text-left text-sm font-semibold text-gray-700 py-5 pr-6 whitespace-nowrap w-32">
                                メールアドレス
                            </th>
                            <td className="py-5">
                                <input
                                    type="email"
                                    value={emailAddress}
                                    maxLength={256}
                                    onChange={e => setEmailAddress(e.target.value)}
                                    className="input input-bordered input-md w-[360px] focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </td>
                        </tr>

                        {/* 3行目：パスワード */}
                        <tr>
                            <th className="text-left text-sm font-semibold text-gray-700 py-5 pr-6 whitespace-nowrap w-32">
                                パスワード
                            </th>
                            <td className="py-5" colSpan={3}>
                                <input
                                    type="text"
                                    value={password}
                                    maxLength={64}
                                    onChange={e => setPassword(e.target.value)}
                                    className="input input-bordered input-md w-[360px] focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center">
                <div className="w-[100%] text-right py-3">
                    <button
                        className="btn bg-[#2A5D9F] hover:bg-[#204673] text-white mx-1 w-28"
                        onClick={handleEditButtonClick}
                    >
                        変 更
                    </button>
                </div>
            </div>
        </>
    );
}