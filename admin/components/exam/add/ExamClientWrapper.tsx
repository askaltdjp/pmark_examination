"use client";

import ExamSummaryForm from "@/components/exam/add/ExamSummaryForm";
import QuestionListTable from "@/components/exam/add/QuestionListTable";
import FileOperationSection from "@/components/exam/add/FileOperationSection";

/**
 * 試験登録画面のクライアントコンポーネント
 */
export default function ExamClientWrapper() {
    return (
        <>
            {/* 試験概要 */}
            <ExamSummaryForm />

            {/* 問題一覧 */}
            <QuestionListTable />

            {/* ファイル操作と登録ボタン */}
            <FileOperationSection />
        </>
    );
}