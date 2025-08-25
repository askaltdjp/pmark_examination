import LoginForm from "@/components/auth/login/LoginForm";

/**
 * ログイン画面のサーバコンポーネント
 */
export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 px-4">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8">
                Web試験システム
            </h1>

            {/* ログインフォーム */}
            <LoginForm />

            <p className="mt-8 text-sm text-gray-400">
                © Aska Co.,Ltd All Rights Reserved.
            </p>
        </div>
    );
}