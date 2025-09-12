import { EXAM_TEMPLATE_DIR, EXAM_STATE_TEMPLATE_FILENAME } from "@/lib/definitions/system";
import path from "path";
import ExcelJS from "exceljs";
import { buildExamStateDataList } from "@/services/common/examStateHelper";
import { formatDate, getFiscalYear } from "@/lib/utils/timeUtils";
import { TestResult } from "@/lib/definitions/labels";
import { generateExcelFromTemplate } from "@/lib/utils/excelUtils";

/**
 * 指定した試験の受験対象社員の受験状況をExcelファイルとして生成し、
 * バイナリデータとファイル名を返すサービス関数
 *
 * @param testId - 試験ID
 * @returns Excelファイルのバッファとダウンロード用ファイル名
 */
export async function stateAllDownloadService(
    testId: number,
): Promise<{
    buffer: ArrayBuffer;
    fileName: string;
}> {
    // Excelテンプレートファイルの絶対パスを取得
    const filePath = path.resolve(process.cwd(), EXAM_TEMPLATE_DIR, EXAM_STATE_TEMPLATE_FILENAME);

    // Excelテンプレートへの書き込み処理
    return await generateExcelFromTemplate(filePath, async (worksheet: ExcelJS.Worksheet) => {
        // 受験状況の書き出し開始位置
        const START_ROW = 5;

        // 試験概要と受験状況取得
        const { mTest, stateDataList } = await buildExamStateDataList(testId);

        // 試験名を書き込む
        worksheet.getCell("A1").value = `${mTest.name} 受験状況一覧`;

        // 実施年度を書き込む
        const fiscalYear = getFiscalYear(mTest.startAt);
        worksheet.getCell("N2").value = `${fiscalYear}年度`;

        // FIXME: 社員が31人以上の場合はテンプレートの修正が必要
        stateDataList.forEach((stateData, i) => {
            // 社員Noを書き込む
            worksheet.getCell(`B${START_ROW + i}`).value = stateData.employeeNo;
            // 氏名を書き込む
            worksheet.getCell(`D${START_ROW + i}`).value = stateData.name;
            // 最終受験日を書き込む
            worksheet.getCell(`K${START_ROW + i}`).value = stateData.testAt === null ? "-" : formatDate(stateData.testAt, "YYYY年MM月DD日");
            // 受験回数を書き込む
            worksheet.getCell(`O${START_ROW + i}`).value = stateData.testCnt;
            // 合否を書き込む
            worksheet.getCell(`Q${START_ROW + i}`).value = stateData.result === null ? "-" : (stateData.result === TestResult.Pass ? "〇" : "✕");
        });

        // ダウンロード時のファイル名を作成し、URLエンコードする
        return `${mTest.name}_受験状況一覧_${fiscalYear}年度.xlsx`;
    });
}