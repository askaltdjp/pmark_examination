"use client";

/**
 * 問題一覧のクライアントコンポーネント
 */
export default function QuestionListTable() {
    return (
        <div className="bg-white rounded-xl shadow-md w-full text-gray-800 mb-4 p-3">
            <div className="overflow-y-auto max-h-[400px]">
                <table className="table table-zebra w-full border border-gray-300 border-separate border-spacing-0 text-gray-700 text-[15px]">
                    <thead className="bg-gray-800 text-gray-300" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                        <tr>
                            <th className="text-center w-12 py-2 bg-gray-800">No</th>
                            <th className="text-center py-2 bg-gray-800">問題文</th>
                            <th className="text-center py-2 bg-gray-800">解説</th>
                            <th className="text-center w-16 py-2 bg-gray-800">正解</th>
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
        </div>
    );
}