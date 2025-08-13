"use client";

import { MTest } from '.prisma/client_master';
import { TTest } from '.prisma/client_transaction';
import { TestResult } from '@/lib/constants/labels';

type Props = {
    mTest: MTest | null,
    tTest: TTest | null,
};

// 試験開始ボタンのクライアントコンポーネント
export default function StartExamButton({ mTest, tTest }: Props) {
    // 実施中の試験がない、もしくは、合格済みなら受験できないためボタンは非活性
    const disabled = !mTest || tTest?.result === TestResult.Pass;
    return (
        <div className="mt-6 flex justify-center">
            <button className="btn btn-info btn-lg" disabled={disabled}>試験開始</button>
        </div>
    );
}
