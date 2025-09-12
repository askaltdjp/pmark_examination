import DownloadButton from "@/components/exam/state/DownloadButton";
import StateListTable from "@/components/exam/state/StateListTable";
import { withRedirectErrorHandler } from "@/lib/utils/withRedirectErrorHandler";
import { stateService } from "@/services/web/exam/stateService";

/**
 * 試験管理 > 受験状況画面のサーバコンポーネント
 */
export default async function StatePage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { mTest, stateDataList } = await withRedirectErrorHandler(async () => {
        // クエリパラメータを取得
        const params = await searchParams;

        // クエリパラメータから試験IDを取得
        if (!params.testId) {
            throw new Error("試験IDが提供されていません。");
        }
        const testId = Number(params.testId);

        // 試験概要と受験状況のデータ取得
        return await stateService(testId);
    });

    return (
        <div className="flex justify-center items-start h-auto bg-base-200 pb-2">
            <div className="w-full max-w-7xl">
                {/* 見出し */}
                <h2 className="text-gray-600 text-3xl font-bold text-center mb-4">受験状況</h2>

                {/* 試験名 */}
                <div className="bg-white px-6 py-4 rounded-xl shadow-md w-full text-gray-800 mb-6">
                    <div className="text-sm text-gray-500 mb-1">試験名</div>
                    <div className="text-xl font-semibold text-gray-800">{mTest.name}</div>
                </div>

                {/* 受験状況一覧 */}
                <StateListTable testId={mTest.id} stateDataList={stateDataList} />

                {/* ダウンロードボタン */}
                <DownloadButton testId={mTest.id} />
            </div>
        </div>
    );
}