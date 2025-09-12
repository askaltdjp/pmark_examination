import ExcelJS from "exceljs";

/**
 * Excelテンプレートファイルを読み込み、ワークシートに対して任意の書き込み処理を行い、
 * 編集済みのExcelファイルをバッファ形式で返す共通関数
 *
 * @param filePath - 読み込むExcelテンプレートファイルの絶対パス
 * @param callback - ワークシートへの書き込み処理を行うコールバック関数。ファイル名（拡張子なし or 含む）を返す
 * @returns 編集済みExcelファイルのバッファと、ダウンロード用にエンコードされたファイル名
 */
export async function generateExcelFromTemplate(
    filePath: string,
    callback: (worksheet: ExcelJS.Worksheet) => Promise<string>,
): Promise<{
    buffer: ArrayBuffer;
    fileName: string;
}> {
    // ExcelJSのWorkbookを初期化しテンプレートファイルを読み込み
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    // 先頭ワークシートを取得
    const worksheet = workbook.worksheets[0];

    // ワークシートへの書き込み処理
    const downloadFileName = await callback(worksheet);

    // 編集済みExcelワークブックをバッファに書き出す
    const buffer = await workbook.xlsx.writeBuffer(); // 型は Buffer（＝ArrayBuffer派生）

    // ダウンロード時のファイル名を作成し、URLエンコードする
    const fileName = encodeURIComponent(downloadFileName);

    return { buffer, fileName };
}