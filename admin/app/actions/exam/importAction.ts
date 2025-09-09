import { QuestionData } from "@/lib/definitions/types";
import { importService } from "@/services/actions/exam/importService";

/**
 * 試験問題のインポート処理を行うサーバアクション  
 * 引数で受け取ったCSVファイルから問題データをパースし、画面表示・登録処理用のデータを返却する
 * 
 * @param formData - ファイルアップロードのFormData（CSVファイル）
 * @returns パース済みの試験問題データの配列
 * @throws パラメータエラー時に例外をスロー
 */
export async function importAction(formData: FormData): Promise<QuestionData[]> {
    // インポートファイルの入力チェック
    const file = formData.get("file") as File | null;
    if (!file) {
        throw new Error("インポートファイルが提供されていません。");
    }
    if (file.size <= 0) {
        throw new Error("インポートファイルの中身が空です。");
    }

    // インポートファイルのパース結果を返却
    return await importService(file);
}