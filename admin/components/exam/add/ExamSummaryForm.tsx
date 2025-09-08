"use client";

/**
 * 試験概要のクライアントコンポーネント
 */
export default function ExamSummaryForm() {
    return (
        <div className="bg-white p-3 rounded-xl shadow-md w-full text-gray-800 mb-4">
            <table className="table w-full border border-white border-collapse">
                <tbody>
                    {/* 1行目 */}
                    <tr>
                        <th
                            className="py-1.5 pr-2 font-semibold text-gray-700 whitespace-nowrap text-sm align-middle text-left border border-white"
                            style={{ minWidth: '80px' }}
                        >
                            試験ID
                        </th>
                        <td className="py-1.5 pr-6 align-middle border border-white" style={{ minWidth: '40px' }}>
                            1
                        </td>
                        <th
                            className="py-1.5 pr-2 font-semibold text-gray-700 whitespace-nowrap text-sm align-middle text-left border border-white"
                            style={{ minWidth: '80px' }}
                        >
                            試験名
                        </th>
                        <td className="py-1.5 px-6 align-middle border border-white">
                            <input
                                type="text"
                                defaultValue="試験名"
                                className="input input-bordered input-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            />
                        </td>
                    </tr>

                    {/* 2行目 */}
                    <tr>
                        <th
                            className="py-1.5 pr-2 font-semibold text-gray-700 whitespace-nowrap text-sm align-middle text-left border border-white"
                            style={{ minWidth: '80px' }}
                        >
                            期間
                        </th>
                        <td className="py-1.5 pr-6 align-middle border border-white" style={{ minWidth: '280px' }}>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="date"
                                    className="input input-bordered input-md w-full max-w-[160px] focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                                <span className="whitespace-nowrap">～</span>
                                <input
                                    type="date"
                                    className="input input-bordered input-md w-full max-w-[160px] focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </div>
                        </td>
                        <td className="border border-white"></td>
                        <td className="border border-white"></td>
                    </tr>

                    {/* 3行目 */}
                    <tr>
                        <th
                            className="py-1.5 pr-2 font-semibold text-gray-700 whitespace-nowrap text-sm align-middle text-left border border-white"
                            style={{ minWidth: '80px' }}
                        >
                            出題数
                        </th>
                        <td className="py-1.5 pr-6 align-middle border border-white" style={{ minWidth: '130px' }}>
                            <input
                                type="number"
                                defaultValue="20"
                                className="input input-bordered input-md w-full max-w-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            />
                        </td>
                        <th
                            className="py-1.5 pr-2 font-semibold text-gray-700 whitespace-nowrap text-sm align-middle text-left border border-white"
                            style={{ minWidth: '80px' }}
                        >
                            合格数
                        </th>
                        <td className="py-1.5 px-6 align-middle border border-white" style={{ minWidth: '130px' }}>
                            <input
                                type="number"
                                defaultValue="18"
                                className="input input-bordered input-md w-full max-w-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}