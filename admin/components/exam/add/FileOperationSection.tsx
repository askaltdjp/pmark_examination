"use client";

import { addAction } from "@/app/actions/exam/addAction";
import { importAction } from "@/app/actions/exam/importAction";
import { MAX_QUESTION_NUM } from "@/lib/definitions/system";
import { ExamState, QuestionData } from "@/lib/definitions/types";
import { currentJST } from "@/lib/utils/timeUtils";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

/**
 * ファイル操作と登録ボタンのクライアントコンポーネント
 */
export default function FileOperationSection({
    examState: {
        name,
        startAt,
        endAt,
        questionNum,
        passNum,
    },
}: {
    examState: ExamState;
}) {
    const [questionDataList, setQuestionDataList] = useState<QuestionData[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // 参照ボタン押下時の処理
    const handleFileUploadButtonClick = () => {
        fileInputRef.current?.click();
    };

    // インポートボタン押下時の処理
    const handleImportButtonClick = async () => {
        try {
            // インポートファイルの入力チェック
            const file = fileInputRef.current?.files?.[0];
            if (!file) {
                throw new Error("インポートファイルが選択されていません。");
            }
            if (file.size <= 0) {
                throw new Error("インポートファイルの中身が空です。");
            }

            // 送信用のフォームデータ作成
            const formData = new FormData();
            formData.append("file", file);

            // 試験問題のインポート処理の実行
            const questionDataList = await importAction(formData);
            // 問題一覧に反映
            setQuestionDataList(questionDataList);
            alert("試験問題のインポートが完了しました。");
        } catch (error) {
            console.error("試験問題インポート時のエラー:", error);
            alert(error instanceof Error ? error.message : "予期しないエラーが発生しました。");
        } finally {
            // ファイル選択中にファイルを編集したらエラーが発生するための対応
            // ファイル入力の値をリセットして、同じファイルを再度選択できるようにする
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    // 登録ボタン押下時の処理
    const handleAddButtonClick = async () => {
        try {
            // 試験名の入力チェック
            if (!name.trim()) {
                throw new Error("試験名を入力してください。");
            }

            // 開始日の入力チェック
            if (!startAt.trim()) {
                throw new Error("開始日を入力してください。");
            }
            const startDate = new Date(startAt);

            // 終了日の入力チェック
            if (!endAt.trim()) {
                throw new Error("終了日を入力してください。");
            }
            const endDate = new Date(endAt);
            const now = currentJST();
            now.setHours(0, 0, 0, 0);
            if (endDate < now) {
                throw new Error("終了日は本日以降の日付を入力してください。");
            }

            // 開始日と終了日の整合性チェック
            if (startDate > endDate) {
                throw new Error("期間の開始日は終了日より前または同じ日にしてください。");
            }

            // 出題数の入力チェック
            if (!questionNum.trim()) {
                throw new Error("出題数を入力してください。");
            }
            const questionNumVal = Number(questionNum);
            if (questionNumVal < 1 || questionNumVal > MAX_QUESTION_NUM) {
                throw new Error(`出題数は 1 ～ ${MAX_QUESTION_NUM} の間で入力してください。`);
            }

            // 出題数と試験問題の整合性チェック
            if (questionDataList.length < questionNumVal) {
                throw new Error("出題数は登録問題数以下で入力してください。");
            }

            // 合格数の入力チェック
            if (!passNum.trim()) {
                throw new Error("合格数を入力してください。");
            }
            const passNumVal = Number(passNum);

            // 出題数と合格数の整合性チェック
            if (questionNumVal < passNumVal) {
                throw new Error("合格数は出題数以下で入力してください。");
            }

            // 試験問題の入力チェック
            if (questionDataList.length <= 0) {
                throw new Error("試験問題がインポートされていません。");
            }

            // 試験情報の新規登録
            await addAction(
                name,
                startDate,
                endDate,
                questionNumVal,
                passNumVal,
                questionDataList,
            );
            alert("試験情報の新規登録に成功しました。\n試験一覧画面に戻ります。");
            router.push("/exam/list");
        } catch (error) {
            console.error("試験登録時のエラー:", error);
            alert(error instanceof Error ? error.message : "予期しないエラーが発生しました。");
        }
    };

    return (
        <>
            {/* 試験問題一覧 */}
            <div className="bg-white rounded-xl shadow-md w-full text-gray-800 mb-4 p-3">
                <div className="overflow-y-auto max-h-[380px]">
                    <table className="table table-zebra w-full border border-gray-300 border-separate border-spacing-0 text-gray-700 text-[15px]">
                        <thead className="text-center py-2 bg-gray-200 text-gray-800" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                            <tr>
                                <th className="text-center py-2" style={{ width: '5%' }}>No</th>
                                <th className="text-center py-2" style={{ width: '45%' }}>問題文</th>
                                <th className="text-center py-2" style={{ width: '45%' }}>解説</th>
                                <th className="text-center py-2" style={{ width: '5%' }}>正解</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questionDataList.map(questionData => (
                                <tr key={questionData.questionNo}>
                                    <td className="text-center align-middle">{questionData.questionNo}</td>
                                    <td className="whitespace-pre-wrap align-top">
                                        {questionData.question}
                                    </td>
                                    <td className="whitespace-pre-wrap align-top">{questionData.commentary}</td>
                                    <td className="text-center align-middle">{questionData.correct ? "Yes" : "No"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="w-full max-w-7xl mx-auto mb-4">
                <div className="grid grid-cols-[4fr_1fr_1fr] gap-4 items-start">

                    {/* ファイル選択 */}
                    <div className="flex border border-gray-400 rounded overflow-hidden h-10">
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept=".csv"
                            className="file-input file-input-bordered file-input-sm w-full rounded-none border-none focus:outline-none text-gray-800"
                            style={{ height: '100%' }}
                        />
                        <button
                            className="btn btn-sm btn-outline btn-secondary h-full"
                            onClick={handleFileUploadButtonClick}
                        >
                            参 照
                        </button>
                    </div>

                    {/* インポート */}
                    <button
                        className="btn bg-[#c4623f] hover:bg-[#9b4e31] text-white w-full h-10"
                        onClick={handleImportButtonClick}
                    >
                        インポート
                    </button>

                    {/* エクスポート + 登録 */}
                    <div className="flex flex-col items-stretch gap-4 w-full">
                        <button className="btn bg-[#c4623f] hover:bg-[#9b4e31] text-white w-full h-10" disabled>エクスポート</button>
                        <button
                            className="btn bg-[#3B7A57] hover:bg-[#2F5E42] text-white w-full h-10"
                            onClick={handleAddButtonClick}
                        >
                            登 録
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}