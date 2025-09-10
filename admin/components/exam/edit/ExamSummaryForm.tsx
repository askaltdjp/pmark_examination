"use client";

import { MAX_TEST_NAME_LENGTH } from "@/lib/definitions/system";
import { ExamState } from "@/lib/definitions/types";

/**
 * 試験概要のクライアントコンポーネント
 */
export default function ExamSummaryForm({
    testId,
    examState: {
        name,
        setName,
        startAt,
        setStartAt,
        endAt,
        setEndAt,
        questionNum,
        setQuestionNum,
        passNum,
        setPassNum,
    },
    isExpired,
}: {
    testId: number,
    examState: ExamState;
    isExpired: boolean,
}) {
    return (
        <div className="bg-white px-16 py-3 rounded-xl shadow-md w-full text-gray-800 mb-4">
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
                            {testId}
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
                                value={name}
                                maxLength={MAX_TEST_NAME_LENGTH}
                                onChange={e => setName(e.target.value)}
                                className="input input-bordered input-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                disabled={isExpired}
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
                                    value={startAt}
                                    max="2100-12-31"
                                    onChange={e => setStartAt(e.target.value)}
                                    className="input input-bordered input-md w-full max-w-[160px] focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                    disabled={isExpired}
                                />
                                <span className="whitespace-nowrap">～</span>
                                <input
                                    type="date"
                                    value={endAt}
                                    max="2100-12-31"
                                    onChange={e => setEndAt(e.target.value)}
                                    className="input input-bordered input-md w-full max-w-[160px] focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                    disabled={isExpired}
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
                                value={questionNum}
                                onChange={e => setQuestionNum(e.target.value)}
                                className="input input-bordered input-md w-full max-w-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                disabled={isExpired}
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
                                value={passNum}
                                onChange={e => setPassNum(e.target.value)}
                                className="input input-bordered input-md w-full max-w-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                disabled={isExpired}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}