"use client";

import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline'

export default function Header() {
    return (
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
    );
}