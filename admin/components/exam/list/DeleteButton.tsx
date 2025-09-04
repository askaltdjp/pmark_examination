"use client";

import { MTest } from ".prisma/client_master";
import { currentJST } from "@/lib/utils/timeUtils";

/**
 * 削除ボタンのクライアントコンポーネント
 */
export default function DeleteButton(
    {
        mTest,
        onDelete,
    }: {
        mTest: MTest;
        onDelete: () => void;
    }
) {
    const now = currentJST();
    const isExpired = mTest.endAt < now;

    return (
        <button
            className="btn btn-sm bg-slate-600 hover:bg-slate-500 text-white mx-1"
            onClick={onDelete}
            disabled={isExpired}
        >
            削除
        </button>
    );
}