export default function SamplePage() {
    return (
        <main className="p-8">
            <h1 className="text-4xl font-bold mb-6">DaisyUI + Next.js サーバーコンポーネント例</h1>

            <button className="btn btn-primary mr-4">プライマリーボタン</button>
            <button className="btn btn-secondary">セカンダリーボタン</button>

            <div className="alert alert-info mt-8">
                <span>これは DaisyUI のアラートコンポーネントです。</span>
            </div>
        </main>
    );
}
