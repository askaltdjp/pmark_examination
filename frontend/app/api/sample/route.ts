import { transactionPrisma } from '@/lib/prisma/transactionPrisma';
import { NextResponse } from 'next/server';
import { currentJST } from '@/lib/utils/timeUtils';

export async function GET(): Promise<NextResponse> {
    const randomId = Math.floor(Math.random() * 1000);
    const now = currentJST();

    // 従業員を作成
    await transactionPrisma.tEmployee.create({
        data: {
            employeeNo: `EMP${randomId}`,
            name: `Employee ${randomId}`,
            emailAddress: `employee${randomId}@example.com`,
            password: 'securepassword',
            joinDate: now,
            createAt: now,
            updateAt: now,
        },
    });

    // 全従業員を取得
    const employees = await transactionPrisma.tEmployee.findMany();

    return NextResponse.json(employees);
}
