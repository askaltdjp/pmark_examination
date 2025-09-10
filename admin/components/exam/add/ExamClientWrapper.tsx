"use client";

import ExamSummaryForm from "@/components/exam/add/ExamSummaryForm";
import FileOperationSection from "@/components/exam/add/FileOperationSection";
import { useState } from "react";
import { ExamState } from "@/lib/definitions/types";

/**
 * 試験登録画面のクライアントコンポーネント
 */
export default function ExamClientWrapper({ maxId }: { maxId: number }) {
    const [name, setName] = useState("");
    const [startAt, setStartAt] = useState("");
    const [endAt, setEndAt] = useState("");
    const [questionNum, setQuestionNum] = useState("");
    const [passNum, setPassNum] = useState("");

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

    return (
        <>
            {/* 試験概要 */}
            <ExamSummaryForm testId={maxId + 1} examState={examState} />

            {/* ファイル操作と登録ボタン */}
            <FileOperationSection examState={examState} />
        </>
    );
}