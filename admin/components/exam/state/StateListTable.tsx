"use client";

import { StateData } from "@/lib/definitions/types";
import { downloadFileFromPost } from "@/lib/utils/downloadUtils";
import { formatDate } from "@/lib/utils/timeUtils";
import { flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";

/**
 * 受験状況一覧テーブルのクライアントコンポーネント
 */
export default function StateListTable({
    testId,
    stateDataList
}: {
    testId: number;
    stateDataList: StateData[];
}) {
    const [sorting, setSorting] = useState<SortingState>([]);

    // TanStack Table用の列定義
    const columns = useMemo(
        () => [
            {
                accessorKey: "employeeNo",
                header: "社員No",
                cell: (info: any) => info.getValue(),
            },
            {
                accessorKey: "name",
                header: "受験者名",
                cell: (info: any) => info.getValue(),
            },
            {
                accessorKey: "testCnt",
                header: "受験回数",
                cell: (info: any) => info.getValue(),
            },
            {
                accessorKey: "testAt",
                header: "最終受験日時",
                cell: (info: any) =>
                    info.getValue() === null
                        ? "-"
                        : formatDate(info.getValue() as Date, "YYYY/MM/DD HH:mm"),
            },
            {
                accessorKey: "result",
                header: "合否",
                cell: (info: any) => {
                    const val = info.getValue() as boolean | null;
                    return val === null
                        ? "-"
                        : (val ? "〇" : "✕");
                },
            },
            {
                accessorKey: "action",
                header: "解答",
                cell: (info: any) => {
                    const rowData: StateData = info.row.original;
                    return (
                        <button
                            className="btn btn-md bg-slate-600 hover:bg-slate-500 text-white mx-1"
                            disabled={rowData.lastJudgedTestCnt === null}
                            onClick={() => handleConfirmButtonClick(rowData.employeeId, testId, rowData.lastJudgedTestCnt)}
                        >
                            確 認
                        </button>
                    )
                },
                enableSorting: false,
            },
        ],
        []
    );

    // テーブルインスタンス作成
    const table = useReactTable({
        data: stateDataList,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: false,
    });

    // 確認ボタン押下時の処理
    const handleConfirmButtonClick = async (employeeId: number, testId: number, testCnt: number | null) => {
        // null の場合、通常はボタンが非活性のため呼ばれないが、念のためチェック
        if (testCnt === null) {
            return;
        }
        // 0 の場合は、まだ一度も合否判定を受けていない状態のため、最終受験時の解答をダウンロードすることはできない
        if (testCnt === 0) {
            alert("合否判定を一度も受けていないため、最終受験時の解答をダウンロードできません。");
            return;
        }

        await downloadFileFromPost("/api/exam/download-result", {
            employeeId,
            testId,
            testCnt,
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-md w-full text-gray-800 mb-4 p-3">
            <div className="overflow-y-auto max-h-[480px]">
                <table className="table table-zebra w-full border border-gray-300 border-separate border-spacing-0 text-gray-700 text-[15px]">
                    <thead
                        style={{ backgroundColor: '#f0f0f0', position: 'sticky', top: 0, zIndex: 10 }}
                    >
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="text-center py-2 bg-gray-200 text-gray-800 cursor-pointer select-none"
                                        style={{ width: header.column.columnDef.size }}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {/* ソート状態を表示 */}
                                        {header.column.getCanSort() && (
                                            <span className="ml-1 text-sm">
                                                {{
                                                    asc: "🔼",
                                                    desc: "🔽",
                                                }[header.column.getIsSorted() as string] ?? "⇅" /* ← 初期状態は薄い双方向アイコン */}
                                            </span>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="text-center align-middle">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}