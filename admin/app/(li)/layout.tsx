"use client";

import SideMenu from "@/components/common/SideMenu";
import Header from "@/components/common/Header";

export default function LoginLayout({ children }: { children: React.ReactNode }) {

    return (
        <main>
            <div className="drawer lg:drawer-open">
                {/* トグルボタン (モバイル向け) */}
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />

                {/* サイドメニュー */}
                <SideMenu />

                {/* メインコンテンツ */}
                <div className="drawer-content">
        
                    {/* メニューボタン (モバイル向け) */}
                    <label htmlFor="my-drawer" className="h-8 btn btn-sm btn-primary drawer-button lg:hidden m-4 z-10">
                        メニューを開く
                    </label>
            
                    {/* ヘッダー */}
                    <Header />

                    <div>
                        {children}
                    </div>
                </div>
            </div>
        </main>
    );
}