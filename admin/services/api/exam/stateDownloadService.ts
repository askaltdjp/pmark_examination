import { MTestRepository } from "@/lib/repositories/master/mTestRepository";
import { MTestQuestion } from ".prisma/client_master";
import { MTestQuestionRepository } from "@/lib/repositories/master/mTestQuestionRepository";
import { TTestRepository } from "@/lib/repositories/transaction/tTestRepository";
import { TTestAnswerRepository } from "@/lib/repositories/transaction/tTestAnswerRepository";
import { formatDate } from "@/lib/utils/timeUtils";
import { EXAM_TEMPLATE_DIR, EXAM_RESULT_TEMPLATE_FILENAME } from "@/lib/definitions/system";
import { testResultLabels } from "@/lib/definitions/labels";
import path from "path";
import ExcelJS from "exceljs";
import { TEmployeeRepository } from "@/lib/repositories/transaction/tEmployeeRepository";
import { generateExcelFromTemplate } from "@/lib/utils/excelUtils";

/**
 * 指定した社員の特定試験の受験結果をExcelファイルとして生成し、
 * バイナリデータとファイル名を返すサービス関数
 *
 * @param employeeId - 社員ID
 * @param testId - 試験ID
 * @param testCnt - 受験回数
 * @returns Excelファイルのバッファとダウンロード用ファイル名
 */
export async function stateDownloadService(
    employeeId: number,
    testId: number,
    testCnt: number,
): Promise<{
    buffer: ArrayBuffer;
    fileName: string;
}> {
    // Excelテンプレートファイルの絶対パスを取得
    const filePath = path.resolve(process.cwd(), EXAM_TEMPLATE_DIR, EXAM_RESULT_TEMPLATE_FILENAME);

    // Excelテンプレートへの書き込み処理
    return await generateExcelFromTemplate(filePath, async (worksheet: ExcelJS.Worksheet) => {
        // Excelに書き込む最大の問題数
        const MAX_QUESTIONS = 20;
        // 1問目〜10問目と11問目〜20問目の間に余白があるため、11問目を境に行の開始位置をずらす
        const START_ROW_FIRST_HALF = 5;     // 1問目〜10問目の開始行番号
        const START_ROW_SECOND_HALF = 7;    // 11問目〜20問目の開始行番号

        // 社員IDに基づいて社員情報取得
        const tEmployee = await TEmployeeRepository.findById(employeeId);
        if (!tEmployee) {
            throw new Error(`社員情報が存在しません。[employeeId=${employeeId}]`);
        }

        // 試験IDに基づいて試験マスタを取得
        const mTest = await MTestRepository.findById(testId);
        if (!mTest) {
            throw new Error(`試験マスタが存在しません。[testId=${testId}]`);
        }

        // 社員の該当試験とその受験回数に応じた受験履歴を取得
        const tTest = await TTestRepository.findByEmployeeIdAndTestIdAndTestCnt(employeeId, testId, testCnt);
        if (!tTest) {
            throw new Error(`受験履歴が存在しません。[employeeId=${employeeId}] [testId=${testId}] [testCnt=${testCnt}]`);
        }

        // 社員の受験時の解答履歴を取得
        const tTestAnswers = await TTestAnswerRepository.findAllByEmployeeIdAndTestIdAndTestCnt(employeeId, testId, testCnt);
        // 解答履歴から問題Noのリストを抽出
        const questionNos = tTestAnswers.map(tTestAnswer => tTestAnswer.questionNo);

        // 試験IDと問題Noリストから試験問題マスタを取得
        const mTestQuestions = await MTestQuestionRepository.findAllByTestIdAndQuestionNos(testId, questionNos);
        // 試験問題マスタを問題Noをキーにした連想配列に変換（高速アクセス用）
        const mTestQuestionMap = mTestQuestions.reduce<Record<number, MTestQuestion>>((acc, mTestQuestion) => {
            acc[mTestQuestion.questionNo] = mTestQuestion;
            return acc;
        }, {});

        // 試験名を書き込む
        worksheet.getCell("A1").value = `${mTest.name} 試験結果`;
        // 受験日を書き込む
        worksheet.getCell("C2").value = formatDate(tTest.testAt, "YYYY年MM月DD日");
        // 社員Noを書き込む
        worksheet.getCell("J2").value = tEmployee.employeeNo;
        // 名前を書き込む
        worksheet.getCell("N2").value = tEmployee.name;

        // 解答データをExcelに反映
        // デフォルトでセルに文字列が設定されているため、問題数を超過した部分は空白セルに置き換える
        for (let i = 0; i < MAX_QUESTIONS; i++) {
            // 開始位置の取得
            const startRow = (i < 10) ? START_ROW_FIRST_HALF : START_ROW_SECOND_HALF;
            // i番目の解答データを取得（存在しない場合はundefined）
            const tTestAnswer = tTestAnswers[i];
            // 解答に対応する試験問題マスタを取得
            const mTestQuestion = tTestAnswer ? mTestQuestionMap[tTestAnswer.questionNo] : null;

            // 問題文を書き込む
            const question = tTestAnswer ? `[問題文]${mTestQuestion?.question}` : "";
            worksheet.getCell(`B${startRow + i * 2}`).value = question;
            // 解説を書き込む　※解説は未設定を許容
            const commentary = (tTestAnswer && mTestQuestion?.commentary) ? `[解説]${mTestQuestion.commentary}` : "";
            worksheet.getCell(`B${startRow + i * 2 + 1}`).value = commentary;
            // 解答を書き込む　※社員の選択した解答
            const answer = tTestAnswer ? (tTestAnswer.answer ? "Yes" : "No") : "";
            worksheet.getCell(`M${startRow + i * 2}`).value = answer;
            // 正解を書き込む　※社員の解答と問題の解答があっている否か
            const correct = tTestAnswer ? (tTestAnswer.answer === mTestQuestion?.correct ? "〇" : "✕") : "";
            worksheet.getCell(`P${startRow + i * 2}`).value = correct;
        }

        // 正解率を書き込む
        worksheet.getCell("F48").value = Math.floor((tTest.correctNum * 1000) / mTest.questionNum) / 10;
        // 合否を書き込む
        worksheet.getCell("P48").value = testResultLabels[tTest.result];

        // ダウンロード時のファイル名を返却
        return `${mTest.name}_受験結果_${tEmployee.name}_${formatDate(tTest.testAt, "YYYYMMDD")}.xlsx`;
    });
}