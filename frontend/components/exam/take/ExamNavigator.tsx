"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from "next/navigation";
import { SESSION_STORAGE_EXAM_DATA_KEY } from '@/lib/constants/system';

/**
 * 試験画面のクライアントコンポーネント
 */
export default function ExamNavigator() {
    const router = useRouter();
    const testIdRef = useRef<number>(0);
    const testCntRef = useRef<number>(0);
    const [questions, setQuestions] = useState<{ questionNo: number, question: string }[]>([]);
    const [answers, setAnswers] = useState<boolean[]>([]);
    const [questionIndex, setQuestionIndex] = useState(0);

    // 最終問題か否か
    const isLastQuestion = questionIndex === questions.length - 1;

    // 初回ロード時にセッションストレージから試験情報を取得
    useEffect(() => {
        try {
            const stored = sessionStorage.getItem(SESSION_STORAGE_EXAM_DATA_KEY);
            if (stored) {
                const examData = JSON.parse(stored);
                console.log(examData);
                testIdRef.current = examData.testId;
                testCntRef.current = examData.testCnt;
                setQuestions(examData.questions);
                setAnswers(examData.answers);
                setQuestionIndex(examData.questionIndex);
            } else {
                throw new Error('試験の開始に必要なデータが存在しません。');
            }
        } catch (error) {
            console.error('試験データ取得時のエラー:', error);
            alert(error instanceof Error ? error.message : '予期しないエラーが発生しました。');
            router.push('/auth/login');
        }
    }, []);

    // answers, questionIndex が変わったらセッションストレージに保存（リロード対策用）
    useEffect(() => {
        // 初期読み込み時はquestionsが空の可能性があり、その状態でセッションストレージを
        // 上書きしてしまうと正しいデータが消えてしまうため、空配列の場合は保存処理をスキップする
        if (questions.length === 0) {
            return;
        }
        sessionStorage.setItem(
            SESSION_STORAGE_EXAM_DATA_KEY,
            JSON.stringify({
                testId: testIdRef.current,
                testCnt: testCntRef.current,
                questions,
                answers,
                questionIndex,
            })
        );
    }, [answers, questionIndex]);

    // 解答ラジオボタン選択時の処理
    const handleAnswerRadioChange = (answer: boolean) => {
        setAnswers(prevAnswers => {
            const newAnswers = [...prevAnswers];
            newAnswers[questionIndex] = answer;
            return newAnswers;
        });
    };

    // 前へボタン押下時の処理
    const handlePrevButtonClick = () => {
        setQuestionIndex(prevIndex => prevIndex - 1);
    };

    // 次へボタン押下時の処理
    const handleNextButtonClick = () => {
        setQuestionIndex(prevIndex => prevIndex + 1);
    };

    // 解答終了ボタン押下時の処理
    const handleAnswerCompleteButtonClick = async () => {
        try {
            // 解答情報をサーバに送信する形式に整形（questionNoとanswerのペア）
            const examAnswers = questions.map((question, i) => {
                const { questionNo } = question;
                return {
                    questionNo,
                    answer: answers[i],
                };
            });

            // 試験解答保存APIへPOSTリクエスト
            const response = await fetch('/api/exam/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    testId: testIdRef.current,
                    testCnt: testCntRef.current,
                    answers: examAnswers,
                }),
            });

            // レスポンスのJSONデータをパース
            const data = await response.json();

            // レスポンスの正常確認
            if (!response.ok) {
                throw new Error(data.error || '試験解答の保存に失敗しました。もう一度お試しください。');
            }

            // セッションストレージの試験情報を削除
            sessionStorage.removeItem(SESSION_STORAGE_EXAM_DATA_KEY);

            // 試験解答の保存に成功した場合、試験画面に遷移
            router.push('/exam/result');

        } catch (error) {
            // エラー発生時、コンソールにエラーメッセージを出力し、アラートを表示
            console.error('試験解答の保存時のエラー:', error);
            alert(error instanceof Error ? error.message : '予期しないエラーが発生しました。');
        }
    };

    return (
        <>
            {/* 問題文 */}
            <div className="flex justify-center mt-10 text-gray-600">
                <div className="card w-256 bg-base-100 card-xl shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title justify-center w-full mb-6">問題 {questionIndex + 1} / {questions.length}</h2>
                        <p>{questions[questionIndex]?.question}</p>
                    </div>
                </div>
            </div>

            {/* 解答のラジオボタン */}
            <div className="flex justify-center mt-16">
                <div className="rounded-md py-8 px-4 w-192 text-gray-600 flex justify-center gap-10 bg-base-100 shadow-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            name="answer"
                            className="radio radio-neutral"
                            checked={answers[questionIndex] === true}
                            onChange={() => handleAnswerRadioChange(true)}
                        />
                        <span>：Yes</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            name="answer"
                            className="radio radio-neutral"
                            checked={answers[questionIndex] === false}
                            onChange={() => handleAnswerRadioChange(false)}
                        />
                        <span>：No</span>
                    </label>
                </div>
            </div>

            {/* 前の問題と次の問題に遷移するためのボタン */}
            <div className="flex justify-center mt-16 gap-10">
                <button
                    className="btn btn-lg bg-slate-300 hover:bg-slate-400 text-black"
                    onClick={handlePrevButtonClick}
                    disabled={questionIndex === 0}
                >
                    前 へ
                </button>
                <button
                    className="btn btn-lg bg-slate-600 hover:bg-slate-500 text-white"
                    onClick={isLastQuestion ? handleAnswerCompleteButtonClick : handleNextButtonClick}
                    disabled={answers[questionIndex] === undefined}
                >
                    {isLastQuestion ? '解答終了' : '次 へ'}
                </button>
            </div>
        </>
    );
};