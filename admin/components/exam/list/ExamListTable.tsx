"use client";

import { MTest } from ".prisma/client_master";
import { TestSummaryRecord } from "@/lib/definitions/types";
import { formatDate } from "@/lib/utils/timeUtils";
import DeleteButton from "@/components/exam/list/DeleteButton";
import StatusButton from "@/components/exam/list/StatusButton";
import EditButton from "@/components/exam/list/EditButton";
import { deleteAction } from "@/app/actions/exam/deleteAction";
import { useState } from "react";

/**
 * 試験一覧テーブルのクライアントコンポーネント
 */
export default function ExamListTable({
    mTests: initMTests,
    testSummary,
}: {
    mTests: MTest[];
    testSummary: TestSummaryRecord;
}) {
    const [mTests, setMTests] = useState(initMTests);

    // 削除ボタン押下時の処理
    const handleDeleteButtonClick = async (testId: number) => {
        // 試験の削除確認
        const confirmed = window.confirm("削除すると元に戻すことができません。\n本当に削除しますか？");
        if (!confirmed) {
            return;
        }

        // 試験の削除
        try {
            // テーブルから該当試験のレコードを削除
            await deleteAction(testId);
            // 画面から該当試験の行を削除
            setMTests((prev) => prev.filter(mTest => mTest.id !== testId));
            alert("削除が完了しました。");
        } catch (error) {
            console.error("試験削除時のエラー:", error);
            alert(error instanceof Error ? error.message : "予期しないエラーが発生しました。");
        }
    };

    return (
        <div className="flex justify-center max-h-[70vh]">
            <div className="w-[100%] p-3 bg-white shadow rounded">
                <div className="h-full overflow-y-auto">
                    <table className="table table-zebra w-full">
                        <thead className="sticky top-0 bg-white">
                            <tr className="text-center text-gray-600">
                                <th className="w-10">ID</th>
                                <th>試験名</th>
                                <th className="w-28">開始日</th>
                                <th className="w-28">終了日</th>
                                <th className="w-12">受験者数</th>
                                <th className="w-12">合格者数</th>
                                <th className="w-53">操作</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {mTests.map((mTest, i) => {
                                return (
                                    <tr key={mTest.id} className="text-gray-600">
                                        <td className="text-center">{mTest.id}</td>
                                        <td>{mTest.name}</td>
                                        <td className="text-center">{formatDate(mTest.startAt, "YYYY/MM/DD")}</td>
                                        <td className="text-center">{formatDate(mTest.endAt, "YYYY/MM/DD")}</td>
                                        <td className="text-center">{testSummary[mTest.id]?.examineeNum ?? 0}</td>
                                        <td className="text-center">{testSummary[mTest.id]?.passerNum ?? 0}</td>
                                        <td className="text-center">
                                            {/* 変更ボタン */}
                                            <EditButton testId={mTest.id} />
                                            {/* 状況ボタン */}
                                            <StatusButton testId={mTest.id} />
                                            {/* 削除ボタン */}
                                            <DeleteButton mTest={mTest} onDelete={() => handleDeleteButtonClick(mTest.id)} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}