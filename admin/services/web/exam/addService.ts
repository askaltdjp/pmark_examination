import { MTestRepository } from "@/lib/repositories/master/mTestRepository";

/**
 * 試験追加画面の表示に必要な情報を取得するサービス関数
 *
 * @returns 試験IDの最大値
 */
export async function addService(): Promise<{ maxId: number }> {
    // 試験IDの最大値取得
    const maxId = await MTestRepository.findMaxId();

    return { maxId };
}