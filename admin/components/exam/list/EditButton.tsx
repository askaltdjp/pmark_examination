"use client";

import { useRouter } from "next/navigation";

/**
 * 変更ボタンのクライアントコンポーネント
 */
export default function EditButton({ testId }: { testId: number }) {
    const router = useRouter();

    // 変更ボタン押下時の処理
    const handleEditButtonClick = () => {
        router.push(`/exam/edit?testId=${testId}`);
    };

    return (
        <button
            className="btn btn-md bg-slate-600 hover:bg-slate-500 text-white mx-1"
            onClick={handleEditButtonClick}
        >
            変 更
        </button>
    );
}