import { DocumentDuplicateIcon, UsersIcon } from '@heroicons/react/24/outline';
import { DocumentPlusIcon, DocumentTextIcon, DocumentChartBarIcon } from '@heroicons/react/24/outline';
import { UserPlusIcon, UserIcon } from '@heroicons/react/24/outline';
import { PageType } from '@/lib/definitions/types';

// ブラウザのタブなどに表示されるHTMLタイトル用
export const HTML_TITLE = "Pマーク 教育テスト | 管理画面";

// サイトの説明文
export const HTML_DESCRIPTION = "Pマーク（個人情報保護）WEB教育テストの受講状況や成績を一元管理できる管理者用画面です。受講者の進捗確認、結果の確認、アカウント管理などを通じて、社内の情報管理体制の強化と教育の継続的改善をサポートします。";

// 合否ステータスの定義
export const TestResult = {
    Interrupted: 0,
    Pass: 1,
    Fail: 2,
} as const;

// 合否ステータスの表示ラベルマップ
export const testResultLabels: string[] = [];
testResultLabels[TestResult.Interrupted] = "中断";
testResultLabels[TestResult.Pass] = "合格";
testResultLabels[TestResult.Fail] = "不合格";

// ページごとの設定データ
export const pageMap: PageType = {
    exam: {
        label: "試験管理",
        basePath: "/exam/list",
        icon: DocumentDuplicateIcon,
        actions: {
            add: { label: "試験登録", icon: DocumentPlusIcon },
            edit: { label: "試験変更", icon: DocumentTextIcon },
            state: { label: "受験状況", icon: DocumentChartBarIcon },
        },
    },
    employee: {
        label: "社員管理",
        basePath: "/employee/list",
        icon: UsersIcon,
        actions: {
            add: { label: "社員登録", icon: UserPlusIcon },
            edit: { label: "社員変更", icon: UserIcon },
        },
    },
};