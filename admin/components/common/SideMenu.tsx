"use client";

import { pageMap } from '@/lib/definitions/labels';
import { useRouter, usePathname } from 'next/navigation';

/**
 * 認証後画面のサイドメニューのクライアントコンポーネント
 */
export default function SideMenu() {
    const router = useRouter();

    // メニューボタン押下時の処理
    const handleMenuButtonClick = (basePath: string) => {
        router.push(basePath);
    };

    // URL情報を取得
    const pathname = usePathname();
    const segments = pathname?.split("/").filter(Boolean);
    const [controller, action] = segments;

    // URL情報からページ情報を取得
    const page = pageMap[controller];
    const ActionIcon = page.actions[action]?.icon;

    // 選択中のメニューの色
    const activeMenuClass = "bg-slate-600";

    return (
        <div className="drawer-side bg-slate-800">

            {/* ヘッダー */}
            <div className="z-10 w-60">
                <header className="w-full h-13 flex items-center justify-center border-b border-sky-800 bg-sky-800 text-white">
                    <h1 className="text-lg font-bold">PMark Examination</h1>
                </header>
            </div>

            {/* メニュー */}
            <label htmlFor="my-drawer" className="drawer-overlay"></label>

            {/* ヘッダー分だけ高さを調整（モバイル対応）*/}
            <div className="w-60 mt-[52px] lg:mt-0">
                <ul className="w-full menu p-0 m-0 text-white overflow-y-auto">
                    <li>
                        <button
                            className={`w-full leading-9 text-left flex items-center gap-2 hover:${activeMenuClass} ${controller === "exam" ? activeMenuClass : ""}`}
                            onClick={() => handleMenuButtonClick(pageMap.exam.basePath)}
                        >
                            <pageMap.exam.icon className="w-5 h-5" />
                            {pageMap.exam.label}
                        </button>
                        {controller === "exam" && page.actions[action] && (
                            <ul className="p-0 m-0">
                                <li>
                                    <a className="pl-6 bg-slate-700 hover:bg-slate-500 leading-9 text-sm">
                                        {ActionIcon && (
                                            <ActionIcon className="w-5 h-5" />
                                        )}
                                        {page.actions[action].label}
                                    </a>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li>
                        <button
                            className={`w-full leading-9 text-left flex items-center gap-2 hover:${activeMenuClass} ${controller === "employee" ? activeMenuClass : ""}`}
                            onClick={() => handleMenuButtonClick(pageMap.employee.basePath)}
                        >
                            <pageMap.employee.icon className="w-5 h-5" />
                            {pageMap.employee.label}
                        </button>
                        {controller === "employee" && page.actions[action] && (
                            <ul className="p-0 m-0">
                                <li>
                                    <a className="pl-6 bg-slate-700 hover:bg-slate-500 leading-9 text-sm">
                                        {ActionIcon && (
                                            <ActionIcon className="w-5 h-5" />
                                        )}
                                        {page.actions[action].label}
                                    </a>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
}