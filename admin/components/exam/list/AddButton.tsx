"use client";

import { useRouter } from "next/navigation";

/**
 * 新規登録ボタンのクライアントコンポーネント
 */
export default function AddButton() {
    const router = useRouter();

    // 新規登録ボタン押下時の処理
    const handleAddButtonClick = () => {
        router.push("/exam/add");
    };

    return (
        <div className="flex justify-center">
            <div className="w-[100%] text-right py-3">
                <button
                    className="btn bg-slate-600 hover:bg-slate-500 text-white mx-1"
                    onClick={handleAddButtonClick}
                >
                    新規登録
                </button>
            </div>
        </div>
    );
}