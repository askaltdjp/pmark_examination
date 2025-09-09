// セッションストレージに保存する試験情報　※試験画面で使用する
export type ExamData = {
    testId: number;
    testCnt: number;
    questions: { questionNo: number, question: string }[];
    answers: boolean[];
    questionIndex: number;
    isExamInProgress: boolean;
};