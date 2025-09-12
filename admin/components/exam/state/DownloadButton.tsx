"use client";

import { downloadFileFromPost } from "@/lib/utils/downloadUtils";
import { useRouter } from "next/navigation";

/**
 * ダウンロードボタンのクライアントコンポーネント
 */
export default function DownloadButton({
    testId
}: {
    testId: number;
}) {
    const router = useRouter();

    // ダウンロードボタン押下時の処理
    const handleDownloadButtonClick = async () => {
        await downloadFileFromPost("/api/exam/stateAllDownload", {
            testId,
        });
    };

    return (
        <div className="flex justify-center">
            <div className="w-[100%] text-right py-3">
                <button
                    className="btn bg-slate-600 hover:bg-slate-500 text-white mx-1"
                    onClick={handleDownloadButtonClick}
                >
                    ダウンロード
                </button>
            </div>
        </div>
    );
}