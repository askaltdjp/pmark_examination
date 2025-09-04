import CreateButton from "@/components/exam/list/CreateButton"
import ExamListTable from "@/components/exam/list/ExamListTable";
import { withRedirectErrorHandler } from "@/lib/utils/withRedirectErrorHandler";
import { listService } from "@/services/web/exam/listService";

/**
 * 試験管理一覧のサーバコンポーネント
 */
export default async function LoginPage() {
    const { mTests, testSummary } = await withRedirectErrorHandler(async () => {
        // 試験一覧と各試験の集計結果を取得
        return await listService();
    });

    return (
        /* ヘッダー分だけ高さを調整（モバイル対応） */
        <div className="h-[calc(100vh-116px)] lg:h-[calc(100vh-52px)] flex flex-col justify-start bg-base-200">

            {/* 試験一覧（見出し） */}
            <div className="flex justify-center mt-5">
                <div className="w-[90%]">
                    <h2 className="text-gray-600 text-3xl font-bold text-center mb-4">試験一覧</h2>
                </div>
            </div>

            {/* 試験一覧（テーブル） */}
            <ExamListTable mTests={mTests} testSummary={testSummary} />

            {/* 新規登録 */}
            <CreateButton />
        </div>
    );
}