import ExamClientWrapper from "@/components/exam/add/ExamClientWrapper";

/**
 * 試験管理 > 登録画面のサーバコンポーネント
 */
export default async function AddPage() {
    return (
        <div className="flex justify-center items-start h-auto bg-base-200 pb-2">
            <div className="w-full max-w-5xl">
                {/* 見出し */}
                <h2 className="text-center text-2xl font-bold text-gray-700 mb-2">試験登録</h2>

                {/* 試験登録画面のクライアントロジックとUI */}
                <ExamClientWrapper />
            </div>
        </div>
    );
}