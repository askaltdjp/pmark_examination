import React from 'react';
import HomeButton from '@/components/exam/result/HomeButton';

/**
 * 試験結果画面のサーバコンポーネント
 */
export default function ResultPage() {
    return (
        <div className="px-6">
            <div className="max-w-6xl mx-auto">
                {/* 見出し */}
                <div className="mb-6">
                    <div className="bg-base-300 text-gray-800 text-4xl font-bold py-4 text-center rounded-lg shadow-md">
                        試験結果
                    </div>
                </div>

                {/* 合否表示 */}
                <div className="flex justify-center mb-6">
                    <div className="bg-success text-white text-lg font-semibold py-4 px-10 rounded-md shadow">
                        【合格】正解率： 95%
                    </div>
                </div>

                {/* 結果テーブル */}
                <div className="p-3 bg-white shadow rounded">
                    <div className="overflow-x-auto max-h-[500px]">
                        <table className="table table-pin-rows table-pin-cols">
                            <thead>
                                <tr className="text-center text-gray-600">
                                    <th>No</th>
                                    <th colSpan={2}>問題 / 解説</th>
                                    <th>解答</th>
                                    <th>正解</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 10 }, (_, i) => (
                                    <tr key={i} className={`text-gray-600 ${i % 2 === 0 ? 'bg-base-100' : 'bg-base-200'}`}>
                                        <td className="text-center">{i + 1}</td>
                                        <td className="text-center">問<br />題</td>
                                        <td>2021年度の個人情報の取扱いに関する事故の傾向より、1番に多い事故は「誤送付」である。</td>
                                        <td className="text-center">{i % 2 === 0 ? 'Yes' : 'No'}</td>
                                        <td className="text-center">〇</td>
                                    </tr>
                                ))}
                                {Array.from({ length: 10 }, (_, i) => (
                                    <React.Fragment key={i + 100}>
                                        <tr key={i + 100} className={`text-gray-600 ${i % 2 === 0 ? 'bg-base-100' : 'bg-base-200'}`}>
                                            <td rowSpan={2} className="text-center">{i + 11}</td>
                                            <td className="text-center">問<br />題</td>
                                            <td>Emotetとは、攻撃者が送り込んだ悪意のコードを、そのページを閲覧した不特定多数の社員ーに、スクリプトとして実行させることである。</td>
                                            <td rowSpan={2} className="text-center">{i % 2 === 0 ? 'Yes' : 'No'}</td>
                                            <td rowSpan={2} className="text-center">×</td>
                                        </tr>
                                        <tr key={i + 200} className={`text-gray-600 ${i % 2 === 0 ? 'bg-base-100' : 'bg-base-200'}`}>
                                            <td className="text-center">解<br />答</td>
                                            <td>クレジットカード情報を保持しないようにしても、サイトの脆弱性をつかれてクレジットカード情報を盗み出されるケースはある。そのため定期的にサイトの脆弱診断等、不正アクセス対策を行い続ける必要がある。</td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ホームへボタン */}
                <HomeButton />

            </div>
        </div>
    );
}