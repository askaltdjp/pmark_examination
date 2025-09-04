import { transactionPrisma } from "@/lib/prisma/transactionPrisma";
import { masterPrisma } from "@/lib/prisma/masterPrisma";
import { MTestRepository } from "@/lib/repositories/master/mTestRepository";
import { MTestQuestionRepository } from "@/lib/repositories/master/mTestQuestionRepository";
import { TTestRepository } from "@/lib/repositories/transaction/tTestRepository";
import { TTestAnswerRepository } from "@/lib/repositories/transaction/tTestAnswerRepository";

/**
 * 指定された試験IDに紐づくマスタ・トランザクションデータを削除するサービス関数
 *
 * masterPrismaとtransactionPrismaでそれぞれ別々にトランザクションを開始し、
 * マスターデータとトランザクションデータの削除処理を行う。
 *
 * ただし、この実装はトランザクションが別々に管理されているため、
 * 片方のトランザクションが成功し、もう片方で失敗すると部分コミットが発生し、
 * データの不整合が起きるリスクがある。
 *
 * Prismaは個別にトランザクションの開始・コミット・ロールバックを制御できないため、
 * 複数DBを跨いだ厳密なトランザクション制御が必要な場合はTypeORMのような
 * 明示的なトランザクション管理が可能なORMの利用を検討すべき。
 *
 * @param testId - 削除対象の試験ID
 */
export async function deleteService(testId: number): Promise<void> {
    // pme_masterのトランザクション処理
    await masterPrisma.$transaction(async (tx) => {
        await MTestRepository.deleteById(testId, tx);
        await MTestQuestionRepository.deleteByTestId(testId, tx);
    });

    // pme_transactionのトランザクション処理
    await transactionPrisma.$transaction(async (tx) => {
        await TTestRepository.deleteByTestId(testId, tx);
        await TTestAnswerRepository.deleteByTestId(testId, tx);
    });
}