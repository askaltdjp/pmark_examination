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
    // 試験が期限切れかどうか
    const now = currentJST();
    now.setHours(0, 0, 0, 0);
    const isExpired = mTest.endAt < now;

    return (
        <button
            className="btn bg-[#A53E3E] hover:bg-[#732C2C] text-white mx-1"
            onClick={onDelete}
            disabled={isExpired}
        >
            削 除
        </button>
    );
}