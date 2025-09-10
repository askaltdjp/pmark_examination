import { MTest } from ".prisma/client_master";
import { QuestionData } from "@/lib/definitions/types";
import { MTestQuestionRepository } from "@/lib/repositories/master/mTestQuestionRepository";
import { MTestRepository } from "@/lib/repositories/master/mTestRepository";

/**
 * 試験変更画面の表示に必要な情報を取得するサービス関数
 *
 * @returns 試験マスタと試験問題
 */
export async function editService(testId: number): Promise<{
    mTest: MTest;
    questionDataList: QuestionData[];
}> {
    // 試験マスタ取得
    const mTest = await MTestRepository.findById(testId);
    if (mTest === null) {
        throw new Error("試験情報が存在しません。");
    }

    // 試験問題マスタ取得
    const mTestQuestions = await MTestQuestionRepository.findAllByTestId(testId);

    // MTestQuestionからQuestionDataへデータ移送
    const questionDataList = mTestQuestions.map(mTestQuestion => {
        const questionData: QuestionData = {
            questionNo: mTestQuestion.questionNo,
            question: mTestQuestion.question,
            commentary: mTestQuestion.commentary,
            correct: mTestQuestion.correct,
        };
        return questionData;
    });

    return { mTest, questionDataList };
}