import { parse } from "csv-parse/sync";
import { QuestionData } from "@/lib/definitions/types";

/**
 * 試験問題CSVファイルを読み取り、パース結果をQuestionData形式で返却するサービス関数
 * 
 * 指定されたCSVファイルの各行を「質問文」「解説」「正解」の3列として解釈し、
 * パースとバリデーションを行った上で、画面表示・登録処理で利用可能な形式に変換する。
 * 
 * @param file - アップロードされたCSVファイル
 * @returns QuestionDataオブジェクトの配列（1行 = 1問）
 * @throws CSVのフォーマットが不正である場合に例外をスロー
 */
export async function importService(file: File): Promise<QuestionData[]> {
    // ファイルのバイナリデータをBufferに変換
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // BufferをCSVとしてパース（1行 = 1レコード）
    const records = parse(buffer, {
        columns: false, // ヘッダーなし
        skip_empty_lines: true,
        trim: true,
    });

    // 各レコードをQuestionData型に変換
    return records.map((row, i) => {
        const [questionRaw, commentaryRaw, correctRaw] = row;

        // 質問文のチェック
        const question = questionRaw?.trim();
        if (!question) {
            throw new Error(`CSVの${i + 1}行目の質問文が空です。`);
        }

        // 解説（空白はnullとして扱う）
        const commentary = commentaryRaw?.trim() || null;

        // 正解のチェック
        if (correctRaw !== "0" && correctRaw !== "1") {
            throw new Error(`CSVの${i + 1}行目の正解は 0 もしくは 1 でなければなりません。`);
        }
        const correct = correctRaw === "1";

        // 試験問題内容の作成
        const questionData: QuestionData = {
            questionNo: i + 1,
            question,
            commentary,
            correct,
        };

        return questionData;
    });
}