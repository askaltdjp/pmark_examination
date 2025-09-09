import { MTest } from ".prisma/client_master";
import { MTestRepository } from "@/lib/repositories/master/mTestRepository";
import { TTest } from ".prisma/client_transaction/";
import { TTestRepository } from "@/lib/repositories/transaction/tTestRepository";

/**
 * ダッシュボード表示用のデータ取得を行うサービス関数
 *
 * @param employeeId - 社員ID
 * @returns オブジェクト（現在実施中の試験情報と、該当社員の受験履歴）
 */
export async function dashboardService(
    employeeId: number
): Promise<{
    mTest: MTest | null;
    tTests: TTest[];
}> {
    // 実施中の試験情報取得
    const mTest = await MTestRepository.findActive();

    // 実施中の試験が存在する場合、該当社員のその試験に対する受験履歴を取得
    const tTests = mTest
        ? await TTestRepository.findAllByEmployeeIdAndTestId(employeeId, mTest.id)
        : [];

    return { mTest, tTests };
}