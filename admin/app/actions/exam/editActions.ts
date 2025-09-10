"use server";

import { editService } from "@/services/actions/exam/editService";
import { QuestionData } from "@/lib/definitions/types";
import { MAX_TEST_NAME_LENGTH, MAX_QUESTION_NUM } from "@/lib/definitions/system";
import { currentJST } from "@/lib/utils/timeUtils";

/**
 * 試験の変更処理を行うサーバアクション
 * 引数で受け取った試験情報を元に、試験期間の重複チェックを行い、
 * 問題がなければ試験マスタと試験問題マスタの変更を実施する。
 * また、受験者の受験履歴と解答履歴は全て削除する。
 * 
 * @param testId - 試験ID
 * @param name - 名前
 * @param startAt - 開始日
 * @param endAt - 終了日
 * @param questionNum - 出題数
 * @param passNum - 合格数
 * @param questionDataList - 試験問題
 * @throws パラメータエラー時、期間重複時に例外をスロー
 */
export async function editAction(
    testId: number,
    name: string,
    startAt: Date,
    endAt: Date,
    questionNum: number,
    passNum: number,
    questionDataList: QuestionData[],
): Promise<void> {
    // 試験IDの入力チェック
    if (!testId) {
        throw new Error("試験IDが提供されていません。");
    }

    // 試験名の入力チェック
    if (!name.trim()) {
        throw new Error("試験名が提供されていません。");
    }
    if (name.length > MAX_TEST_NAME_LENGTH) {
        throw new Error(`試験名は ${MAX_TEST_NAME_LENGTH} 文字以内で入力してください。`);
    }

    // 終了日の入力チェック
    const now = currentJST();
    now.setHours(0, 0, 0, 0);
    if (endAt < now) {
        throw new Error("終了日は本日以降の日付を入力してください。");
    }

    // 開始日と終了日の整合性チェック
    if (startAt > endAt) {
        throw new Error("期間の開始日は終了日より前または同じ日にしてください。");
    }

    // 出題数の入力チェック
    if (questionNum < 1 || questionNum > MAX_QUESTION_NUM) {
        throw new Error(`出題数は 1 ～ ${MAX_QUESTION_NUM} の間で入力してください。`);
    }

    // 合格数の入力チェック
    if (passNum < 1) {
        throw new Error("合格数は1以上で入力してください。");
    }

    // 出題数と合格数の整合性チェック
    if (questionNum < passNum) {
        throw new Error("出題数は合格数以上で入力してください。");
    }

    // 試験問題の入力チェック
    if (questionDataList.length <= 0) {
        throw new Error("試験問題が提供されていません。");
    }

    // 試験情報の変更
    await editService(
        testId,
        name,
        startAt,
        endAt,
        questionNum,
        passNum,
        questionDataList,
    );
}