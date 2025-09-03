"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/auth/loginAction";

// ログインフォームコンポーネント
export default function LoginForm() {
    const router = useRouter();

    // 入力されたログインIDとパスワードの状態を管理
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");

    // エラーメッセージの状態を管理
    const [errorMessage, setErrorMessage] = useState("");

    // フォーム送信時の処理
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            // ユーザ認証の実行
            await loginAction(loginId, password);
            // 認証成功時はダッシュボードへ遷移
            router.push("/exam/list");
        } catch (error) {
            // エラーをコンソールに出力
            console.error("ユーザ認証エラー:", error);
            // ユーザにエラーメッセージを表示
            setErrorMessage("ログインIDまたはパスワードが間違っています。");
        }
    };

    return (
        <form className="card w-full max-w-md bg-white shadow-md rounded-lg p-6" onSubmit={onSubmit}>
            <input
                type="text"
                value={loginId}
                onChange={e => setLoginId(e.target.value)}
                placeholder="ログインID"
                required
                className="input input-bordered w-full mb-4 placeholder-gray-500 text-black"
            />

            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="パスワード"
                required
                className="input input-bordered w-full mb-6 placeholder-gray-500 text-black"
            />

            {errorMessage && (
                <p className="text-red-500 text-sm mb-4 text-center">{errorMessage}</p>
            )}

            <button
                type="submit"
                className="btn btn-primary w-full text-sm"
            >
                ログイン
            </button>
        </form>
    );
}