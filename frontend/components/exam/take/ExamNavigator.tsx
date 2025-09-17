"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SESSION_STORAGE_EXAM_DATA_KEY } from "@/lib/definitions/system";
import { saveAction } from "@/app/actions/exam/saveAction";
import { ExamData } from "@/lib/definitions/types";

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
    const isExamInProgressRef = useRef<boolean>(false);

    // 最終問題か否か
    const isLastQuestion = questionIndex >= questions.length - 1;

    // 初回ロード時
    useEffect(() => {
        try {
            // すでに状態がセットされていれば2回目以降は何もしない ※開発モードで処理が2回実行される対応
            if (testIdRef.current > 0) {
                return;
            }

            // セッションストレージから試験情報を取得
            const stored = sessionStorage.getItem(SESSION_STORAGE_EXAM_DATA_KEY);
            if (!stored) {
                throw new Error("試験の開始に必要なデータが存在しません。");
            }
            const examData: ExamData = JSON.parse(stored);

            // セッションストレージから取得した試験情報を状態および参照にセット
            testIdRef.current = examData.testId;
            testCntRef.current = examData.testCnt;
            setQuestions(examData.questions);
            setAnswers(examData.answers);
            setQuestionIndex(examData.questionIndex);
            isExamInProgressRef.current = examData.isExamInProgress;

            // ページナビゲーションに関するパフォーマンス情報を取得
            // navigationEntry.typeの値は "navigate", "reload", "back_forward", "prerender" のいずれか
            const navigationTiming = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;

            // 試験中にも関わらずリロード以外で試験画面を表示した場合は試験を受けられない（途中で試験を抜けたのでNG）
            if (isExamInProgressRef.current && navigationTiming.type !== "reload") {
                throw new Error("中断した試験は再実施できません。");
            }

            // ホーム画面から遷移したら試験中フラグを立ててセッションストレージに保存
            if (!isExamInProgressRef.current) {
                isExamInProgressRef.current = true;
                sessionStorage.setItem(
                    SESSION_STORAGE_EXAM_DATA_KEY,
                    JSON.stringify({ ...examData, isExamInProgress: isExamInProgressRef.current }),
                );
            }

        } catch (error) {
            // エラーログ出力
            console.error("試験データ取得時のエラー:", error);
            // エラーダイアログ表示
            alert(error instanceof Error ? error.message : "予期しないエラーが発生しました。");
            // セッションストレージの試験情報を削除
            sessionStorage.removeItem(SESSION_STORAGE_EXAM_DATA_KEY);
            // ログイン画面に遷移
            // router.pushだと試験結果画面からブラウザバックした際に画面遷移が行われない
            window.location.href = "/auth/login";
        }
    }, []);

    // リロード対策
    useEffect(() => {
        // 初期読み込み時はquestionsが空の可能性があり、その状態でセッションストレージを
        // 上書きしてしまうと正しいデータが消えてしまうため、空配列の場合は保存処理をスキップする
        if (questions.length === 0) {
            return;
        }

        // 解答情報をセッションストレージに保存
        const examData: ExamData = {
            testId: testIdRef.current,
            testCnt: testCntRef.current,
            questions,
            answers,
            questionIndex,
            isExamInProgress: isExamInProgressRef.current,
        };
        sessionStorage.setItem(
            SESSION_STORAGE_EXAM_DATA_KEY,
            JSON.stringify(examData),
        );
    }, [answers, questionIndex]);

    // ブラウザバック対策　※連打は未対応
    useEffect(() => {
        // ブラウザの履歴操作（戻る・進むなど）を行った際に行うイベントハンドラ
        const handlePopState = () => {
            alert('試験中は試験画面以外への戻る操作はできません。');
            // 履歴スタックに現在のURLを再度追加する
            history.pushState(null, '', location.href);
        };

        // 履歴スタック（上が最新）
        // ┌────────────────────────────┐
        // │ 試験画面（pushState） ← 現在ここ（今のURLをもう一度積んだ）
        // │ 試験画面（router.push）← ブラウザバックでここになる
        // │ ホーム画面
        // └────────────────────────────┘
        //
        // 現在の試験画面のURLを履歴スタックにもう一つ積む（URLは何でもOK）
        // これによりブラウザバックしても、同じ試験画面にとどまるようになる
        history.pushState(null, '', location.href);

        // popstateイベント（履歴操作）に対してイベントハンドラの登録
        window.addEventListener('popstate', handlePopState);

        // コンポーネントのアンマウント時にイベントハンドラを解除
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

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
            // 解答情報をサーバで処理する形式に整形（questionNoとanswerのペア）
            const examAnswers = questions.map((question, i) => {
                const { questionNo } = question;
                return {
                    questionNo,
                    answer: answers[i],
                };
            });

            // 試験解答保存処理の実行
            await saveAction(testIdRef.current, testCntRef.current, examAnswers);

            // 試験結果画面に渡すパラメータの構築
            const params = new URLSearchParams();
            params.set("testId", String(testIdRef.current));
            params.set("testCnt", String(testCntRef.current));

            // セッションストレージの試験情報を削除
            sessionStorage.removeItem(SESSION_STORAGE_EXAM_DATA_KEY);

            // 試験結果画面に遷移
            router.push(`/exam/result?${params}`);

        } catch (error) {
            // エラー発生時、コンソールにエラーメッセージを出力し、アラートを表示
            console.error("試験解答の保存時のエラー:", error);
            alert(error instanceof Error ? error.message : "予期しないエラーが発生しました。");
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
                    className="btn btn-lg bg-[#3B7A57] hover:bg-[#2F5E42] text-white w-[160px]"
                    onClick={handlePrevButtonClick}
                    disabled={questionIndex === 0}
                >
                    前 へ
                </button>
                <button
                    className="btn btn-lg bg-[#2A5D9F] hover:bg-[#204673] text-white w-[160px]"
                    onClick={isLastQuestion ? handleAnswerCompleteButtonClick : handleNextButtonClick}
                    disabled={answers[questionIndex] === undefined}
                >
                    {isLastQuestion ? '解答終了' : '次 へ'}
                </button>
            </div>
        </>
    );
};