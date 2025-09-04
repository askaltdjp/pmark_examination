import CreateButton from "@/components/exam/list/CreateButton"
import DeleteButton from "@/components/exam/list/DeleteButton";
import StatusButton from "@/components/exam/list/StatusButton";
import UpdateButton from "@/components/exam/list/UpdateButton";
import { formatDate } from "@/lib/utils/timeUtils";
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

            <div className="flex justify-center mt-5">
                <div className="w-[90%]">
                    <h2 className="text-gray-600 text-3xl font-bold text-center mb-4">試験一覧</h2>
                </div>
            </div>

            {/* 表 */}
            <div className="flex justify-center h-[75%]">
                <div className="w-[90%] p-3 bg-white shadow rounded">
                    <div className="h-full overflow-y-auto">
                        <table className="table table-zebra w-full">
                            <thead className="sticky top-0 bg-white">
                                <tr className="text-center text-gray-600">
                                    <th className="w-10">ID</th>
                                    <th>試験名</th>
                                    <th className="w-28">開始日</th>
                                    <th className="w-28">終了日</th>
                                    <th className="w-12">受験者数</th>
                                    <th className="w-12">合格者数</th>
                                    <th className="w-53">操作</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {mTests.map((mTest, i) => {
                                    return (
                                        <tr key={i} className="text-gray-600">
                                            <td className="text-center">{i + 1}</td>
                                            <td>{mTest.name}</td>
                                            <td className="text-center">{formatDate(mTest.startAt, "YYYY/MM/DD")}</td>
                                            <td className="text-center">{formatDate(mTest.endAt, "YYYY/MM/DD")}</td>
                                            <td className="text-center">{testSummary[mTest.id]?.examineeNum ?? 0}</td>
                                            <td className="text-center">{testSummary[mTest.id]?.passerNum ?? 0}</td>
                                            <td className="text-center">
                                                {/* 変更ボタン */}
                                                <UpdateButton />
                                                {/* 状況ボタン */}
                                                <StatusButton />
                                                {/* 削除ボタン */}
                                                <DeleteButton mTest={mTest} />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 新規登録 */}
            <CreateButton />
        </div>
    );
}