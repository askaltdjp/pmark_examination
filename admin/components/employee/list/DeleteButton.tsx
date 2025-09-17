"use client";

/**
 * 削除ボタンのクライアントコンポーネント
 */
export default function DeleteButton({ onDelete }: { onDelete: () => void }) {
    return (
        <button
            className="btn btn-md bg-slate-600 hover:bg-slate-500 text-white mx-1"
            onClick={onDelete}
        >
            削 除
        </button>
    );
}