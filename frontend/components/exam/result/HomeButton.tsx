"use client";

import { useRouter } from "next/navigation";

/**
 * ホームへボタンのクライアントコンポーネント
 */
export default function HomeButton() {
    const router = useRouter();

    // ホームへボタン押下時の処理
    const handleHomeButtonClick = () => {
        router.push("/home/dashboard");
    };

    return (
        <div className="flex justify-center mt-6">
            <button className="btn btn-lg bg-slate-600 hover:bg-slate-500 text-white" onClick={handleHomeButtonClick}>
                ホームへ
            </button>
        </div>
    );
}