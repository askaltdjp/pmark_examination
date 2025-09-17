"use client";

import { formatDate } from "@/lib/utils/timeUtils";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import { TEmployee } from ".prisma/client_transaction/client";
import { useMemo, useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
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
                        <div className="flex justify-center gap-2">
                            <EditButton employeeId={rowData.id} />
                            <DeleteButton onDelete={() => handleDeleteButtonClick(rowData.id)} />
                        </div>
                    );
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
        const confirmed = window.confirm("削除すると元に戻すことができません。\n本当に削除しますか？");
        if (!confirmed) {
            return;
        }

        try {
            await deleteAction(employeeId);
            setTEmployees(prev => prev.filter(tEmployee => tEmployee.id !== employeeId));
            alert("削除が完了しました。");
        } catch (error) {
            console.error("社員削除時のエラー:", error);
            alert(error instanceof Error ? error.message : "予期しないエラーが発生しました。");
        }
    };

    return (
        <div className="flex justify-center max-h-[70vh] text-sm">
            <div className="w-[100%] p-3 bg-white shadow rounded">
                <div className="h-full overflow-y-auto">
                    <table className="table table-zebra w-full text-sm">
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
                                            {header.column.getCanSort() && (
                                                <span className="ml-1 text-sm">
                                                    {{
                                                        asc: "🔼",
                                                        desc: "🔽",
                                                    }[header.column.getIsSorted() as string] ?? "⇅"}
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
                                        <td key={cell.id} className="text-center align-middle text-gray-800 py-2">
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
