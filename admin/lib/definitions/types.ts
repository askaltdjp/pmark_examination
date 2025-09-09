import { FC, SVGProps } from 'react';

// SVGアイコン用の型定義
export type IconType = FC<SVGProps<SVGSVGElement>>;

// ページ情報の型定義
export type PageType = Record<
    string,
    {
        label: string;
        basePath: string;
        icon: IconType;
        actions: Record<
            string,
            {
                label: string;
                icon: IconType;
            }
        >;
    }
>;

// testId をキーに持ち、各試験の受験者数と合格者数を表す型定義
export type TestSummaryRecord = Record<
    number,
    {
        examineeNum: number;
        passerNum: number;
    }
>;

// 試験フォームの状態とそれを更新する関数をまとめた型定義
export type ExamState = {
    name: string;
    setName: (value: string) => void;
    startAt: string;
    setStartAt: (value: string) => void;
    endAt: string;
    setEndAt: (value: string) => void;
    questionNum: string;
    setQuestionNum: (value: string) => void;
    passNum: string;
    setPassNum: (value: string) => void;
};

// 試験問題の型定義  ※MTestQuestionの一部を抜粋
export type QuestionData = {
    questionNo: number;
    question: string;
    commentary?: string | null;
    correct: boolean;
};
