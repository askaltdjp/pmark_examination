"use client";

import { useRouter, usePathname } from "next/navigation";
import { SITE_TITLE } from '@/lib/constants/labels';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';

/**
 * 認証後画面の共通ヘッダーのクライアントコンポーネント
 */
export default function Header() {
    const router = useRouter();
    const pathname = usePathname();

    // ログアウトボタン押下時の処理
    const handleLogoutButtonClick = async () => {
        // ログアウトAPIの呼び出し
        await fetch('/api/auth/logout', {
            "method": "POST",
        });

        // ログイン画面に遷移
        router.push("/auth/login");
    };

    // ログアウトボタンを非表示にしたい画面のURL
    const hideLogoutButtonPaths = [
        '/exam/take',
        '/exam/result',
    ];

    // 現在のパスが非表示リストに含まれているか判定
    const isLogoutHidden = hideLogoutButtonPaths.includes(pathname);

    return (
        <header className="fixed top-0 left-0 w-full h-14 z-50 bg-[#1a0f2c] text-white shadow-md px-4 flex items-center justify-center">
            <div className="flex-1" /> {/* 左側の空き */}
            <div className="flex-none">
                <h1 className="text-xl font-bold text-center">{SITE_TITLE}</h1>
            </div>
            {/* 右側はボタンの有無にかかわらずflex-1で空き確保 */}
            <div className="flex-1 flex justify-end">
                {!isLogoutHidden && (
                    <button
                        className="btn btn-sm bg-blue-200 text-gray-700 border border-blue-200 hover:bg-blue-300 hover:border-blue-300 transition-colors duration-200 mr-4"
                        onClick={handleLogoutButtonClick}
                    >
                        <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                        ログアウト
                    </button>
                )}
            </div>
        </header>
    );
}
