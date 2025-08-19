import { TEmployee } from '.prisma/client_transaction';
import { TEmployeeRepository } from '@/lib/repositories/transaction/tEmployeeRepository';
import { EMPLOYEE_ID_HEADER } from '@/lib/constants/system';

/**
 * リクエストヘッダから従業員情報を取得する
 * @param headers - リクエストのヘッダ情報
 * @returns 従業員情報を含むTEmployeeオブジェクト
 * @throws Error - 従業員情報が取得できなかった場合にエラーを投げる
 */
export async function getEmployeeFromRequest(headers: Headers): Promise<TEmployee> {

    // カスタムヘッダから従業員IDを取得
    const employeeId = Number(headers.get(EMPLOYEE_ID_HEADER));

    // 従業員IDを元にDBから従業員情報を取得
    const tEmployee = await TEmployeeRepository.findById(employeeId);

    // 従業員情報が取得できなければエラー
    if (!tEmployee) {
        throw new Error('従業員情報が取得できません');
    }

    return tEmployee;
}