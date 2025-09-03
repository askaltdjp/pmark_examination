"use client";

/**
 * 新規登録ボタンのクライアントコンポーネント
 */
export default function CreateButton() {
    return (
        <div className="flex justify-center">
            <div className="w-[90%] text-right py-3">
                <button className="btn border-slate-500 bg-slate-600 hover:bg-slate-500 text-white mx-1">
                    新規登録
                </button>
            </div>
        </div>
    );
}