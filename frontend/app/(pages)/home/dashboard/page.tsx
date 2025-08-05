import { redirect } from "next/navigation";
import { getAuthEmployee } from "@/lib/auth/getAuthEmployee";

/**
 * ホーム画面のサーバコンポーネント
 */
export default async function DashBoardPage() {
    // 認証済み従業員を取得
    const tEmployee = await getAuthEmployee();

    // 従業員が存在しない（未ログインなど）の場合はログインページへリダイレクト
    if (!tEmployee) {
        redirect("/auth/login");
    }

    return (
        <p>ホーム画面</p>
    );
}