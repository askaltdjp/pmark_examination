import { transactionPrisma } from '@/lib/prisma/transactionPrisma';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  // ランダムな番号で一意な従業員番号とメールアドレスを生成
  const randomId = Math.floor(Math.random() * 1000);

  // 従業員を作成
  await transactionPrisma.tEmployee.create({
    data: {
      employeeNo: `EMP${randomId}`,
      name: `Employee ${randomId}`,
      emailAddress: `employee${randomId}@example.com`,
      password: 'securepassword',
      joinDate: new Date(),
    },
  });

  // 全従業員を取得
  const employees = await transactionPrisma.tEmployee.findMany();

  return NextResponse.json(employees);
}
