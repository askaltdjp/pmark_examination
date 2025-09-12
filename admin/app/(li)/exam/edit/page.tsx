import ExamClientWrapper from "@/components/exam/edit/ExamClientWrapper";
import { withRedirectErrorHandler } from "@/lib/utils/withRedirectErrorHandler";
import { editService } from "@/services/web/exam/editService";

/**
 * 試験管理 > 試験変更画面のサーバコンポーネント
 */
export default async function EditPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { mTest, questionDataList } = await withRedirectErrorHandler(async () => {
        // クエリパラメータを取得
        const params = await searchParams;

        // クエリパラメータから試験IDを取得
        if (!params.testId) {
            throw new Error("試験IDが提供されていません。");
        }
        const testId = Number(params.testId);

        // 試験概要と試験問題取得
        return await editService(testId);
    });

    return (
        <div className="flex justify-center items-start h-auto bg-base-200 pb-2">
            <div className="w-full max-w-7xl">
                {/* 見出し */}
                <h2 className="text-gray-600 text-3xl font-bold text-center mb-4">試験変更</h2>

                {/* 試験変更画面のクライアントロジックとUI */}
                <ExamClientWrapper mTest={mTest} questionDataList={questionDataList} />
            </div>
        </div>
    );
}