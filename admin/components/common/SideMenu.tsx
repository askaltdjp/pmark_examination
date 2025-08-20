"use client";

import { DocumentDuplicateIcon, UsersIcon } from '@heroicons/react/24/outline'
import { DocumentPlusIcon, DocumentTextIcon, DocumentChartBarIcon } from '@heroicons/react/24/outline'
import { UserPlusIcon, UserIcon } from '@heroicons/react/24/outline'
import { useState } from "react";

export default function SideMenu() {

    // 開いているメニューの設定
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    // メニュー選択時の処理
    const toggleMenu = (menu: string) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

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
                            onClick={() => toggleMenu("examination")}
                            className={`w-full leading-9 text-left flex items-center gap-2 hover:${activeMenuClass} ${
                                openMenu === "examination" ? activeMenuClass : ""
                            }`}
                        >
                            <DocumentDuplicateIcon className="w-5 h-5" />
                            試験管理
                        </button>
                        {openMenu === "examination" && (
                            <ul className="p-0 m-0">
                                <li><a className="pl-6 bg-slate-700 hover:bg-slate-500 leading-9 text-sm">
                                    <DocumentPlusIcon className="w-5 h-5" />
                                    試験追加
                                </a></li>
                                <li><a className="pl-6 bg-slate-700 hover:bg-slate-500 leading-9 text-sm">
                                    <DocumentTextIcon className="w-5 h-5" />
                                    試験変更
                                </a></li>
                                <li><a className="pl-6 bg-slate-700 hover:bg-slate-500 leading-9 text-sm">
                                    <DocumentChartBarIcon className="w-5 h-5" />
                                    受験状況
                                </a></li>
                            </ul>
                        )}
                    </li>

                    <li>
                        <button
                            onClick={() => toggleMenu("employee")}
                            className={`w-full leading-9 text-left flex items-center gap-2 hover:${activeMenuClass} ${
                                openMenu === "employee" ? activeMenuClass : ""
                            }`}
                        >
                            <UsersIcon className="w-5 h-5" />
                            社員管理
                        </button>
                        {openMenu === "employee" && (
                            <ul className="p-0 m-0">
                                <li><a className="pl-6 bg-slate-700 hover:bg-slate-500 leading-9 text-sm">
                                    <UserPlusIcon className="w-5 h-5" />
                                    社員登録
                                </a></li>
                                <li><a className="pl-6 bg-slate-700 hover:bg-slate-500 leading-9 text-sm">
                                    <UserIcon className="w-5 h-5" />
                                    社員変更
                                </a></li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
}