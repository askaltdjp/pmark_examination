"use client";

import { formatDate } from "@/lib/utils/timeUtils";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import { TEmployee } from ".prisma/client_transaction/client";
import { useMemo, useState } from "react";
import { flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { deleteAction } from "@/app/actions/employee/deleteAction";

/**
 * 社員一覧テーブルのクライアントコンポーネント
 */
export default function EmployeeListTable({
    tEmployees: initTEmployees,
}: {
    tEmployees: TEmployee[];
}) {
    const [tEmployees, setTEmployees] = useState(initTEmployees);
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
                header: "氏名",
                cell: (info: any) => info.getValue(),
            },
            {
                accessorKey: "joinDate",
                header: "入社日",
                cell: (info: any) => formatDate(info.getValue() as Date, "YYYY/MM/DD"),
            },
            {
                accessorKey: "emailAddress",
                header: "メールアドレス",
                cell: (info: any) => info.getValue(),
            },
            {
                accessorKey: "action",
                header: "操作",
                cell: (info: any) => {
                    const rowData: TEmployee = info.row.original;
                    return (
                        <>
                            {/* 変更ボタン */}
                            <EditButton employeeId={rowData.id} />
                            {/* 削除ボタン */}
                            <DeleteButton onDelete={() => handleDeleteButtonClick(rowData.id)} />
                        </>
                    )
                },
                enableSorting: false,
            },
        ],
        []
    );

    // テーブルインスタンス作成
    const table = useReactTable({
        data: tEmployees,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: false,
    });

    // 削除ボタン押下時の処理
    const handleDeleteButtonClick = async (employeeId: number) => {
        // 社員の削除確認
        const confirmed = window.confirm("削除すると元に戻すことができません。\n本当に削除しますか？");
        if (!confirmed) {
            return;
        }

        // 社員の削除
        try {
            // テーブルから該当社員のレコードを削除
            await deleteAction(employeeId);
            // 画面から該当社員の行を削除
            setTEmployees(prev => prev.filter(tEmployee => tEmployee.id !== employeeId));
            alert("削除が完了しました。");
        } catch (error) {
            console.error("社員削除時のエラー:", error);
            alert(error instanceof Error ? error.message : "予期しないエラーが発生しました。");
        }
    };

    return (
        <div className="flex justify-center max-h-[70vh]">
            <div className="w-[100%] p-3 bg-white shadow rounded">
                <div className="h-full overflow-y-auto">
                    <table className="table table-zebra w-full">
                        <thead className="sticky top-0 bg-white">
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
                        <tbody className="bg-white">
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="text-center align-middle text-gray-800">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}