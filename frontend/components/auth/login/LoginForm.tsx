"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const router = useRouter();
    const [emailAddress, setAddressEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emailAddress, password }),
        });

        if (res.ok) {
            router.push("/home/dashboard");
        } else {
            alert("ログイン失敗");
        }
    };

    return (
        <form className="card w-full max-w-sm bg-white shadow-md rounded-lg p-6" onSubmit={onSubmit}>
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

            <button
                type="submit"
                className="btn btn-primary w-full text-sm"
            >
                ログイン
            </button>
        </form>
    );
}