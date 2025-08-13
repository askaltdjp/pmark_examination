"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ログインフォームのクライアントコンポーネント
export default function LoginForm() {
    const router = useRouter();

    // 入力されたメールアドレスとパスワードの状態を管理
    const [emailAddress, setAddressEmail] = useState("");
    const [password, setPassword] = useState("");

    // エラーメッセージの状態を管理
    const [errorMessage, setErrorMessage] = useState("");

    // フォーム送信時の処理
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        // 認証APIにPOSTリクエストを送信
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emailAddress, password }),
        });

        // 認証成功時はダッシュボードへ遷移
        if (res.ok) {
            router.push("/home/dashboard");
        } else {
            // 認証失敗時はエラーメッセージを表示
            setErrorMessage("メールアドレスまたはパスワードが間違っています。");
        }
    };

    return (
        <form className="card w-full max-w-md bg-white shadow-md rounded-lg p-6" onSubmit={handleFormSubmit}>
            <input
                type="email"
                value={emailAddress}
                onChange={e => setAddressEmail(e.target.value)}
                placeholder="メールアドレス"
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