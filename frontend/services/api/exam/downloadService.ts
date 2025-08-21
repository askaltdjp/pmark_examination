import { TEmployee } from '.prisma/client_transaction';
import { MTestRepository } from '@/lib/repositories/master/mTestRepository';
import { MTestQuestionRepository } from "@/lib/repositories/master/mTestQuestionRepository";
import { TTestRepository } from '@/lib/repositories/transaction/tTestRepository';
import { TTestAnswerRepository } from '@/lib/repositories/transaction/tTestAnswerRepository';
import { formatDate } from '@/lib/utils/timeUtils';
import { testResultLabels } from '@/lib/constants/labels';
import path from "path";
import ExcelJS from "exceljs";

/**
 * 指定した社員の特定試験の受験結果をExcelファイルとして生成し、
 * バイナリデータとファイル名を返すサービス関数
 *
 * @param tEmployee - 社員情報
 * @param testId - 試験ID
 * @param testCnt - 受験回数
 * @returns Excelファイルのバッファとダウンロード用ファイル名
 */
export async function downloadService(
    tEmployee: TEmployee,
    testId: number,
    testCnt: number,
): Promise<{ buffer: ArrayBuffer, fileName: string }> {
    // Excelに書き込む最大の問題数
    const MAX_QUESTIONS = 20;
    // 1問目〜10問目の開始行番号
    const START_ROW_FIRST_HALF = 5;
    // 11問目〜20問目の開始行番号
    const START_ROW_SECOND_HALF = 7;

    // 試験概要マスタを試験IDから取得
    const mTest = await MTestRepository.findById(testId);
    if (!mTest) {
        throw new Error('試験概要が存在しません。');
    }

    // 社員の該当試験とその受験回数に応じた受験履歴を取得
    const tTest = await TTestRepository.findByEmployeeIdAndTestIdAndTestCnt(tEmployee.id, testId, testCnt);
    if (!tTest) {
        throw new Error('受験履歴が存在しません。');
    }

    // 社員の受験時の解答履歴を取得
    const tTestAnswers = await TTestAnswerRepository.findAllByEmployeeIdAndTestIdAndTestCnt(tEmployee.id, testId, testCnt);
    // 解答履歴から問題Noのリストを抽出
    const questionNos = tTestAnswers.map(tTestAnswer => tTestAnswer.questionNo);

    // 試験IDと問題Noリストから試験問題を取得
    const mTestQuestions = await MTestQuestionRepository.findAllByTestIdAndQuestionNos(testId, questionNos);
    // 試験問題を問題Noをキーにした連想配列に変換（高速アクセス用）
    const mTestQuestionMap = mTestQuestions.reduce((acc, question) => {
        acc[question.questionNo] = question;
        return acc;
    }, {} as Record<number, typeof mTestQuestions[number]>);

    // Excelテンプレートファイルの絶対パスを取得
    const filePath = path.resolve(process.cwd(), "templates/[試験名]_受験結果_([氏名])_[yyyymmdd].xlsx");

    // ExcelJSのWorkbookを初期化しテンプレートファイルを読み込み
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    // 先頭ワークシートを取得
    const worksheet = workbook.worksheets[0];

    // セルA1に試験名を書き込む
    worksheet.getCell('A1').value = `${mTest.name} 試験結果`;
    // セルC2に受験日を書き込む
    worksheet.getCell('C2').value = formatDate(tTest.testAt, 'YYYY年MM月DD日');
    // セルJ2に社員Noを書き込む
    worksheet.getCell('J2').value = tEmployee.employeeNo;
    // セルN2に名前を書き込む
    worksheet.getCell('N2').value = tEmployee.name;

    // 最大20問分の回答データをExcelに反映
    for (let i = 0; i < MAX_QUESTIONS; i++) {
        // 1問目〜10問目と11問目〜20問目で行の開始位置が異なるため条件分岐
        const startRow = (i < 10) ? START_ROW_FIRST_HALF : START_ROW_SECOND_HALF;
        // i番目の回答データを取得（存在しない場合はundefined）
        const tTestAnswer = tTestAnswers[i];
        // 回答に対応する試験問題を連想配列から取得
        const mTestQuestion = tTestAnswer ? mTestQuestionMap[tTestAnswer.questionNo] : null;
        // セルB[奇数行番号]に問題文を書き込む
        worksheet.getCell(`B${startRow + i * 2}`).value = tTestAnswer ? `[問題文]${mTestQuestion?.question}` : '';
        // セルB[偶数行番号]に解説を書き込む
        worksheet.getCell(`B${startRow + i * 2 + 1}`).value = tTestAnswer ? `[解説]${mTestQuestion?.commentary}` : '';
        // セルM[奇数行番号]に解答を書き込む
        worksheet.getCell(`M${startRow + i * 2}`).value = tTestAnswer ? (tTestAnswer.answer ? '〇' : '✕') : '';
        // セルP[奇数行番号]に正解を書き込む
        worksheet.getCell(`P${startRow + i * 2}`).value = tTestAnswer ? (mTestQuestion?.correct ? '〇' : '✕') : '';
    }

    // セルF48に正解率を書き込む
    worksheet.getCell('F48').value = Number(tTest.correctNum * 100 / mTest.questionNum);
    // セルP48に合否を書き込む
    worksheet.getCell('P48').value = testResultLabels[tTest.result];

    // 編集済みExcelワークブックをバッファに書き出す
    const buffer = await workbook.xlsx.writeBuffer(); // 型は Buffer（＝ArrayBuffer派生）

    // ダウンロード時のファイル名を作成し、URLエンコードする
    const fileName = encodeURIComponent(`${mTest.name}_受験結果_${tEmployee.name}_${formatDate(tTest.testAt, 'YYYYMMDD')}.xlsx`);

    return { buffer, fileName };
}
