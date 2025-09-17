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
        await downloadFileFromPost("/api/exam/download-results", {
            testId,
        });
    };

    return (
        <div className="flex justify-center">
            <div className="w-[100%] text-right py-3">
                <button
                    className="btn bg-[#c4623f] hover:bg-[#9b4e31] text-white mx-1 px-10"
                    onClick={handleDownloadButtonClick}
                >
                    ダウンロード
                </button>
            </div>
        </div>
    );
}