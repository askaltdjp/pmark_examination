import { currentJST, formatDate } from "@/lib/utils/timeUtils";

describe("timeUtils.ts", () => {

    describe("currentJST", () => {
        test("UTC＋9時間のDateクラスを返却すること", () => {
            const now = Date.now();
            const result = currentJST().getTime();
            const expected = now + 9 * 60 * 60 * 1000;
            // 1秒未満の誤差は許容
            expect(Math.abs(result - expected)).toBeLessThan(1000);
        });
    });

    describe("formatDate", () => {
        test("デフォルトフォーマットで日時文字列を返却すること", () => {
            // UTC時間としてDateオブジェクトを作成
            const date = new Date("2025-08-28T12:07:09Z");
            const result = formatDate(date);
            const expected = "2025/08/28 12:07";
            expect(result).toBe(expected);
        });
        test("カスタムフォーマットで日時文字列を返却すること", () => {
            // UTC時間としてDateオブジェクトを作成
            const date = new Date("2025-08-28T12:07:09Z");
            const result = formatDate(date, "YYYY年MM月DD日 HH時mm分ss秒");
            const expected = "2025年08月28日 12時07分09秒";
            expect(result).toBe(expected);
        });
    });

});