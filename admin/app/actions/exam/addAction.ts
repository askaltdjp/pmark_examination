"use server";

import { addService } from "@/services/actions/exam/addService";
import { QuestionData } from "@/lib/definitions/types";

/**
 * 試験の登録処理を行うサーバアクション
 * 引数で受け取った試験情報を元に、試験期間の重複チェックを行い、
 * 問題がなければ試験マスタと試験問題マスタへ新規登録を実施する。
 * 
 * @param name - 名前
 * @param startAt - 開始日
 * @param endAt - 終了日
 * @param questionNum - 出題数
 * @param passNum - 合格数
 * @param questionDataList - 試験問題
 * @throws 期間重複時に例外をスロー
 */
export async function addAction(
    name: string,
    startAt: Date,
    endAt: Date,
    questionNum: number,
    passNum: number,
    questionDataList: QuestionData[],
): Promise<void> {
    // 試験名の入力チェック
    if (!name.trim()) {
        throw new Error("試験名が提供されていません。");
    }

    // 終了日の入力チェック
    const now = new Date();
    now.setHours(0, 0, 0, 0); // 当日の0時0分0秒に揃える
    if (endAt < now) {
        throw new Error("終了日は本日以降の日付を入力してください。");
    }

    // 開始日と終了日の整合性チェック
    if (startAt > endAt) {
        throw new Error("期間の開始日は終了日より前または同じ日にしてください。");
    }

    // 出題数の入力チェック
    if (questionNum < 1) {
        throw new Error("出題数は1以上で入力してください。");
    }

    // 合格数の入力チェック
    if (passNum < 1) {
        throw new Error("合格数は1以上で入力してください。");
    }

    // 出題数と合格数の整合性チェック
    if (questionNum < passNum) {
        throw new Error("出題数は合格数以上にしてください。");
    }

    // 試験問題の入力チェック
    if (questionDataList.length <= 0) {
        throw new Error("試験問題が提供されていません。");
    }

    // 試験情報の新規登録
    await addService(
        name,
        startAt,
        endAt,
        questionNum,
        passNum,
        questionDataList,
    );
}