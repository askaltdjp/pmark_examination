/**
 * @jest-environment jsdom
 */

import { render, screen, within } from "@testing-library/react";
import '@testing-library/jest-dom';
import { headers } from "next/headers";
import { getEmployeeFromRequest } from "@/lib/utils/employeeUtils";
import DashBoardPage from "@/app/(li)/home/dashboard/page";
import { TEmployee } from ".prisma/client_transaction";
import { MTest } from ".prisma/client_master";
import { TTest } from ".prisma/client_transaction/";
import { TestResult } from "@/lib/definitions/labels";
import { dashboardService } from '@/services/web/home/dashboardService';
import { useRouter } from "next/navigation";

// 固定された日時（全テストで共通に使用）
const fixedDate = new Date("2025-08-29T11:01:20Z");

// モック化（DashBoardPageの依存モジュール）
jest.mock("next/headers");
jest.mock("@/lib/utils/employeeUtils");
jest.mock("next/navigation");
jest.mock("@/services/web/home/dashboardService");

describe("page.tsx", () => {
    beforeEach(() => {
        jest.resetAllMocks();

        (headers as jest.Mock).mockResolvedValue({});
        const tEmployee: TEmployee = {
            id: 1,
            employeeNo: "001",
            name: "テスト太郎",
            emailAddress: "test_taro@aska-ltd.jp",
            password: "password",
            joinDate: fixedDate,
            createAt: fixedDate,
            updateAt: fixedDate,
            deleteAt: null,
        };
        (getEmployeeFromRequest as jest.Mock).mockResolvedValue(tEmployee);
        (useRouter as jest.Mock).mockResolvedValue({});
    });

    describe("DashBoardPage", () => {
        describe("試験実施期間中・未合格", () => {
            beforeEach(async () => {
                // dashboardService用のモックデータ作成
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
                const tTests: TTest[] = [
                    {
                        id: 3,
                        employeeId: 1,
                        testId: 1,
                        testCnt: 3,
                        correctNum: 6,
                        result: TestResult.Fail,
                        testAt: fixedDate,
                        createAt: fixedDate,
                        updateAt: fixedDate,
                        deleteAt: null,
                    },
                    {
                        id: 2,
                        employeeId: 1,
                        testId: 1,
                        testCnt: 2,
                        correctNum: 0,
                        result: TestResult.Interrupted,
                        testAt: fixedDate,
                        createAt: fixedDate,
                        updateAt: fixedDate,
                        deleteAt: null,
                    },
                    {
                        id: 1,
                        employeeId: 1,
                        testId: 1,
                        testCnt: 1,
                        correctNum: 5,
                        result: TestResult.Fail,
                        testAt: fixedDate,
                        createAt: fixedDate,
                        updateAt: fixedDate,
                        deleteAt: null,
                    },
                ];

                // モック化したdashboardServiceの戻り値を設定
                (dashboardService as jest.Mock).mockResolvedValue({ mTest, tTests });

                // Reactエレメントを取得してレンダリング
                const page = await DashBoardPage();
                render(page);
            });

            test("社員情報と試験内容が正しく表示される", () => {
                const expectedRows = [
                    [
                        { rowIndex: 0, label: "社員No", value: "001" },
                        { rowIndex: 0, label: "氏名", value: "テスト太郎" },
                    ],
                    [
                        { rowIndex: 1, label: "試験内容", value: "2025年度 Pマーク試験" },
                        { rowIndex: 1, label: "合格条件", value: "10 問中 8 問正解で合格" },
                    ],
                ];

                const tables = screen.getAllByRole("table");
                const rows = within(tables[0]).getAllByRole("row");

                rows.forEach((row, rowIndex) => {
                    const cells = row.querySelectorAll("th, td");
                    expectedRows[rowIndex].forEach(({ label, value }, i) => {
                        expect(cells[i * 2].textContent).toBe(label);
                        expect(cells[i * 2 + 1].textContent).toBe(value);
                    });
                });
            });

            test("受験履歴が正しく表示される", () => {
                const heading = screen.getByRole("heading", { level: 2 });
                expect(heading.textContent).toBe("受験履歴");

                const tables = screen.getAllByRole("table");
                const table = tables[1];

                const rows = within(table).getAllByRole("row");
                const headers = within(rows[0]).getAllByRole("columnheader");

                expect(headers[0].textContent).toBe("受験日時");
                expect(headers[1].textContent).toBe("正解状況");
                expect(headers[2].textContent).toBe("結果");
                expect(headers[3].textContent).toBe("解答");

                // 表示される受験履歴の検証
                const expectedRows = [
                    ["2025/08/29 11:01", "6 / 10", "不合格", true],
                    ["2025/08/29 11:01", "?? / 10", "中断", false],
                    ["2025/08/29 11:01", "5 / 10", "不合格", true],
                ];

                expectedRows.forEach(([date, score, result, enabled], i) => {
                    const row = rows[i + 1];
                    const cells = within(row).getAllByRole("cell");
                    expect(cells[0].textContent).toBe(date);
                    expect(cells[1].textContent).toBe(score);
                    expect(cells[2].textContent).toBe(result);
                    const button = within(cells[3]).getByRole("button", { name: "確 認" });
                    expect(button).toBeInTheDocument();
                    if (enabled) {
                        expect(button).not.toBeDisabled();
                    } else {
                        expect(button).toBeDisabled();
                    }
                });
            });

            test("試験開始ボタンが正しく表示される", () => {
                const button = screen.getByRole("button", { name: "試験開始" });
                expect(button).toBeInTheDocument();
                expect(button).not.toBeDisabled();
            });
        });

        describe("試験実施期間中・合格済", () => {
            beforeEach(async () => {
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
                const tTests: TTest[] = [
                    {
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
                    },
                ];
                (dashboardService as jest.Mock).mockResolvedValue({ mTest, tTests });

                const page = await DashBoardPage();
                render(page);
            });

            test("試験開始ボタンが非活性である", () => {
                const button = screen.getByRole("button", { name: "試験開始" });
                expect(button).toBeInTheDocument();
                expect(button).toBeDisabled();
            });
        });

        describe("試験実施期間中・未受験", () => {
            beforeEach(async () => {
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
                const tTests: TTest[] = [];
                (dashboardService as jest.Mock).mockResolvedValue({ mTest, tTests });

                const page = await DashBoardPage();
                render(page);
            });

            test("受験履歴が表示されない", () => {
                const text = screen.getByText("受験履歴がありません");
                expect(text).toBeInTheDocument();
            });
        });

        describe("試験実施期間外", () => {
            beforeEach(async () => {
                const mTest: MTest | null = null;
                const tTests: TTest[] = [];
                (dashboardService as jest.Mock).mockResolvedValue({ mTest, tTests });

                const page = await DashBoardPage();
                render(page);
            });

            test("社員情報と試験内容が正しく表示される", () => {
                const expectedRows = [
                    [
                        { rowIndex: 0, label: "社員No", value: "001" },
                        { rowIndex: 0, label: "氏名", value: "テスト太郎" },
                    ],
                    [
                        { rowIndex: 1, label: "試験内容", value: "実施中の試験はありません" },
                        { rowIndex: 1, label: "合格条件", value: "－" },
                    ],
                ];

                const tables = screen.getAllByRole("table");
                const rows = within(tables[0]).getAllByRole("row");

                rows.forEach((row, rowIndex) => {
                    const cells = row.querySelectorAll("th, td");
                    expectedRows[rowIndex].forEach(({ label, value }, i) => {
                        expect(cells[i * 2].textContent).toBe(label);
                        expect(cells[i * 2 + 1].textContent).toBe(value);
                    });
                });
            });

            test("受験履歴が表示されない", () => {
                const text = screen.getByText("受験履歴がありません");
                expect(text).toBeInTheDocument();
            });

            test("試験開始ボタンが非活性である", () => {
                const button = screen.getByRole("button", { name: "試験開始" });
                expect(button).toBeInTheDocument();
                expect(button).toBeDisabled();
            });
        });
    });
});