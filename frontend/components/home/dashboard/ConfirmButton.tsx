"use client";

import { TTest } from ".prisma/client_transaction/";
import { TestResult } from "@/lib/constants/labels";

type Props = {
    tTest: TTest;
};

/**
 * 確認ボタンのクライアントコンポーネント
 */
export default function ConfirmButton({ tTest }: Props) {
    // 確認ボタン押下時の処理
    const handleConfirmButtonClick = async (testId: number, testCnt: number) => {
        try {
            // ファイルダウンロードAPIへPOSTリクエスト
            const response = await fetch("/api/exam/download", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ testId, testCnt }),
            });

            // レスポンスの正常確認
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "ファイルのダウンロードに失敗しました。もう一度お試しください。");
            }

            // Content-Dispositionヘッダーからファイル名を取得
            const disposition = response.headers.get("Content-Disposition");
            if (!disposition) {
                throw new Error("ファイル名の情報がヘッダーに含まれていません。");
            }

            // ファイル名を正規表現で抽出
            const match = disposition.match(/filename\*\=UTF-8''([^;]+)/);
            if (!match || !match[1]) {
                throw new Error("ファイル名を取得できませんでした。");
            }

            const filename = decodeURIComponent(match[1]);

            // レスポンスをBlobに変換し、一時URLを生成
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // ダウンロード用リンクを作成してクリックイベントを発火
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            // 使い終わったリンクとURLを削除
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            // エラー発生時、コンソールにエラーメッセージを出力し、アラートを表示
            console.error("ファイルダウンロード時のエラー:", error);
            alert(error instanceof Error ? error.message : "予期しないエラーが発生しました。");
        }
    };

    return (
        <button
            className="btn bg-slate-600 hover:bg-slate-500 text-white"
            onClick={() => handleConfirmButtonClick(tTest.testId, tTest.testCnt)}
            disabled={tTest.result === TestResult.Interrupted}
        >確 認</button>
    );
}