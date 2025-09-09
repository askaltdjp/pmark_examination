import ExamClientWrapper from "@/components/exam/add/ExamClientWrapper";
import { withRedirectErrorHandler } from "@/lib/utils/withRedirectErrorHandler";
import { addService } from "@/services/web/exam/addService";

/**
 * 試験管理 > 登録画面のサーバコンポーネント
 */
export default async function AddPage() {
    // 試験IDの最大値取得
    const { maxId } = await withRedirectErrorHandler(async () => {
        return await addService();
    });

    return (
        <div className="flex justify-center items-start h-auto bg-base-200 pb-2">
            <div className="w-full max-w-7xl">
                {/* 見出し */}
                <h2 className="text-gray-600 text-3xl font-bold text-center mb-4">試験登録</h2>

                {/* 試験登録画面のクライアントロジックとUI */}
                <ExamClientWrapper maxId={maxId} />
            </div>
        </div>
    );
}