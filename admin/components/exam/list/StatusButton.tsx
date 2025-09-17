"use client";

import { useRouter } from "next/navigation";

/**
 * 状況ボタンのクライアントコンポーネント
 */
export default function StatusButton({ testId }: { testId: number }) {
    const router = useRouter();

    // 状況ボタン押下時の処理
    const handleStateButtonClick = () => {
        router.push(`/exam/state?testId=${testId}`)
    };

    return (
        <button
            className="btn btn-md bg-slate-600 hover:bg-slate-500 text-white mx-1"
            onClick={handleStateButtonClick}
        >
            状 況
        </button>
    );
}