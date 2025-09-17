"use client";

import { addAction } from "@/app/actions/employee/addAction";
import { EMPLOYEE_DEFAULT_PASSWORD_LENGTH } from "@/lib/definitions/system";
import { generateSecureRandomString } from "@/lib/utils/stringUtils";
import { currentJST, formatDate } from "@/lib/utils/timeUtils";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * 登録フォームのクライアントコンポーネント
 */
export default function AddForm() {
    const router = useRouter();
    const [employeeNo, setEmployeeNo] = useState("");
    const [name, setName] = useState("");
    const [joinDate, setJoinDate] = useState(formatDate(currentJST(), "YYYY-MM-DD"));
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState(generateSecureRandomString(EMPLOYEE_DEFAULT_PASSWORD_LENGTH));

    // 登録ボタン押下時の処理
    const handleAddButtonClick = async () => {
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

            // 社員情報の新規登録
            await addAction(
                trimmedEmployeeNo,
                trimmedName,
                trimmedEmailAddress,
                trimmedPassword,
                new Date(trimmedJoinDate),
            );
            alert("社員情報の新規登録に成功しました。\n社員一覧画面に戻ります。");
            router.push("/employee/list");
        } catch (error) {
            console.error("社員登録時のエラー:", error);
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
                        className="btn bg-[#3B7A57] hover:bg-[#2F5E42] text-white mx-1 w-28"
                        onClick={handleAddButtonClick}
                    >
                        登 録
                    </button>
                </div>
            </div>
        </>
    );
}