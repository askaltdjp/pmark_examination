"use client";

import { CircleStackIcon, UsersIcon } from '@heroicons/react/24/outline'
import { DocumentTextIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import { UserPlusIcon, UserIcon } from '@heroicons/react/24/outline'
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline'
import { useState } from "react";

export default function LoginLayout({ children }: { children: React.ReactNode }) {

    // 開いているメニューの設定
    const [openMenu, setOpenMenu] = useState(null);

    // メニュー選択時の処理
    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    // 選択中のメニューの色
    const activeMenuClass = "bg-slate-600";

    return (
        <main>
            <div className="drawer lg:drawer-open">
                {/* トグルボタン (モバイル向け) */}
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />

                {/* サイドメニュー */}
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
                                    <CircleStackIcon className="w-5 h-5" />
                                    試験管理
                                </button>
                                {openMenu === "examination" && (
                                    <ul className="p-0 m-0">
                                        <li><a className="pl-6 bg-slate-700 hover:bg-slate-500 leading-9 text-sm">
                                            <DocumentTextIcon className="w-5 h-5" />
                                            試験問題
                                        </a></li>
                                        <li><a className="pl-6 bg-slate-700 hover:bg-slate-500 leading-9 text-sm">
                                            <ClipboardDocumentIcon className="w-5 h-5" />
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

                {/* メインコンテンツ */}
                <div className="drawer-content">
        
                    <label htmlFor="my-drawer" className="h-8 btn btn-sm btn-primary drawer-button lg:hidden m-4 z-10">
                        メニューを開く
                    </label>
            
                    {/* ヘッダー */}
                    <header className="flex justify-end h-13 grid grid-cols-3 items-center justify-end border-b border-sky-700 bg-sky-700 text-white">
                        
                        {/* 左側（なし） */}
                        <div></div>

                        {/* 中央（タイトル） */}
                        <h1 className="text-2xl font-bold text-center">
                            Web試験システム
                        </h1>

                        {/* 右側（ログアウトボタン） */}
                        <div className="flex justify-end pr-3">
                            <button className="btn btn-sm border-slate-500 bg-slate-600 hover:bg-slate-500 text-white">
                                <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                                ログアウト
                            </button>
                        </div>
                    </header>

                    <div>
                        {children}
                    </div>
                </div>
            </div>
        </main>
    );
}