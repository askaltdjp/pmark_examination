import EmployeeListTable from "@/components/employee/list/EmployeeListTable";
import AddButton from "@/components/employee/list/AddButton";
import { withRedirectErrorHandler } from "@/lib/utils/withRedirectErrorHandler";
import { listService } from "@/services/web/employee/listService";

/**
 * 社員管理 > 社員一覧画面のサーバコンポーネント
 */
export default async function ListPage() {
    const { tEmployees } = await withRedirectErrorHandler(async () => {
        // 社員一覧を取得
        return await listService();
    });

    return (
        <div className="flex justify-center items-start h-auto bg-base-200 pb-2">
            <div className="w-full max-w-7xl">
                {/* 見出し */}
                <h2 className="text-gray-600 text-3xl font-bold text-center mb-4">社員一覧</h2>

                {/* 社員一覧テーブル */}
                <EmployeeListTable tEmployees={tEmployees} />

                {/* 新規登録ボタン */}
                <AddButton />
            </div>
        </div>
    );
}