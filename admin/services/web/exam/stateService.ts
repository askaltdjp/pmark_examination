import { MTest } from ".prisma/client_master";
import { StateData } from "@/lib/definitions/types";
import { buildExamStateDataList } from "@/services/common/examStateHelper";

/**
 * 試験状況画面の表示に必要な情報を取得するサービス関数
 *
 * @param testId - 試験ID
 * @returns オブジェクト（試験マスタと試験状況一覧）
 */
export async function stateService(testId: number): Promise<{
    mTest: MTest,
    stateDataList: StateData[];
}> {
    // 試験概要と受験状況取得
    return await buildExamStateDataList(testId);
}