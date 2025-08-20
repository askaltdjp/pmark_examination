import LoginForm from "@/components/auth/login/LoginForm";
import Breadcrumb from "@/components/common/Breadcrumb";

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
                                            <button className="btn btn-sm border-slate-500 bg-slate-600 hover:bg-slate-500 text-white mx-1">
                                                変更
                                            </button>
                                            <button className="btn btn-sm border-slate-500 bg-slate-600 hover:bg-slate-500 text-white mx-1">
                                                状況
                                            </button>
                                            <button className="btn btn-sm border-slate-500 bg-slate-600 hover:bg-slate-500 text-white mx-1">
                                                削除
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="w-[90%] text-right py-3">
                    <button className="btn border-slate-500 bg-slate-600 hover:bg-slate-500 text-white mx-1">
                        新規登録
                    </button>
                </div>
            </div>
        </div>
    );
}