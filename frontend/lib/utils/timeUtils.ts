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
// Dateが内部で保持しているUTC時刻を基にフォーマットしています
export function formatDate(date: Date): string {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    const h = String(date.getUTCHours()).padStart(2, '0');
    const min = String(date.getUTCMinutes()).padStart(2, '0');
    // const s = String(date.getUTCSeconds()).padStart(2, '0');

    return `${y}/${m}/${d} ${h}:${min}`;
}