// サイトのタイトル
export const SITE_TITLE = 'Pマーク 教育テスト';

// サイトの説明文
export const SITE_DESCRIPTION = '個人情報保護（Pマーク）に関する理解度を測るWEB教育テストです。従業員の知識向上と社内の情報管理体制強化を目的としています。';

// 合否ステータスの定義
export const TestResult = {
    Interrupted: 0,
    Pass: 1,
    Fail: 2,
} as const;

// 合否ステータスの表示ラベルマップ
export const testResultLabels: string[] = [];
testResultLabels[TestResult.Interrupted] = '中断';
testResultLabels[TestResult.Pass] = '合格';
testResultLabels[TestResult.Fail] = '不合格';