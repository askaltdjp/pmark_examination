"use client";

import { TTest } from ".prisma/client_transaction/";
import { TestResult } from "@/lib/definitions/labels";
import { downloadFileFromPost } from "@/lib/utils/downloadUtils";

type Props = {
    tTest: TTest;
};

/**
 * 確認ボタンのクライアントコンポーネント
 */
export default function ConfirmButton({ tTest }: Props) {
    // 確認ボタン押下時の処理
    const handleConfirmButtonClick = async (testId: number, testCnt: number) => {
        await downloadFileFromPost("/api/exam/download", {
            testId,
            testCnt,
        });
    };

    return (
        <button
            className="btn bg-[#c4623f] hover:bg-[#9b4e31] text-white"
            onClick={() => handleConfirmButtonClick(tTest.testId, tTest.testCnt)}
            disabled={tTest.result === TestResult.Interrupted}
        >
            確 認
        </button>
    );
}