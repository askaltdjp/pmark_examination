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
            className="btn bg-[#6E5E48] hover:bg-[#544734] text-white mx-1"
            onClick={handleStateButtonClick}
        >
            状 況
        </button>
    );
}