"use client";

import { useRouter } from "next/navigation";

/**
 * 新規登録ボタンのクライアントコンポーネント
 */
export default function AddButton() {
    const router = useRouter();

    // 新規登録ボタン押下時の処理
    const handleAddButtonClick = () => {
        router.push("/employee/add");
    };

    return (
        <div className="flex justify-center">
            <div className="w-[100%] text-right py-3">
                <button
                    className="btn bg-[#3B7A57] hover:bg-[#2F5E42] text-white mx-1 px-10"
                    onClick={handleAddButtonClick}
                >
                    新規登録
                </button>
            </div>
        </div>
    );
}