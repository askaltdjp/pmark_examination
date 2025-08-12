import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(): Promise<NextResponse> {
    const randomId = Math.floor(Math.random() * 1000);
    const now = new Date();

    // 従業員を作成
    await prisma.tEmployee.create({
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
    const employees = await prisma.tEmployee.findMany();

    return NextResponse.json(employees);
}
