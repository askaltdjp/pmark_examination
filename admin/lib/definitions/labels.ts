import { DocumentDuplicateIcon, UsersIcon } from '@heroicons/react/24/outline';
import { DocumentPlusIcon, DocumentTextIcon, DocumentChartBarIcon } from '@heroicons/react/24/outline';
import { UserPlusIcon, UserIcon } from '@heroicons/react/24/outline';
import { FC, SVGProps } from 'react';

// ブラウザのタブなどに表示されるHTMLタイトル用
export const HTML_TITLE = "Pマーク 教育テスト | 管理画面";

// サイトの説明文
export const HTML_DESCRIPTION = "Pマーク（個人情報保護）WEB教育テストの受講状況や成績を一元管理できる管理者用画面です。受講者の進捗確認、結果の確認、アカウント管理などを通じて、社内の情報管理体制の強化と教育の継続的改善をサポートします。";

// SVGアイコン用の型定義
export type IconType = FC<SVGProps<SVGSVGElement>>;

// ページ情報の型定義
export type PageType = Record<
    string,
    {
        label: string;
        basePath: string;
        icon: IconType;
        actions: Record<string, { label: string, icon: IconType }>;
    }
>;

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