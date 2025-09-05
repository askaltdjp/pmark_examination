/**
 * 試験管理 - 登録画面のサーバコンポーネント
 */
export default async function AddPage() {
    return (
        <div className="flex justify-center items-start h-auto bg-base-200 pb-2">
            <div className="w-full max-w-5xl">
                {/* 見出し */}
                <h2 className="text-center text-2xl font-bold text-gray-700 mb-2">試験登録</h2>

                {/* 試験概要 */}
                <div className="bg-white p-4 rounded-xl shadow-md w-full text-gray-800 mb-4">
                    <table className="table w-full border border-white border-collapse">
                        <tbody>
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

                {/* 問題一覧 */}
                <div className="bg-white p-3 rounded-xl shadow-md w-full text-gray-800 overflow-x-auto mb-4">
                    <table className="table table-zebra w-full border border-gray-300 border-collapse text-gray-700 text-[15px]">
                        <thead className="bg-gray-800 text-gray-300">
                            <tr>
                                <th className="text-center w-12 py-2">No</th>
                                <th className="text-center py-2">問題文</th>
                                <th className="text-center py-2">解説</th>
                                <th className="text-center w-16 py-2">正解</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 1行目 */}
                            <tr>
                                <td className="text-center align-middle">1</td>
                                <td className="whitespace-pre-wrap align-top" style={{ minWidth: '250px' }}>
                                    2021年度の個人情報の取扱いに関する事故の傾向より、「最もに多い事故は「誤送付」である。
                                </td>
                                <td className="whitespace-pre-wrap align-top">{/* 空 */}</td>
                                <td className="text-center align-middle">Yes</td>
                            </tr>

                            {/* 2行目 */}
                            <tr>
                                <td className="text-center align-middle">2</td>
                                <td className="whitespace-pre-wrap align-top">
                                    Emotetとは、攻撃者が送り込んだ悪意のコードを、どのように配送したか特定する多くの社員一クライアントに存在する社員
                                </td>
                                <td className="whitespace-pre-wrap align-top">
                                    Emotetとは、メールアカウントやメールデータなどの情報窃取に加え、更に他のウィルスの侵入の足掛かりのために悪用されるマルウェアである。
                                </td>
                                <td className="text-center align-middle">No</td>
                            </tr>

                            {/* 3行目 */}
                            <tr>
                                <td className="text-center align-middle">3</td>
                                <td className="whitespace-pre-wrap align-top" style={{ minWidth: '250px' }}>
                                    ECサイトの決済処理にて、決済代行会社を利用して、自社のシステム内でクレジットカード情報を保持し続けることはPCI DSS準拠に反する。
                                </td>
                                <td className="whitespace-pre-wrap align-top" style={{ minWidth: '250px' }}>
                                    クレジットカード情報を保持しないようにしても、サイトの脆弱性をつかれてクレジットカード情報を盗み出されるケースはある。
                                </td>
                                <td className="text-center align-middle">No</td>
                            </tr>

                            {/* 4行目 */}
                            <tr>
                                <td className="text-center align-middle">4</td>
                                <td className="whitespace-pre-wrap align-top" style={{ minWidth: '250px' }}>
                                    社員Aの顧客を装う人物から、社員Aの安否確認のため、社員Aと連絡が取りたいとの問い合わせがあったとしても、社員Aの個人情報は安易に提供してはならない。
                                </td>
                                <td className="whitespace-pre-wrap align-top" style={{ minWidth: '250px' }}>
                                    正しい対応である。
                                </td>
                                <td className="text-center align-middle">Yes</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* ファイル操作と登録ボタン */}
                <div className="w-full max-w-5xl mx-auto mb-4">
                    <div className="grid grid-cols-[3fr_1fr_1fr] gap-4 items-start">

                        {/* ファイル選択 */}
                        <div className="flex border border-gray-400 rounded overflow-hidden h-10">
                            <input
                                type="file"
                                className="file-input file-input-bordered file-input-sm w-full rounded-none border-none focus:outline-none"
                                style={{ height: '100%' }}
                            />
                            <button className="btn btn-sm btn-outline btn-secondary h-full">
                                参 照
                            </button>
                        </div>

                        {/* インポート */}
                        <button className="btn btn-sm btn-secondary w-full h-10">インポート</button>

                        {/* エクスポート + 登録 */}
                        <div className="flex flex-col items-stretch gap-4 w-full">
                            <button className="btn btn-sm btn-secondary w-full h-10">エクスポート</button>
                            <button className="btn btn-primary w-full h-10">登 録</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}