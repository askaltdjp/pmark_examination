import EditForm from "@/components/employee/edit/EditForm";
import { withRedirectErrorHandler } from "@/lib/utils/withRedirectErrorHandler";
import { editService } from "@/services/web/employee/editService";

/**
 * 社員管理 > 社員変更画面のサーバコンポーネント
 */
export default async function EditPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const tEmployee = await withRedirectErrorHandler(async () => {
        // クエリパラメータを取得
        const params = await searchParams;

        // クエリパラメータから試験IDを取得
        const employeeId = Number(params.employeeId);

        // 社員情報取得
        return await editService(employeeId);
    });

    return (
        <div className="flex justify-center items-start h-auto bg-base-200 pb-2">
            <div className="w-full max-w-7xl">
                {/* 見出し */}
                <h2 className="text-gray-600 text-3xl font-bold text-center mb-4">社員変更</h2>

                {/* 変更フォーム */}
                <EditForm tEmployee={tEmployee} />
            </div>
        </div>
    );
}