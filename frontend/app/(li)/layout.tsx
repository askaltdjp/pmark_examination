import Header from "@/components/common/Header";

// 認証済み画面のレイアウトコンポーネント
export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className="pt-20 min-h-screen bg-base-200">
                {children}
            </main>
        </>
    );
}
