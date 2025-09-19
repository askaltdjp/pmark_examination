"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/auth/loginAction";

/**
 * ログインフォームのクライアントコンポーネント
 */
export default function LoginForm() {
    const router = useRouter();
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // フォーム送信時の処理
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            // ユーザ認証の実行
            await loginAction(emailAddress, password);
            // 認証成功時はホーム画面へ遷移
            router.push("/home/dashboard");
        } catch (error) {
            // エラーをコンソールに出力
            console.error("ユーザ認証エラー:", error);
            // ユーザにエラーメッセージを表示
            setErrorMessage("メールアドレスまたはパスワードが間違っています。");
        }
    };

    return (
        <form className="card w-full max-w-md bg-white shadow-md rounded-lg p-6" onSubmit={handleFormSubmit}>
            <input
                type="email"
                value={emailAddress}
                maxLength={256}
                onChange={e => setEmailAddress(e.target.value)}
                placeholder="メールアドレス"
                required
                className="input input-bordered w-full mb-4 placeholder-gray-500 text-black"
            />

            <input
                type="password"
                value={password}
                maxLength={64}
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