"use client";

/**
 * 削除ボタンのクライアントコンポーネント
 */
export default function DeleteButton({ onDelete }: { onDelete: () => void }) {
    return (
        <button
            className="btn bg-[#A53E3E] hover:bg-[#732C2C] text-white mx-1"
            onClick={onDelete}
        >
            削 除
        </button>
    );
}