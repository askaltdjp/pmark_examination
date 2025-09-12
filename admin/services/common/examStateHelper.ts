import { MTest } from ".prisma/client_master";
import { StateData } from "@/lib/definitions/types";
import { MTestRepository } from "@/lib/repositories/master/mTestRepository";
import { TEmployeeRepository } from "@/lib/repositories/transaction/tEmployeeRepository";
import { TTestRepository } from "@/lib/repositories/transaction/tTestRepository";

/**
 * 指定した試験IDに基づいて、試験情報と対象社員の受験状況データ一覧を構築する関数
 *
 * - 退職済み社員も含め、試験期間中に在籍していたか、もしくは受験履歴がある社員を対象とする
 * - 受験履歴が存在しない場合でも、試験期間中に在籍していれば表示対象
 * - 社員ごとの最終受験データ（回数・日時・結果）を集約する
 *
 * @param testId - 対象の試験ID
 * @returns 試験マスタ情報と、表示対象社員の受験状況データ一覧
 * @throws 試験IDに対応する試験情報が存在しない場合は例外をスロー
 */
export async function buildExamStateDataList(testId: number): Promise<{
    mTest: MTest,
    stateDataList: StateData[];
}> {
    // 試験マスタ取得
    const mTest = await MTestRepository.findById(testId);
    if (mTest === null) {
        throw new Error("試験情報が存在しません。");
    }

    // 退職した社員も含めた社員情報取得
    const tEmployees = await TEmployeeRepository.findAll(true);

    // 社員ごとの最新の受験履歴を取得
    const latestTestMap = await TTestRepository.getLatestResultMapByTestId(testId);

    // 受験状況の表示用データを作成
    const stateDataList = tEmployees.filter(tEmployee => {
        // 在籍期間と試験期間の関係によって次のように画面の表示・非表示が決まる
        // 
        // ■ 退社していない場合
        // ・入社 -> 試験開始日 -> 試験終了日            ※非表示
        // ・試験開始日 -> 入社 -> 試験終了日            ※表示
        // ・試験開始日 -> 試験終了日 -> 入社            ※非表示
        //
        // ■ 退社した場合
        // ・入社 -> 退社 -> 試験開始日 -> 試験終了日    ※非表示
        //
        // ・入社 -> 試験開始日 -> 退社 -> 試験終了日    ※表示
        // ・入社 -> 試験開始日 -> 試験終了日 -> 退社    ※表示
        //
        // ・試験開始日 -> 入社 -> 退社 < 試験終了日     ※表示
        // ・試験開始日 -> 入社 -> 試験終了日 -> 退社    ※表示
        //
        // ・試験開始日 -> 試験終了日 -> 入社 -> 退社    ※非表示

        // 試験期間中に少しでも在籍していた社員は表示対象
        if (
            // 試験終了以前に入社している
            tEmployee.joinDate <= mTest.endAt &&
            // 退職していない、もしくは、試験開始以降に退職した
            // FIXME: 管理項目（deleteAt）ではなく退職日カラムを作成して処理するべき
            (tEmployee.deleteAt === null || mTest.startAt <= tEmployee.deleteAt)
        ) {
            return true;
        }

        // 受験履歴が存在していれば、試験期間中に在籍していなくても表示対象
        if (latestTestMap[tEmployee.id]) {
            return true;
        }

        // 上記以外は表示対象外
        return false;
    }).map(tEmployee => {
        const stateData: StateData = {
            employeeId: tEmployee.id,
            employeeNo: tEmployee.employeeNo,
            name: tEmployee.name,
            testCnt: latestTestMap[tEmployee.id]?.testCnt ?? 0,
            testAt: latestTestMap[tEmployee.id]?.testAt ?? null,
            result: latestTestMap[tEmployee.id]?.result ?? null,
        };

        return stateData;
    });

    return { mTest, stateDataList };
}