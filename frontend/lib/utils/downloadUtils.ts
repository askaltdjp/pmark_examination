/**
 * POSTリクエストでファイルを取得し、ブラウザでダウンロードさせる共通関数
 *
 * @param url - APIエンドポイント（例：/api/exam/download）
 * @param payload - POSTボディとして送信するオブジェクト
 */
export async function downloadFileFromPost(url: string, payload: Record<string, any>) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "ファイルのダウンロードに失敗しました。");
        }

        // Content-Dispositionヘッダーからファイル名を取得
        const disposition = response.headers.get("Content-Disposition");
        const match = disposition?.match(/filename\*\=UTF-8''([^;]+)/);
        const filename = match ? decodeURIComponent(match[1]) : "downloaded_file.xlsx";

        const blob = await response.blob();
        const urlObject = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = urlObject;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(urlObject);
    } catch (error) {
        console.error("ファイルダウンロード時のエラー:", error);
        alert(error instanceof Error ? error.message : "予期しないエラーが発生しました。");
    }
}
