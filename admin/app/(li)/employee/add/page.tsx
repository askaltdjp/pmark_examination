import EmployeeAddForm from "@/components/employee/add/EmployeeAddForm";

/**
 * 社員管理 > 社員登録画面のサーバコンポーネント
 */
export default async function AddPage() {
    return (
        <div className="flex justify-center items-start h-auto bg-base-200 pb-2">
            <div className="w-full max-w-7xl">
                {/* 見出し */}
                <h2 className="text-gray-600 text-3xl font-bold text-center mb-4">試験登録</h2>

                {/* 社員情報登録フォーム */}
                <EmployeeAddForm />
            </div>
        </div>
    );
}