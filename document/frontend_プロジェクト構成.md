# 📁 frontend プロジェクト構成

## 📌 ディレクトリ構成（概要）

```
/app
├── (li)                                        // 認証後画面のサーバコンポーネント
│   ├── exam
│   │   ├── result
│   │   │   └── page.tsx                        // 試験結果画面
│   │   └── take
│   │       └── page.tsx                        // 試験画面（問題表示・解答 UI）
│   ├── home
│   │   └── dashboard
│   │       └── page.tsx                        // ホーム画面
│   └── layout.tsx                              // 認証後画面用のレイアウトファイル
├── (lo)                                        // 認証前画面のサーバコンポーネント
│   ├── auth
│   │   └── login
│   │       └── page.tsx                        // ログイン画面
│   └── layout.tsx                              // 認証前画面用のレイアウトファイル
├── actions                                     // サーバアクション
│   ├── auth
│   │   ├── loginAction.ts                      // 認証サーバアクション（ログイン処理）
│   │   └── logoutAction.ts                     // 認証サーバアクション（ログアウト処理）
│   └── exam
│       ├── saveAction.ts                       // 試験解答結果保存サーバアクション
│       └── startAction.ts                      // 試験開始サーバアクション
├── api                                         // API ルート
│   └── exam
│       └── download
│           └── route.ts                        // 試験結果 Excel ダウンロード API

├── middleware.ts                               // ミドルウェア（/lib/middleware/* を呼び出す）

/components                                     // クライアントコンポーネント群（UI パーツ）
├── auth
│   └── login
│       └── LoginForm.tsx                       // ログインフォーム
├── common                                      // 共通コンポーネント
│   └── Header.tsx                              // 認証後画面の共通ヘッダー（ログアウトボタンあり）
├── exam
│   ├── result
│   │   └── HomeButton.tsx                      // ホームへボタン
│   └── take
│       └── ExamNavigator.tsx                   // 試験問題表示・解答 UI
├── home
│   └── dashboard
│       ├── ConfirmButton.tsx                   // 確認ボタン
│       └── StartExamButton.tsx                 // 試験開始ボタン

/services                                       // サービス層（ビジネスロジック）
├── actions                                     // サーバアクションで使用するサービス層
│   ├── auth
│   │   └── loginService.ts                     // 認証サーバアクション（ログイン処理）用サービス
│   └── exam
│       ├── saveService.ts                      // 試験解答結果保存サーバアクション用サービス
│       └── startService.ts                     // 試験開始サーバアクション用サービス
├── api                                         // API ルートで使用するサービス層
│   └── exam
│       └── downloadService.ts                  // 試験結果 Excel ダウンロード API 用サービス
├── web                                         // サーバコンポーネントで使用するサービス層
│   ├── exam
│   │   └── resultService.ts                    // 試験結果画面用サービス
│   └── home
│       └── dashboardService.ts                 // ホーム画面用サービス

/lib                                            // 共通機能
├── definitions                                 // 定数・型定義などの共通定義群
│   ├── labels.ts                               // ラベルや表示文言などの定数定義
│   ├── system.ts                               // システム共通の定数（Cookie名、制限値など）
│   └── types.ts                                // アプリケーション全体で使用される型定義
├── middleware　　　　　　　　　　　         　 　// 認証ミドルウェア関連の共通関数群
│   ├── apiAuthMiddleware.ts                    // API 用の認証ミドルウェア
│   └── authMiddleware.ts                       // 画面（サーバコンポーネント）用の認証ミドルウェア
├── prisma                                      // Prisma クライアント初期化
│   ├── masterPrisma.ts                         // pme_master 用 Prisma クライアント
│   └── transactionPrisma.ts                    // pme_transaction 用 Prisma クライアント
├── repositories                                // DB テーブル単位のリポジトリ層（DB アクセスの集約）
│   ├── master                                  // pme_master に属するテーブルのリポジトリ
│   │   ├── mTestQuestionRepository.ts          // m_test_question を操作するリポジトリ
│   │   └── mTestRepository.ts                  // m_test を操作するリポジトリ
│   └── transaction                             // pme_transaction に属するテーブルのリポジトリ
│       ├── tEmployeeRepository.ts              // t_employee テーブルを操作するリポジトリ
│       ├── tTestAnswerRepository.ts            // t_test_answer テーブルを操作するリポジトリ
│       └── tTestRepository.ts                  // t_test テーブルを操作するリポジトリ
├── utils                                       // アプリ全体の共通ユーティリティ群（ロジックは薄く再利用前提）
│   ├── authUtils.ts                            // JWT の生成・検証など認証関連処理
│   ├── employeeUtils.ts                        // 社員情報取得や認証チェック用のユーティリティ
│   ├── timeUtils.ts                            // 日付/時間関連のユーティリティ関数（例：フォーマット変換）
│   ├── withApiErrorHandler.ts                  // API ルート専用の共通エラーハンドリングラッパー
│   └── withRedirectErrorHandler.ts             // サーバコンポーネント専用の共通エラーハンドリングラッパー

/templates                                      // xlsx のテンプレートをまとめる
└── [試験名]_受験結果_([氏名])_[yyyymmdd].xlsx    // 試験結果 Excel のテンプレートファイル
```
## ✅ 構成ルール

### サーバコンポーネント
- 各画面に対して、1つの `page.tsx` を作成する。
- 認証前の画面は `app/(lo)`、認証後の画面は `app/(li)` に配置する。
- クライアント側の挙動が必要な UI は、クライアントコンポーネントに分離する。
- 業務ロジックはすべてサービス層に切り出して実装する。

### クライアントコンポーネント
- `components` 配下に作成し、呼び出すサーバコンポーネントと同じ構成階層にする。
- データの更新など、サーバ通信が必要な処理は **原則サーバアクション** を利用。
- サーバアクションで対応が難しい場合は、**API ルート** を利用する。

### サーバアクション
- DB 更新処理など、クライアントコンポーネントから呼び出す処理はサーバアクションで実装。
- `app/actions` 以下に作成し、**ファイル名・関数名の末尾に `Action` を付ける。**
- 業務ロジックはサービス層に切り出す。

### API ルート
- ファイルダウンロードなど、サーバアクションでは対応が難しい処理に使用する。
- `app/api` 以下に配置。
- 業務ロジックはサービス層に切り出す。

### サービス層
- 各層ごとに `services` 以下を次のように分割：
  - `services/actions`：サーバアクション用
  - `services/api`：API ルート用
  - `services/web`：サーバコンポーネント用
- **ファイル名（関数名）の末尾に `Service` を付ける。**
- DB のトランザクション処理は必ずサービス層で実装する。
- **サービス層間での依存（呼び出し）は禁止。**

### リポジトリ層
- 各 DB テーブルごとに 1 ファイル作成。
- **ファイル名・クラス名の末尾に Repository を付ける。**
- 状態を持たず、**全てのメソッドを `static` にする。**
- DB 操作は必ずリポジトリ経由で行い、Prisma Client を直接使用しない。