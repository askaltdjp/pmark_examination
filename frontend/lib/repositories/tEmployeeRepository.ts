import { TEmployee } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * TEmployeeモデルのデータ操作を行うリポジトリクラス
 */
export class TEmployeeRepository {
    /**
     * idをキーにTEmployeeレコードを検索する
     * @param id - 検索するID
     * @returns 見つかったTEmployeeオブジェクト、なければnull
     */
    async findById(id: number): Promise<TEmployee | null> {
        return prisma.tEmployee.findUnique({ where: { id } });
    }

    /**
     * emailAddressをキーにTEmployeeレコードを検索する
     * @param emailAddress - 検索するメールアドレス
     * @returns 見つかったTEmployeeオブジェクト、なければnull
     */
    async findByEmail(emailAddress: string): Promise<TEmployee | null> {
        return prisma.tEmployee.findFirst({ where: { emailAddress } });
    }
}