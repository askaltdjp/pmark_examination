/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import StartExamButton from "@/components/home/dashboard/StartExamButton";
import { MTest } from ".prisma/client_master";
import { TTest } from ".prisma/client_transaction/";
import { TestResult } from "@/lib/definitions/labels";
import { startAction } from "@/app/actions/exam/startAction";
import { MTestQuestion } from ".prisma/client_master";
import { ExamData } from "@/lib/definitions/types";
import { SESSION_STORAGE_EXAM_DATA_KEY } from "@/lib/definitions/system";

// 固定された日時（全テストで共通に使用）
const fixedDate = new Date("2025-08-29T11:01:20Z");

// startActionをモック（後で戻り値と例外を定義）
jest.mock("@/app/actions/exam/startAction");

// next/navigationをモック（router機能）
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

describe("StartExamButton.tsx", () => {
    describe("StartExamButton", () => {
        let mTest: MTest;

        afterEach(() => {
            // Jestのモックをリセット（spyOnなどを含む）
            jest.restoreAllMocks();
            // mockPush の呼び出し履歴をリセット（状態クリア）
            mockPush.mockReset();
        });

        describe("試験実施期間中・未受験", () => {
            beforeEach(() => {
                mTest = {
                    id: 1,
                    name: "2025年度 Pマーク試験",
                    startAt: new Date("1900-01-01T00:00:00Z"),
                    endAt: new Date("2100-12-31T23:59:59Z"),
                    questionNum: 10,
                    passNum: 8,
                    createAt: fixedDate,
                    updateAt: fixedDate,
                    deleteAt: null,
                };
                render(<StartExamButton mTest={mTest} tTest={null} />);
            });

            test("試験開始ボタンが活性である", () => {
                const button = screen.getByRole("button", { name: "試験開始" });
                expect(button).toBeInTheDocument();
                expect(button).not.toBeDisabled();
            });

            test("試験開始ボタン押下により試験画面に遷移する", async () => {
                // startAction が返す質問情報を定義
                const mTestQuestions: MTestQuestion[] = [
                    {
                        id: 1,
                        testId: 1,
                        questionNo: 1,
                        question: "問題1",
                        commentary: "解説1",
                        correct: true,
                        createAt: fixedDate,
                        updateAt: fixedDate,
                        deleteAt: null,
                    },
                    {
                        id: 2,
                        testId: 1,
                        questionNo: 2,
                        question: "問題2",
                        commentary: "解説2",
                        correct: true,
                        createAt: fixedDate,
                        updateAt: fixedDate,
                        deleteAt: null,
                    },
                ];
                const testCnt = 1;
                // モックされた startAction の戻り値を設定
                (startAction as jest.Mock).mockResolvedValue({ mTestQuestions, testCnt });
                // sessionStorage.setItem の呼び出しを監視
                const sessionStorageSpy = jest.spyOn(window.sessionStorage.__proto__, "setItem");

                const button = screen.getByRole("button", { name: "試験開始" });

                // 試験開始をクリック
                await userEvent.click(button);

                // 正しい引数でサーバアクションが呼ばれたことを確認
                expect(startAction).toHaveBeenCalledWith(mTest.id);

                // セッションストレージに保存されたデータ構造を確認
                const examData: ExamData = {
                    testId: mTest.id,
                    testCnt: 1,
                    questions: [{ questionNo: 1, question: "問題1" }, { questionNo: 2, question: "問題2" }],
                    answers: [],
                    questionIndex: 0,
                    isExamInProgress: false,
                };
                expect(sessionStorageSpy).toHaveBeenCalledWith(SESSION_STORAGE_EXAM_DATA_KEY, JSON.stringify(examData));

                // 試験画面への遷移が実行されたか確認
                expect(mockPush).toHaveBeenCalledWith("/exam/take");
            });

            test("試験開始ボタン押下によりエラーが発生する", async () => {
                // startAction がエラーを返すように設定
                (startAction as jest.Mock).mockRejectedValue(new Error("サーバエラーテスト"));

                // console.errorの抑制 と window.alertの監視
                const errorSpy = jest.spyOn(console, "error").mockImplementation(() => { });
                const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => { });

                const button = screen.getByRole("button", { name: "試験開始" });

                await userEvent.click(button);

                expect(alertSpy).toHaveBeenCalledWith("サーバエラーテスト");
            });
        });

        describe("試験実施期間中・未合格", () => {
            beforeEach(() => {
                const mTest: MTest = {
                    id: 1,
                    name: "2025年度 Pマーク試験",
                    startAt: new Date("1900-01-01T00:00:00Z"),
                    endAt: new Date("2100-12-31T23:59:59Z"),
                    questionNum: 10,
                    passNum: 8,
                    createAt: fixedDate,
                    updateAt: fixedDate,
                    deleteAt: null,
                };
                const tTest: TTest = {
                    id: 1,
                    employeeId: 1,
                    testId: 1,
                    testCnt: 1,
                    correctNum: 6,
                    result: TestResult.Fail,
                    testAt: fixedDate,
                    createAt: fixedDate,
                    updateAt: fixedDate,
                    deleteAt: null,
                };
                render(<StartExamButton mTest={mTest} tTest={tTest} />);
            });

            test("試験開始ボタンが活性である", () => {
                const button = screen.getByRole("button", { name: "試験開始" });
                expect(button).toBeInTheDocument();
                expect(button).not.toBeDisabled();
            });
        });

        describe("試験実施期間中・合格済", () => {
            beforeEach(() => {
                const mTest: MTest = {
                    id: 1,
                    name: "2025年度 Pマーク試験",
                    startAt: new Date("1900-01-01T00:00:00Z"),
                    endAt: new Date("2100-12-31T23:59:59Z"),
                    questionNum: 10,
                    passNum: 8,
                    createAt: fixedDate,
                    updateAt: fixedDate,
                    deleteAt: null,
                };
                const tTest: TTest = {
                    id: 1,
                    employeeId: 1,
                    testId: 1,
                    testCnt: 1,
                    correctNum: 10,
                    result: TestResult.Pass,
                    testAt: fixedDate,
                    createAt: fixedDate,
                    updateAt: fixedDate,
                    deleteAt: null,
                };
                render(<StartExamButton mTest={mTest} tTest={tTest} />);
            });

            test("試験開始ボタンが非活性である", () => {
                const button = screen.getByRole("button", { name: "試験開始" });
                expect(button).toBeInTheDocument();
                expect(button).toBeDisabled();
            });
        });

        describe("試験実施期間外", () => {
            beforeEach(() => {
                // 試験情報が存在しない＝試験期間外とみなす
                render(<StartExamButton mTest={null} tTest={null} />);
            });

            test("試験開始ボタンが非活性である", () => {
                const button = screen.getByRole("button", { name: "試験開始" });
                expect(button).toBeInTheDocument();
                expect(button).toBeDisabled();
            });
        });

    });
});