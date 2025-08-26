// 認証前画面のレイアウトコンポーネント
export default function UnauthenticatedLayout({ children }: { children: React.ReactNode }) {
    return (
        <main>
            {children}
        </main>
    );
}