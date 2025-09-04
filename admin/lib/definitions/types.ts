// testId をキーに持ち、各試験の受験者数と合格者数を表すレコード型
export type TestSummaryRecord = Record<
    number,
    {
        examineeNum: number; // 受験者数
        passerNum: number;   // 合格者数
    }
>;