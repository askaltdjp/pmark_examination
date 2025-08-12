import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(): Promise<NextResponse> {
  // ランダムな番号で一意な従業員番号とメールアドレスを生成
  const randomId = Math.floor(Math.random() * 1000);

  // 従業員を作成
  await prisma.tEmployee.create({
    data: {
      employeeNo: `EMP${randomId}`,
      name: `Employee ${randomId}`,
      emailAddress: `employee${randomId}@example.com`,
      password: 'securepassword',
      joinDate: new Date(),
    },
  });

  // 全従業員を取得
  const employees = await prisma.tEmployee.findMany();

  return NextResponse.json(employees);
}
