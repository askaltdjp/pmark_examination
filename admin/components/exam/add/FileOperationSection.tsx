"use client";

/**
 * ファイル操作と登録ボタンのクライアントコンポーネント
 */
export default function FileOperationSection() {
    return (
        <div className="w-full max-w-5xl mx-auto mb-4">
            <div className="grid grid-cols-[3fr_1fr_1fr] gap-4 items-start">

                {/* ファイル選択 */}
                <div className="flex border border-gray-400 rounded overflow-hidden h-10">
                    <input
                        type="file"
                        className="file-input file-input-bordered file-input-sm w-full rounded-none border-none focus:outline-none"
                        style={{ height: '100%' }}
                    />
                    <button className="btn btn-sm btn-outline btn-secondary h-full">
                        参 照
                    </button>
                </div>

                {/* インポート */}
                <button className="btn btn-sm btn-secondary w-full h-10">インポート</button>

                {/* エクスポート + 登録 */}
                <div className="flex flex-col items-stretch gap-4 w-full">
                    <button className="btn btn-sm btn-secondary w-full h-10">エクスポート</button>
                    <button className="btn btn-primary w-full h-10">登 録</button>
                </div>
            </div>
        </div>
    );
}