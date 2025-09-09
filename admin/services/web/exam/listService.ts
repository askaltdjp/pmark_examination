import { MTest } from ".prisma/client_master";
import { TestSummaryRecord } from "@/lib/definitions/types";
import { MTestRepository } from "@/lib/repositories/master/mTestRepository";
import { TTestRepository } from "@/lib/repositories/transaction/tTestRepository";

/**
 * 試験一覧画面の表示に必要な情報を取得するサービス関数
 *
 * @returns オブジェクト（試験マスタ配列、試験IDごとの受験者・合格者情報のRecord）
 */
export async function listService(): Promise<{
    mTests: MTest[];
    testSummary: TestSummaryRecord;
}> {
    // すべての試験マスタを取得
    const mTests = await MTestRepository.findAll();
    mTests.sort((a, b) => a.startAt.getTime() - b.startAt.getTime()); // 開始日時で昇順ソート

    // 試験IDごとに、受験者数と合格者数を集計
    const testSummary = await TTestRepository.findTestSummary();

    // 試験一覧と集計結果を返す
    return { mTests, testSummary };
}
