import CreateButton from "@/components/exam/list/CreateButton"
import DeleteButton from "@/components/exam/list/DeleteButton";
import StatusButton from "@/components/exam/list/StatusButton";
import UpdateButton from "@/components/exam/list/UpdateButton";

/**
 * 試験管理一覧のサーバコンポーネント
 */
export default function LoginPage() {
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
                                    <th className="w-25">合格者数</th>
                                    <th className="w-52">操作</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {Array.from({ length: 50 }).map((_, i) => (
                                    <tr key={i} className="text-gray-600">
                                        <td className="text-center">{i + 1}</td>
                                        <td>試験名 {i + 1}</td>
                                        <td className="text-center">2025/01/01</td>
                                        <td className="text-center">2025/01/31</td>
                                        <td className="text-center">31/31</td>
                                        <td className="text-center">
                                            {/* 変更ボタン */}
                                            <UpdateButton />
                                            {/* 状況ボタン */}
                                            <StatusButton />
                                            {/* 削除ボタン */}
                                            <DeleteButton />
                                        </td>
                                    </tr>
                                ))}
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