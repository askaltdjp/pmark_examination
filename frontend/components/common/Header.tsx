"use client";

import { useRouter } from "next/navigation";
import { SITE_TITLE } from '@/lib/constants/labels';

// 認証後画面の共通ヘッダーのクライアントコンポーネント
export default function Header() {
    const router = useRouter();

    // ログアウトボタン押下時の処理
    const handleLogout = async () => {
        // ログアウトAPIの呼び出し
        await fetch('/api/auth/logout', {
            "method": "POST",
        });

        // ログイン画面に遷移
        router.push("/auth/login");
    };

    return (
        <header className="fixed top-0 left-0 w-full h-14 z-50 bg-[#1a0f2c] text-white shadow-md px-4 flex items-center justify-between">
            <div className="flex-1" />
            <div className="flex-none">
                <h1 className="text-xl font-bold text-center">{SITE_TITLE}</h1>
            </div>
            <div className="flex-1 flex justify-end">
                <button
                    className="btn btn-sm bg-blue-200 text-gray-700 border border-blue-200 hover:bg-blue-300 hover:border-blue-300 transition-colors duration-200 mr-4"
                    onClick={handleLogout}
                >
                    ログアウト
                </button>
            </div>
        </header>
    );
}
