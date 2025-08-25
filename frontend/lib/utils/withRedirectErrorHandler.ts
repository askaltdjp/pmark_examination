import { redirect } from "next/navigation";

/**
 * 任意の非同期関数を実行し、エラーが発生した場合に指定されたパスへリダイレクトするラッパー
 *
 * @param fn - 実行したい非同期関数
 * @param redirectPath - エラー時にリダイレクトするパス（デフォルトは /auth/login）
 * @returns 非同期関数の戻り値（正常時）／リダイレクトが実行される（エラー時）
 */
export async function withRedirectErrorHandler<T>(
    fn: () => Promise<T>,
    redirectPath: string = "/auth/login"
): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        console.error("Error in service:", error);
        redirect(redirectPath);
    }
}
