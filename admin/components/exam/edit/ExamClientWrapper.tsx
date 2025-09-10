"use client";

import ExamSummaryForm from "@/components/exam/edit/ExamSummaryForm";
import FileOperationSection from "@/components/exam/edit/FileOperationSection";
import { useState } from "react";
import { MTest } from ".prisma/client_master";
import { ExamState, QuestionData } from "@/lib/definitions/types";
import { currentJST, formatDate } from "@/lib/utils/timeUtils";

/**
 * 試験変更画面のクライアントコンポーネント
 */
export default function ExamClientWrapper({ mTest, questionDataList }: { mTest: MTest; questionDataList: QuestionData[] }) {
    const [name, setName] = useState(mTest.name ?? "");
    const [startAt, setStartAt] = useState(formatDate(mTest.startAt, "YYYY-MM-DD"));
    const [endAt, setEndAt] = useState(formatDate(mTest.endAt, "YYYY-MM-DD"));
    const [questionNum, setQuestionNum] = useState(String(mTest.questionNum));
    const [passNum, setPassNum] = useState(String(mTest.passNum));

    const examState: ExamState = {
        name,
        setName,
        startAt,
        setStartAt,
        endAt,
        setEndAt,
        questionNum,
        setQuestionNum,
        passNum,
        setPassNum,
    };

    // 試験が期限切れかどうか
    const now = currentJST();
    now.setHours(0, 0, 0, 0);
    const isExpired = new Date(mTest.endAt) < now;

    return (
        <>
            {/* 試験概要 */}
            <ExamSummaryForm testId={mTest.id} examState={examState} isExpired={isExpired} />

            {/* ファイル操作と変更ボタン */}
            <FileOperationSection testId={mTest.id} examState={examState} questionDataList={questionDataList} isExpired={isExpired} />
        </>
    );
}