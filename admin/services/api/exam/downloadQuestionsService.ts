import { MTestQuestionRepository } from "@/lib/repositories/master/mTestQuestionRepository";
import { MTestRepository } from "@/lib/repositories/master/mTestRepository";
import Papa from 'papaparse';

/**
 * 指定した試験IDの試験問題をCSVファイルとして生成し、
 * テキストデータとファイル名を返すサービス関数
 *
 * @param testId - 試験ID
 * @returns BOM付きCSV文字列とダウンロード用ファイル名
 */
export async function downloadQuestionsService(
    testId: number,
): Promise<{
    csvWithBom: string;
    fileName: string;
}> {
    // 試験IDに基づいて試験マスタを取得
    const mTest = await MTestRepository.findById(testId);
    if (!mTest) {
        throw new Error(`試験マスタが存在しません。[testId=${testId}]`);
    }

    // 試験IDに基づいて試験問題マスタを取得
    const mTestQuestions = (
        await MTestQuestionRepository.findAllByTestId(testId)
    ).sort((a, b) => a.questionNo - b.questionNo); // question_noで昇順ソート

    // 試験問題マスタから必要な情報だけを抽出
    const data = mTestQuestions.map(mTestQuestion => {
        return {
            question: mTestQuestion.question,
            commentary: mTestQuestion.commentary,
            correct: mTestQuestion.correct ? 1 : 0,
        };
    });

    // 配列をCSV文字列に変換（ヘッダーなし）
    const csv: string = Papa.unparse(data, {
        header: false,
    });

    // CSV文字列にUTF-8 BOMをつける（Excelで日本語文字化け防止）
    const bom = '\uFEFF';
    const csvWithBom = bom + csv;

    // ダウンロード時のファイル名を作成し、URLエンコードする
    const fileName = encodeURIComponent(`${mTest.name}_試験問題.csv`);

    return { csvWithBom, fileName };
}
