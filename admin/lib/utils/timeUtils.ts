// JSTのUTCとの差（9時間）をミリ秒で表した定数
const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

// 現在のUTC時刻に9時間を加えたDateオブジェクトを返す関数
//
// ★★★ 注意 ★★★
// 戻り値は厳密にはJSTの日時ではなく、UTC時刻に9時間を足したDateです。
// そのため、この値をそのままJSTとして表示すると、実際のJSTより9時間進んだ時間が表示されるので注意してください。
export function currentJST(): Date {
    return new Date(Date.now() + JST_OFFSET_MS);
}

// Dateオブジェクトを "YYYY/MM/DD HH:mm" 形式の文字列に変換する関数
// 指定された Date オブジェクトを基に、指定されたフォーマットに従って文字列を返します
// 使用可能なフォーマットのプレースホルダー：
//   - YYYY: 年（4桁）
//   - MM  : 月（2桁, 01〜12）
//   - DD  : 日（2桁, 01〜31）
//   - HH  : 時（2桁, 00〜23）
//   - mm  : 分（2桁, 00〜59）
//   - ss  : 秒（2桁, 00〜59）
// デフォルトのフォーマットは "YYYY/MM/DD HH:mm"
// @param date - フォーマット対象の Date オブジェクト
// @param format - 出力フォーマット文字列（省略時は "YYYY/MM/DD HH:mm"）
// @returns 指定フォーマットに整形された日付文字列（UTC時刻ベース）
export function formatDate(date: Date, format: string = "YYYY/MM/DD HH:mm"): string {
    const replacements: Record<string, string> = {
        YYYY: String(date.getUTCFullYear()),
        MM: String(date.getUTCMonth() + 1).padStart(2, "0"),
        DD: String(date.getUTCDate()).padStart(2, "0"),
        HH: String(date.getUTCHours()).padStart(2, "0"),
        mm: String(date.getUTCMinutes()).padStart(2, "0"),
        ss: String(date.getUTCSeconds()).padStart(2, "0"),
    };

    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => replacements[match]);
}

// 年度を取得する関数
// @param date - 年度取得対象の Date オブジェクト
// @returns 引数の日付の年度
export function getFiscalYear(date: Date): number {
    const d = new Date(date);
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth(); // 0 = Jan, 3 = April

    // 4月以降はその年が年度、1月〜3月は前年が年度（UTC基準）
    return month >= 3 ? year : year - 1;
}