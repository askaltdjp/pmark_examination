import { Prisma, TEmployee } from ".prisma/client_transaction";
import { transactionPrisma } from "@/lib/prisma/transactionPrisma";
import { currentJST } from "@/lib/utils/timeUtils";

/**
 * TEmployeeモデルのデータ操作を行うリポジトリクラス
 */
export class TEmployeeRepository {
    /**
     * idをキーにTEmployeeレコードを検索する
     * @param id - 検索するID
     * @returns 見つかったTEmployeeオブジェクト、なければnull
     */
    static async findById(id: number): Promise<TEmployee | null> {
        return transactionPrisma.tEmployee.findFirst({
            where: {
                id,
                deleteAt: null,
            }
        });
    }

    /**
     * employeeNoをキーにTEmployeeレコードを検索する
     * @param employeeNo - 検索するemployeeNo
     * @returns 見つかったTEmployeeオブジェクトの配列
     */
    static async findByEmployeeNo(employeeNo: string): Promise<TEmployee[]> {
        return transactionPrisma.tEmployee.findMany({
            where: {
                employeeNo,
                deleteAt: null,
            }
        });
    }

    /**
     * emailAddressをキーにTEmployeeレコードを検索する
     * @param emailAddress - 検索するemailAddress
     * @returns 見つかったTEmployeeオブジェクトの配列
     */
    static async findByEmailAddress(emailAddress: string): Promise<TEmployee[]> {
        return transactionPrisma.tEmployee.findMany({
            where: {
                emailAddress,
                deleteAt: null,
            }
        });
    }

    /**
     * t_employee テーブルの全レコードを取得する
     * 
     * @param includeDeleted 退職社員（delete_at が NOT NULL）も含めるかどうか（デフォルト: false）
     * @returns TEmployee のレコード配列
     */
    static async findAll(includeDeleted: boolean = false): Promise<TEmployee[]> {
        return await transactionPrisma.tEmployee.findMany({
            where: includeDeleted ? undefined : {
                deleteAt: null,
            },
        });
    }

    /**
     * 新しいTEmployeeレコードを追加する（トランザクション内で実行）
     * @param employeeNo - 社員No
     * @param name - 名前
     * @param emailAddress - メールアドレス
     * @param password - パスワード
     * @param joinDate - 入社日
     * @param tx - トランザクションオブジェクト
     * @returns 作成したTEmployeeレコード
     */
    static async insert(
        employeeNo: string,
        name: string,
        emailAddress: string,
        password: string,
        joinDate: Date,
        tx: Prisma.TransactionClient,
    ): Promise<TEmployee> {
        const now = currentJST();

        return await tx.tEmployee.create({
            data: {
                employeeNo,
                name,
                emailAddress,
                password,
                joinDate,
                createAt: now,
                updateAt: now,
                deleteAt: null,
            },
        });
    }

    /**
     * 指定された id に一致する TEmployee レコードを論理削除する
     * 
     * @param id - 論理削除対象の id
     * @param tx - トランザクションオブジェクト
     */
    static async deleteById(id: number, tx: Prisma.TransactionClient): Promise<void> {
        const now = currentJST();

        await tx.tEmployee.update({
            where: {
                id,
            },
            data: {
                deleteAt: now,
                updateAt: now,
            },
        });
    }
}