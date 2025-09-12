"use client";

import { useRouter } from "next/navigation";

/**
 * 変更ボタンのクライアントコンポーネント
 */
export default function EditButton({ employeeId }: { employeeId: number }) {
    const router = useRouter();

    // 変更ボタン押下時の処理
    const handleEditButtonClick = () => {
        router.push(`/employee/edit?employeeId=${employeeId}`);
    };

    return (
        <button
            className="btn btn-sm bg-slate-600 hover:bg-slate-500 text-white mx-1"
            onClick={handleEditButtonClick}
        >
            変更
        </button>
    );
}