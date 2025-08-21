"use client";

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { LOCAL_STORAGE_EXAM_DATA_KEY } from '@/lib/constants/system';

/**
 * 試験画面のクライアントコンポーネント
 */
export default function ExamNavigator() {
    const router = useRouter();
    const [questions, setQuestions] = useState<string[]>([]);
    const [answers, setAnswers] = useState<boolean[]>([]);
    const [questionIndex, setQuestionIndex] = useState(0);

    // 初回ロードでローカルストレージから試験データ取得
    useEffect(() => {
        try {
            const stored = localStorage.getItem(LOCAL_STORAGE_EXAM_DATA_KEY);
            if (stored) {
                const examData = JSON.parse(stored);
                setQuestions(examData.questions);
                setAnswers(examData.answers);
                setQuestionIndex(examData.questionIndex);
            } else {
                throw new Error('ローカルストレージに試験データが存在しません。');
            }
        } catch (error) {
            console.error('試験データ取得時のエラー:', error);
            alert(error instanceof Error ? error.message : '予期しないエラーが発生しました。');
            router.push('/auth/login');
        }
    }, [router]);

    // answers, questionIndex が変わったらローカルストレージに保存（リロード対策用）
    useEffect(() => {
        // 初期読み込み時はquestionsが空の可能性があり、その状態でローカルストレージを
        // 上書きしてしまうと正しいデータが消えてしまうため、空配列の場合は保存処理をスキップする
        if (questions.length === 0) {
            return;
        }
        localStorage.setItem(
            LOCAL_STORAGE_EXAM_DATA_KEY,
            JSON.stringify({
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

    return <>
        {/* 問題文 */}
        <div className="flex justify-center mt-10 text-gray-600">
            <div className="card w-256 bg-base-100 card-xl shadow-sm">
                <div className="card-body">
                    <h2 className="card-title justify-center w-full mb-6">問題 {questionIndex + 1} / {questions.length}</h2>
                    <p>{questions[questionIndex]}</p>
                </div>
            </div>
        </div>

        {/* 解答のラジオボタン */}
        <div className="flex justify-center mt-16">
            <div className="rounded-md py-8 px-4 w-192 text-gray-600 flex justify-center gap-10 bg-base-100 shadow-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="radio"
                        className="radio radio-neutral"
                        checked={answers[questionIndex] === true}
                        onChange={() => handleAnswerRadioChange(true)}
                    />
                    <span>：Yes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="radio"
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
                onClick={() => handlePrevButtonClick()}
                disabled={questionIndex === 0}
            >
                前 へ
            </button>
            <button
                className="btn btn-lg bg-slate-600 hover:bg-slate-500 text-white"
                onClick={() => handleNextButtonClick()}
                disabled={questionIndex === questions.length - 1 || answers[questionIndex] === undefined}
            >
                {questionIndex === questions.length - 1 ? '解答終了' : '次 へ'}
            </button>
        </div>
    </>
};