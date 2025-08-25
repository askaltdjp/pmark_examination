# Web試験システム - ローカル環境構築手順

## WSL の環境構築

WSL にディストリビューション (Ubuntu) をインストールする手順を説明します。

PowerShell を起動します。

### WSL にインストールされているディストリビューションの確認

```bash
PS> wsl --list --verbose
Linux 用 Windows サブシステムにインストールされているディストリビューションはありません。
この問題を解決するには、以下の手順に従ってディストリビューションをインストールしてください:

'wsl.exe --list --online' を使用して利用可能な配布を一覧表示する
および 'wsl.exe --install <Distro>' を使用してインストールしてください。
```

以下では、WSL にディストリビューションがまだインストールされていないことを前提に、環境構築を進めていきます。

### WSL で使用可能なディストリビューションの確認

```bash
PS> wsl --list --online
インストールできる有効なディストリビューションの一覧を次に示します。
'wsl.exe --install <Distro>' を使用してインストールします。

NAME                            FRIENDLY NAME
AlmaLinux-8                     AlmaLinux OS 8
AlmaLinux-9                     AlmaLinux OS 9
AlmaLinux-Kitten-10             AlmaLinux OS Kitten 10
AlmaLinux-10                    AlmaLinux OS 10
Debian                          Debian GNU/Linux
FedoraLinux-42                  Fedora Linux 42
SUSE-Linux-Enterprise-15-SP6    SUSE Linux Enterprise 15 SP6
SUSE-Linux-Enterprise-15-SP7    SUSE Linux Enterprise 15 SP7
Ubuntu                          Ubuntu
Ubuntu-24.04                    Ubuntu 24.04 LTS
archlinux                       Arch Linux
kali-linux                      Kali Linux Rolling
openSUSE-Tumbleweed             openSUSE Tumbleweed
openSUSE-Leap-15.6              openSUSE Leap 15.6
Ubuntu-18.04                    Ubuntu 18.04 LTS
Ubuntu-20.04                    Ubuntu 20.04 LTS
Ubuntu-22.04                    Ubuntu 22.04 LTS
OracleLinux_7_9                 Oracle Linux 7.9
OracleLinux_8_10                Oracle Linux 8.10
OracleLinux_9_5                 Oracle Linux 9.5
```

### 最新 Ubuntu (LTS) のインストール

今回は WSL で Ubuntu の最新版を使うため、一覧の中からバージョンを固定して `Ubuntu-24.04` を選択してインストールします。

```bash
PS> wsl --install -d Ubuntu-24.04
ダウンロードしています: Ubuntu 24.04 LTS
インストールしています: Ubuntu 24.04 LTS
ディストリビューションが正常にインストールされました。'wsl.exe -d Ubuntu-24.04' を使用して起動できます
Ubuntu-24.04 を起動しています...
Provisioning the new WSL instance Ubuntu-24.04
This might take a while...
Create a default Unix user account: (ユーザ名を入力)
New password: (パスワードを入力)
Retype new password: (一つ前と同じパスワードを入力)
passwd: password updated successfully
To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.
$ 
```

インストールの途中で、ユーザ名とパスワードの入力を求められるので、任意のものを設定してください。  
インストール完了後は、自動的に Ubuntu のシェルにログインした状態になります。

Ubuntu のシェルを終了して PowerShell に戻るには `exit` コマンドを、
PowerShell から Ubuntu にログインするには `wsl` コマンドを実行してください。

## Ubuntu 上で Docker を使用するための準備

Docker を使用する際、最も簡単な方法は Docker Desktop を利用することですが、状況によっては有料ライセンスが必要になる場合があります。

そのため、この懸念を避けるために、Docker Desktop を使わずに Ubuntu に直接 Docker Engine をインストールし、シェルから Docker を操作する方法について解説します。

### Ubuntu ターミナルの起動

Windows の検索ボックスに 「Ubuntu」 と入力すると、「Ubuntu-24.04」 が候補として表示されます。  
これを選択すると、Ubuntu にログインした状態でターミナルが起動します。

以降では、この Ubuntu ターミナルを使用して、ログイン後の環境で操作を行います。

### Docker リポジトリのセットアップに必要なパッケージのインストール

```bash
$ sudo apt update
...
$ sudo apt-get install ca-certificates curl gnupg lsb-release
...
```

パスワードを求められたら、Ubuntu インストール時に設定したパスワードを入力してください。

### Docker の公式 GPG 鍵の追加

```bash
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

### 安定版（stable）リポジトリのセットアップ

```bash
$ echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### Docker Engine のインストール

```bash
$ sudo apt update
...
$ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
...
```

インストール中に `Do you want to continue? [Y/n]` と表示された場合は、`Y` を入力して進めてください。

### Docker Engine のインストールの確認

```bash
$ sudo docker run hello-world
```

実行後、以下のようなメッセージが表示されれば、**Docker は正しく動作しています**：

```bash
...
Hello from Docker!
This message shows that your installation appears to be working correctly.
...
```

### sudo なしで Docker コマンドを実行する設定

現在のままだと、`docker` コマンドを実行するたびに毎回 `sudo` を付ける必要があります。  
そこで、コマンドを簡略化するために、現在のユーザを `docker` グループに追加します。

```bash
$ sudo usermod -aG docker $USER
$ exit
PS> wsl
$
```

**コマンドを実行しただけでは設定が有効になりません。**  
そのため、一度 PowerShell に戻り、その後もう一度 Ubuntu にログインしてください。  
`docker run hello-world` を `sudo` なしで実行し、`Hello from Docker!` が表示されれば、設定は正常に完了しています。

## プロジェクトの環境構築と初期ファイル準備

**この章の内容はざっと理解できれば十分です。**  
**実際の操作も行う必要はありません。**  
**準備ができたら 「[Git の改行コード設定](#git_crlf)」 へ進んでください。**

Docker に関する環境構成ファイルと、アプリケーションのソースコードを分けて管理することで、以下のようなメリットがあります。

- 相互に依存しないため、保守や共有がしやすい
- 別々のリポジトリで管理できる
- 同じ Docker 環境構成を使いまわして、別のアプリを入れ替えて実行できる
- `.env` ファイルなどの機密情報を含むファイルを分離して管理しやすい

実際の開発現場でも、こうした分離をすることがあります。  
そのため、本プロジェクトでも以下のようなディレクトリ構成を採用します。

### プロジェクトの構成

```
pmark_examination/               # プロジェクトのルートディレクトリ
│
├── admin                        # 管理画面用アプリケーション
│   ├── README.md                # アプリの説明書
│   ├── app                      # Next.jsのアプリケーションコード（appディレクトリ）
│   ├── jsconfig.json            # JavaScript/TypeScript設定ファイル
│   ├── next.config.mjs          # Next.jsの設定ファイル
│   ├── node_modules             # 依存パッケージ（Git管理外）
│   ├── package-lock.json        # 依存パッケージの固定バージョン情報
│   ├── package.json             # npmのパッケージ管理ファイル
│   ├── public                   # 静的ファイル（画像やフォントなど）
│   └── .gitignore               # Git管理除外設定ファイル
│
├── frontend                     # フロントエンド用アプリケーション
│   ├── README.md                # アプリの説明書
│   ├── app                      # Next.jsのアプリケーションコード
│   ├── jsconfig.json            # JavaScript/TypeScript設定ファイル
│   ├── next.config.mjs          # Next.jsの設定ファイル
│   ├── node_modules             # 依存パッケージ（Git管理外）
│   ├── package-lock.json        # 依存パッケージのバージョン管理
│   ├── package.json             # npmパッケージ管理ファイル
│   ├── public                   # 静的ファイル群
│   └── .gitignore               # Git管理除外設定ファイル
│
├── shared_prisma                # Prisma関連ファイルを共有する場所
│   ├── master                   # 「pme_master」データベース用のPrisma設定フォルダ
│   │   ├── migrations　　　　　　# masterDB用のマイグレーションファイル群（スキーマ変更履歴）
│   │   └── schema.prisma        # masterDB用のPrismaスキーマファイル（DBモデル定義）
│   └── transaction              # 「pme_transaction」データベース用のPrisma設定フォルダ
│       ├── migrations           # transactionDB用のマイグレーションファイル群（スキーマ変更履歴）
│       └── schema.prisma        # transactionDB用のPrismaスキーマファイル（DBモデル定義）
│
├── docker                       # Docker関連の設定や構成ファイルを格納
│   ├── compose.yaml             # Docker Composeの設定ファイル
│   ├── mysql                    # MySQL関連のDocker設定用ディレクトリ
│   │   ├── Dockerfile           # MySQL用のDockerfile
│   │   ├── init.sql             # コンテナ起動時に実行される初期化SQLスクリプト
│   │   └── my.cnf               # MySQLサーバの設定ファイル（カスタム設定）
│   └── node                     # Node.js関連のDocker設定用ディレクトリ
│       └── Dockerfile           # Node.jsアプリ用のDockerfile
│
└── document                     # ドキュメント用フォルダ
```

通常、Next.js のプロジェクト内に Prisma のスキーマ定義やマイグレーションファイルを配置しますが、その場合、`admin` や `frontend` それぞれに同じファイルを持つことになり、管理や保守が煩雑になりがちです。  
そこで本プロジェクトでは、Prisma 関連のファイルを専用の `shared_prisma` ディレクトリにまとめ、`admin` と `frontend` 両方のアプリケーションから共有できるようにしています。

また、今回は `admin` および `frontend` を含む全体を 1 つのリポジトリで管理する方針（モノレポ構成）を採用しています。  
小〜中規模開発においてはこの構成で特段問題はありませんが、将来的に本番環境での運用やプロジェクトの大規模化が見込まれる場合には、各アプリケーション単位でリポジトリを分離することが望ましい運用方針とされているので注意が必要です。

以下では、各ファイルの作成方法や役割についても解説していきます。

### docker/compose.yaml

```yaml
services:
  frontend:
    build:
      context: ..
      dockerfile: docker/node/Dockerfile
    ports:
      - "3001:3000"
    volumes:
      - ../frontend:/usr/src/app
      - ../shared_prisma:/usr/src/app/prisma
    working_dir: /usr/src/app
    command: /bin/sh -c "npm install && npm run dev"
    environment:
      - NODE_ENV=development
    depends_on:
      - mysql

  admin:
    build:
      context: ..
      dockerfile: docker/node/Dockerfile
    ports:
      - "3002:3000"
    volumes:
      - ../admin:/usr/src/app
      - ../shared_prisma:/usr/src/app/prisma
    working_dir: /usr/src/app
    command: /bin/sh -c "npm install && npm run dev"
    environment:
      - NODE_ENV=development
    depends_on:
      - mysql

  mysql:
    build:
      context: ..
      dockerfile: docker/mysql/Dockerfile
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - TZ=Asia/Tokyo
    volumes:
      - ./mysql/my.cnf:/etc/mysql/conf.d/my.cnf
      - ./mysql/init.sql:/docker-entrypoint-initdb.d/init.sql
      - mysql_data:/var/lib/mysql
    restart: always

volumes:
  mysql_data:
```

この `compose.yaml` の構成は、Next.js で作られた 2 つのアプリケーション（`frontend`, `admin`）と、`MySQL` を Docker で一括管理する構成になっています。

#### `build` に関する説明

`build.context` は Docker ビルド時の作業ディレクトリ（コンテキスト）で、この中のファイルだけがビルド対象になります。  
`build.dockerfile` は使用する Dockerfile のパスを指定しますが、**必ず `build.context` 以下のパスである必要があります。**  
この例では、ルートディレクトリ（`..`）をコンテキストとし、その中の `docker/node/Dockerfile` を使用しています。

#### `command` に関する説明

`frontend` と `admin` のコンテナ起動時に、`npm install && npm run dev` のコマンドを実行しています。  
GitHub クローンした直後は `node_modules` がないため、起動時に `npm install` を自動的に行い、依存パッケージをインストールします。  
その後、`npm run dev` を実行することで、すぐに `frontend` と `admin` の開発サーバーが立ち上がり、画面や API の確認が可能になります。

### docker/node/Dockerfile

```
FROM node:24.4.1-alpine3.21

RUN apk add --no-cache \
    tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    apk del tzdata
```

この Dockerfile は、Node.js（バージョン 24.4.1）をベースにした軽量な Alpine Linux 環境を構築しています。

- タイムゾーン設定のために一時的に `tzdata` パッケージを追加し、`Asia/Tokyo` のタイムゾーン情報をシステムにコピーして設定を反映。  
- その後、イメージサイズを軽くするために `tzdata` は削除しています。

### docker/mysql/Dockerfile

```
FROM mysql:8.4.6
```

この Dockerfile は、`mysql:8.4.6` という既存の公式イメージをそのまま使うだけの内容です。  
新たに環境を構築せず、ベースイメージをそのまま利用してコンテナを起動します。

### docker/mysql/init.sql

```sql
-- データベース作成（バイナリ照合順：大文字小文字・全角半角を完全に区別）
CREATE DATABASE IF NOT EXISTS pme_master CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
CREATE DATABASE IF NOT EXISTS pme_transaction CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

-- アプリケーション操作用ユーザの作成（すでに存在していなければ）
CREATE USER IF NOT EXISTS 'pme_user'@'%' IDENTIFIED WITH mysql_native_password BY 'pmepassword';

-- すべてのデータベースに対してすべての操作権限を付与（CREATE, DROP, SELECT, INSERT, UPDATE, DELETE など含む）
GRANT ALL PRIVILEGES ON *.* TO 'pme_user'@'%';

-- 権限の変更を即時反映
FLUSH PRIVILEGES;
```

このスクリプトは、MySQL 8 のコンテナ初回起動時に自動的に実行され、データベースの作成とユーザ設定を行います。

まず、`pme_master` と `pme_transaction` の2つのデータベースを作成しています。  
文字コードは `utf8mb4` を使用し、照合順序に `utf8mb4_bin` を指定することで、大文字小文字や全角半角の違いを完全に区別するようにしています。  
これにより、文字の微細な違いも正確に判別されるようになります。

次に、`pme_user` というアプリケーション用ユーザを作成しています。  
`@'%'` は任意のホストからの接続を許可する設定で、認証には `mysql_native_password` を使用しています。  
パスワードは `'pmepassword'` に設定されています。

このユーザには、すべてのデータベースとテーブルに対する全権限（読み書き、作成、削除など）を与えています。

最後に `FLUSH PRIVILEGES` を実行することで、ユーザや権限に関する変更がすぐに有効になります。

このスクリプトは、MySQLの初回起動時に `/docker-entrypoint-initdb.d/` ディレクトリに配置されていることで、自動的に一度だけ実行されます。

### docker/mysql/my.cnf

```ini
[mysqld]
mysql_native_password=on
```

この設定は、MySQL 8 で以下のエラーが出る場合の対策です：

```
ERROR 1524 (HY000): Plugin 'mysql_native_password' is not loaded
```

MySQL 8 では、デフォルトで `caching_sha2_password` 認証プラグインが有効になっており、`mysql_native_password` プラグインはロードされていないことがあります。  
この状態で以下のようなSQLを実行しようとすると、上記のエラーが発生します。

```sql
CREATE USER 'user'@'%' IDENTIFIED WITH mysql_native_password BY 'password';
```

そのため、`my.cnf` の `[mysqld]` セクションに `mysql_native_password=on` を追加しておくことで、MySQL の起動時に `mysql_native_password` プラグインが読み込まれ、エラーを回避できます。

この設定は認証方式そのものを変更するものではなく、「プラグインを読み込む」 ための指示です。  
認証方式を実際に使うには、`CREATE USER` 時に `IDENTIFIED WITH mysql_native_password` を明示的に指定する必要があります。

### admin/* と frontend/*

```bash
# 作業ディレクトリに移動（admin）
$ cd ~/pmark_examination/admin

# プロジェクト初期化
$ docker run --rm -it \
  -v $(pwd):/usr/src/app \
  -w /usr/src/app \
  node:24.4.1-alpine3.21 \
  sh -c "npx create-next-app@latest . && npm install @prisma/client && npm install prisma --save-dev && npx prisma init && npm install --save-dev daisyui"

# schema.prisma を shared_prisma にコピー
$ cp prisma/schema.prisma ../shared_prisma/
$ sudo rm -rf prisma/

# .env の DATABASE_URL を次のように変更
===========================================
DATABASE_URL_MASTER="mysql://pme_user:pmepassword@mysql:3306/pme_master"
DATABASE_URL_TRANSACTION="mysql://pme_user:pmepassword@mysql:3306/pme_transaction"
===========================================

# 作業ディレクトリに移動（frontend）
$ cd ~/pmark_examination/frontend

# プロジェクト初期化
$ docker run --rm -it \
  -v $(pwd):/usr/src/app \
  -w /usr/src/app \
  node:24.4.1-alpine3.21 \
  sh -c "npx create-next-app@latest . && npm install @prisma/client && npm install prisma --save-dev && npm install --save-dev daisyui"

# admin の .env を frontend にコピー
$ cp ../admin/.env .
```

まず、`admin` ディレクトリ内で Next.js の初期プロジェクトと Prisma と DaisyUI を導入しています。  
Prisma は ORM で、DaisyUI は Tailwind CSS をベースにしたコンポーネントライブラリです。

`npx prisma init` を実行すると、`admin` 内に `.env` と `prisma/schema.prisma` が作成されます。  
`.env` は機能ごとに分けて使うためそのままにしますが、`schema.prisma` はスキーマ定義ファイルで、一元管理すべきものなので共有ディレクトリの `shared_prisma` に移動しています。  
また、`.env` の初期設定は PostgreSQL 用になっているため、MySQL コンテナの `master` データベースと `transaction` データベースを参照する設定に書き換えています。

次に、`frontend` では `npx prisma init` は実行せず、代わりに `admin` の `.env` をコピーして使用しています。  
スキーマファイルは共有ディレクトリのものを参照しているため問題ありません。

`admin` と `frontend` の両方で、Next.js のインストール時に質問が聞かれますが、下記のように回答します。

| 質問内容                                                         | 回答    |
| ---------------------------------------------------------------- | ------- |
| Ok to proceed?                                                   | y       |
| Would you like to use TypeScript?                                | **Yes** |
| Would you like to use ESLint?                                    | No      |
| Would you like to use Tailwind CSS?                              | **Yes** |
| Would you like your code inside a `src/` directory?              | No      |
| Would you like to use App Router? (recommended)                  | **Yes** |
| Would you like to use Turbopack for `next dev`?                  | No      |
| Would you like to customize the import alias (`@/*` by default)? | No      |

### shared_prisma/master/schema.prisma

次のようにファイルを修正します。

```
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
  output   = "../../node_modules/.prisma/client_master"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL_MASTER")
}

model MTest {
  id          Int       @id @default(autoincrement())
  name        String?   @db.VarChar(64)
  startAt     DateTime  @map("start_at")
  endAt       DateTime  @map("end_at")
  questionNum Int       @map("question_num")
  passNum     Int       @map("pass_num")
  createAt    DateTime  @map("create_at")
  updateAt    DateTime  @map("update_at")
  deleteAt    DateTime? @map("delete_at")

   @@map("m_test")
}

model MTestQuestion {
  id         Int       @id @default(autoincrement())
  testId     Int       @map("test_id")
  questionNo Int       @map("question_no")
  question   String    @db.Text
  commentary String?   @db.Text
  correct    Boolean
  createAt   DateTime  @map("create_at")
  updateAt   DateTime  @map("update_at")
  deleteAt   DateTime? @map("delete_at")

  @@unique([testId, questionNo])
  @@map("m_test_question")
}
```

このファイルは、Prisma を使ってデータベースの構造（スキーマ）を定義するためのものです。  

- **`generator`**  
  Prisma Client を TypeScript 用に生成し、`../../node_modules/.prisma/client_master` ディレクトリに出力する設定です。  
  この設定で生成されたクライアントをそのパスから TypeScript でインポートして使えます。
- **`datasource`**  
  データベースとして MySQL を使用し、接続先は `.env` の `DATABASE_URL_MASTER` に記述します。
- **`model`**  
  データベースのテーブルを表現するもので、各フィールドがテーブルのカラムに対応します。  
  リレーションや制約を指定して、データベース構造をコードで定義します。

MySQL に複数のデータベースがあるため、それぞれに対応する `master` 用と `transaction` 用の2つの `schema.prisma` ファイルを用意し、個別に管理しています。

### shared_prisma/transaction/schema.prisma

```
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
  output   = "../../node_modules/.prisma/client_transaction"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL_TRANSACTION")
}

model TEmployee {
  id           Int       @id @default(autoincrement())
  employeeNo   String    @map("employee_no") @db.VarChar(64)
  name         String    @db.VarChar(64)
  emailAddress String    @map("email_address") @db.VarChar(256)
  password     String    @db.VarChar(64)
  joinDate     DateTime  @map("join_date") @db.Date
  createAt     DateTime  @map("create_at")
  updateAt     DateTime  @map("update_at")
  deleteAt     DateTime? @map("delete_at")

  @@index([employeeNo])
  @@index([emailAddress])
  @@map("t_employee")
}

model TTest {
  id         Int       @id @default(autoincrement())
  employeeId Int       @map("employee_id")
  testId     Int       @map("test_id")
  testCnt    Int       @default(1) @map("test_cnt")
  correctNum Int       @map("correct_num")
  result     Int
  testAt     DateTime  @map("test_at")
  createAt   DateTime  @map("create_at")
  updateAt   DateTime  @map("update_at")
  deleteAt   DateTime? @map("delete_at")

  @@unique([employeeId, testId, testCnt])
  @@map("t_test")
}

model TTestAnswer {
  id         Int       @id @default(autoincrement())
  employeeId Int       @map("employee_id")
  testId     Int       @map("test_id")
  testCnt    Int       @default(1) @map("test_cnt")
  questionNo Int       @map("question_no")
  answer     Boolean   @default(false)
  createAt   DateTime  @map("create_at")
  updateAt   DateTime  @map("update_at")
  deleteAt   DateTime? @map("delete_at")

  @@unique([employeeId, testId, testCnt, questionNo])
  @@map("t_test_answer")
}
```

この設定は、`DATABASE_URL_TRANSACTION` の環境変数を使って、MySQLデータベース (`transaction`) に接続するデータソースを定義しています。

### admin/app/globals.css と frontend/app/globals.css

```css
@import "tailwindcss";
@plugin "daisyui";    ← 追加
･･･
```

`@plugin "daisyui";` は、Tailwind CSS のビルドプロセスに DaisyUI のプラグイン機能を追加するための記述です。

これによって、DaisyUI が提供するカスタムコンポーネントやユーティリティクラスが Tailwind のスタイルに組み込まれ、簡単に DaisyUI のデザインを使えるようになります。

### admin/app/sample/page.tsx と frontend/app/sample/page.tsx

```js
export default function SamplePage() {
    return (
        <main className="p-8">
            <h1 className="text-4xl font-bold mb-6">DaisyUI + Next.js サーバーコンポーネント例</h1>

            <button className="btn btn-primary mr-4">プライマリーボタン</button>
            <button className="btn btn-secondary">セカンダリーボタン</button>

            <div className="alert alert-info mt-8">
                <span>これは DaisyUI のアラートコンポーネントです。</span>
            </div>
        </main>
    );
}
```

こちらは DaisyUI のスタイルを適用した Next.js のサーバコンポーネントの例で、ボタンやアラートといった UI 要素を表示しています。

### admin/app/api/sample/route.ts と frontend/app/api/sample/route.ts

```js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(): Promise<NextResponse> {
    const randomId = Math.floor(Math.random() * 1000);
    const now = new Date(); // TODO: UTC+9時間する必要がある

    // 従業員を作成
    await prisma.tEmployee.create({
        data: {
            employeeNo: `EMP${randomId}`,
            name: `Employee ${randomId}`,
            emailAddress: `employee${randomId}@example.com`,
            password: 'securepassword',
            joinDate: now,
            createAt: now,
            updateAt: now,
        },
    });

    // 全従業員を取得
    const employees = await prisma.tEmployee.findMany();

    return NextResponse.json(employees);
}
```

このコードは、Prisma を用いて従業員のデータを作成し、その一覧を返す API の処理を実装しています。  
このように、Next.js の API ルートなどで使用できる、シンプルなユーザ操作の例になっています。

### Docker のビルド・起動

上記までファイルの準備、コマンド操作を行ったら、Docker イメージのビルド、および、Docker コンテナの起動を行います（コマンドについては後述）

### マイグレーションと Prisma Client の生成

Docker コンテナ起動後、schema.prisma の内容に基づきデータベースのマイグレーションと Prisma Client の生成を行います（コマンドについては後述）

#### マイグレーションファイルの修正

Prisma で生成されたテーブルの照合順序は次のようになっています。

```sql
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

`utf8mb4_unicode_ci` は、大文字小文字や全角半角の違いを区別せずに比較します。  
そのため `"A"` と `"a"`、`"ｱ"` と `"ア"` も同じ文字列として扱われ、柔軟な検索には便利ですが、厳密な比較やユニーク制約では不都合が生じることがあります。

そのため、全テーブルの照合順序を `utf8mb4_bin` に変更します。  
これにより、文字列をバイナリレベルで正確に比較でき、大文字・小文字・全角・半角の違いもきちんと判別できるようになります。

<a id="git_crlf"></a>
## Git の改行コード設定

SourceTree の 「操作」 メニューから 「ターミナルで開く」 を選択します。

起動したターミナルから、以下のコマンドを実行してください。

```bash
$ git config --global core.autocrlf
･･･
```

結果が `input` であれば、そのままで問題ありません。  
もし `input` 以外の設定になっている場合は、次のコマンドを実行して設定を変更してください。

```bash
$ git config --global core.autocrlf input
```

この `input` 設定は、Linux や WSL 環境など LF 改行が標準の開発環境で推奨される設定です。  
作業ディレクトリの改行コードはそのまま保持されますが、ステージング（コミット準備）時に Windows 特有の CRLF 改行が自動的に LF に変換されるため、リポジトリ内の改行コードは常に LF で統一されます。  
チェックアウト時の改行コード変換は行われません。

また、誤って以下のような警告が出る場合の対策としても有効です。

```
warning: LF will be replaced by CRLF in [ファイル].
The file will have its original line endings in your working directory
```

この警告は、設定が適切でないことで改行コードの変換が意図しない動きをしている場合に表示されることが多いため、`core.autocrlf` を `input` に設定することで解消できます。

## GitHub リポジトリのクローン手順

SourceTree の 「ファイル」 メニューから 「新規 / クローンを作成する...」 を選択します。

- 「元のパス/URL:」 には、GitHub リポジトリの `git@github.com:askaltdjp/pmark_examination.git` を指定してください。
- 「保存先のパス:」 には、`\\wsl.localhost\Ubuntu-24.04\home\[ユーザ名]\pmark_examination` を指定します。

設定が完了したら、「クローン」 ボタンをクリックしてプロジェクトを取得してください。

### クローン時のエラーの解消方法について

Git リポジトリをクローンした際に、以下のようなエラーダイアログが表示されることがあります。

```
---------------------------
エラーが発生しました
---------------------------
'git status' がコード 128 で終了しました: fatal: detected dubious ownership in repository at '//wsl.localhost/Ubuntu-24.04/home/[ユーザ名]/pmark_examination'
To add an exception for this directory, call:

	git config --global --add safe.directory '%(prefix)///wsl.localhost/Ubuntu-24.04/home/[ユーザ名]/pmark_examination'
 (\\wsl.localhost\Ubuntu-24.04\home\[ユーザ名]\pmark_examination)
---------------------------
OK   
---------------------------
```

このエラーは、**Git の実行ユーザとクローン先ディレクトリの所有者が異なること**により、Git のセキュリティ機能（セーフディレクトリチェック）が働いたために発生しています。

#### 対処方法
1. エラーダイアログを選択した状態で Ctrl + C を押し、エラーメッセージをコピーします。
2. メモ帳などに貼り付けて、表示されている `git config` コマンドを確認します。
3. SourceTree のターミナルで 以下のコマンドを実行してください：

```
git config --global --add safe.directory '%(prefix)///wsl.localhost/Ubuntu-24.04/home/[ユーザ名]/pmark_examination'
```

このコマンドは、該当のディレクトリを 「安全なディレクトリ」 として Git に登録し、今後同様のエラーが出ないようにするための設定です。

設定が完了したら、再度クローン操作を試してください。

## Git のブランチ運用について

このプロジェクトでは、[Gitflow](https://nvie.com/posts/a-successful-git-branching-model/) に基づいたブランチ運用を採用します。

プロジェクトをクローンした後、ブランチが `develop` になっていない場合は、まず `develop` ブランチにチェックアウトしてください。  
※ 開発中は `master` や `release` ブランチは使用しません。

作業を開始する際は、`develop` ブランチから新たに `feature` ブランチを作成し、そのブランチで開発を行います。  
ブランチ名は、`feature/xxxxx` のようにプレフィックスを付けた形式にします。

作業が完了したら、`feature` ブランチを `develop` ブランチにマージします。  
マージ後は `develop` ブランチで動作確認を行い、問題がなければ `develop` ブランチをリモートにプッシュします。  
その後、不要になったリモートの `feature` ブランチは削除してください。

### フロー図

```
クローン後
   ↓
develop ブランチに切り替え
   ↓
develop ブランチから feature/xxxxx ブランチ作成
   ↓
feature ブランチで開発作業
   ↓
作業完了 → feature ブランチを develop ブランチにマージ
   ↓
develop ブランチで動作確認
   ↓
問題なければ develop ブランチをプッシュ
   ↓
不要になった feature ブランチをリモートから削除
```

## 環境変数ファイル（.env）の作成

以下の手順に従って、Ubuntu ターミナルから `.env` ファイルを作成してください。

```bash
# プロジェクトのルートディレクトリに移動
$ cd ~/pmark_examination/

# admin の .env の有無を確認
$ ll admin/.env
ls: cannot access 'admin/.env': No such file or directory

# admin に .env が存在しない場合は作成
$ cat <<EOF > admin/.env
# pme_master データベースへの接続URL
DATABASE_URL_MASTER="mysql://pme_user:pmepassword@mysql:3306/pme_master"

# pme_transaction データベースへの接続URL
DATABASE_URL_TRANSACTION="mysql://pme_user:pmepassword@mysql:3306/pme_transaction"

# 管理者のログインID
ADMIN_LOGIN_ID="admin"

# 管理者のパスワード
ADMIN_LOGIN_PASSWORD="password"
EOF

# frontend の .env の有無を確認
$ ll frontend/.env
ls: cannot access 'frontend/.env': No such file or directory

# frontend に .env が存在しない場合は作成
$ cat <<EOF > frontend/.env
# pme_master データベースへの接続URL
DATABASE_URL_MASTER="mysql://pme_user:pmepassword@mysql:3306/pme_master"

# pme_transaction データベースへの接続URL
DATABASE_URL_TRANSACTION="mysql://pme_user:pmepassword@mysql:3306/pme_transaction"
EOF
```

これらの `.env` ファイルは、Prisma が MySQL コンテナに接続するために使用します。  
具体的には、`.env` に設定された `DATABASE_URL_MASTER` および `DATABASE_URL_TRANSACTION` の値を参照して接続します。

また、`admin` 側の `.env` には、**管理画面のログイン ID とパスワード**も含まれており、管理者としてログインする際に使用されます。

## Docker のビルド・起動

```bash
# compose.yaml のあるディレクトリに移動
$ cd ~/pmark_examination/docker

# Docker イメージのビルド ※ git clone 直後、もしくは、Dockerfile の内容を変更した場合のみ実行
$ docker compose build

# Docker コンテナのバックグランド起動
$ docker compose up -d

# Docker コンテナの状態確認　※ STATUS が UP になっていれば OK です。
$ docker compose ps -a
NAME                IMAGE             COMMAND                  SERVICE    CREATED          STATUS          PORTS
docker-admin-1      docker-admin      "docker-entrypoint.s…"   admin      11 seconds ago   Up 11 seconds   0.0.0.0:3002->3000/tcp, [::]:3002->3000/tcp
docker-frontend-1   docker-frontend   "docker-entrypoint.s…"   frontend   11 seconds ago   Up 11 seconds   0.0.0.0:3001->3000/tcp, [::]:3001->3000/tcp
docker-mysql-1      docker-mysql      "docker-entrypoint.s…"   mysql      11 seconds ago   Up 11 seconds   0.0.0.0:3306->3306/tcp, [::]:3306->3306/tcp, 33060/tcp
```

### 補足：使用頻度が高いコマンド
- Docker コンテナを停止・削除する場合
  - `docker compose down`
- Docker コンテナのログを確認する場合
  - `docker compose logs [サービス名 (例：frontend)]`
  - `docker compose logs -f [サービス名 (例：frontend)]`
    - サービス名を省略した場合は全ての Docker コンテナのログが出力される
- Docker コンテナの中に入る場合
  - `docker compose exec [サービス名 (例：frontend)] sh`

## マイグレーションと Prisma Client の生成

リポジトリをクローンした直後は、MySQL の テーブルが存在しないため、まずマイグレーションを実行してテーブルを作成する必要があります。  
あわせて、Node.js からテーブルを操作するために必要な Prisma Client も生成します。

### 他人が行ったテーブルの変更を反映する場合
```bash
# compose.yaml があるディレクトリへ移動
$ cd ~/pmark_examination/docker

# admin コンテナでマイグレーションの適用と Prisma Client の作成  ※エラーが発生する場合は補足①を参照してください。
$ docker compose exec admin npx prisma migrate dev --schema=prisma/master/schema.prisma
$ docker compose exec admin npx prisma migrate dev --schema=prisma/transaction/schema.prisma

# frontend コンテナで Prisma Client のみを作成
$ docker compose exec frontend npx prisma generate --schema=prisma/master/schema.prisma
$ docker compose exec frontend npx prisma generate --schema=prisma/transaction/schema.prisma
```

### 自分がテーブルを変更する場合
```bash
# compose.yaml があるディレクトリへ移動
$ cd ~/pmark_examination/docker

# admin コンテナでマイグレーションファイルの作成と適用、Prisma Client の作成
$ docker compose exec admin npx prisma migrate dev --name [任意の名前] --schema=prisma/master/schema.prisma
$ docker compose exec admin npx prisma migrate dev --name [任意の名前] --schema=prisma/transaction/schema.prisma
# 名前の例：init、create_table_users、add_column_profile_and_birthday_to_users など

# admin コンテナでマイグレーションファイルのみを作成
# $ docker compose exec admin npx prisma migrate dev --name [任意の名前] --create-only --schema=prisma/master/schema.prisma
# $ docker compose exec admin npx prisma migrate dev --name [任意の名前] --create-only --schema=prisma/transaction/schema.prisma

# frontend コンテナで Prisma Client のみを作成
$ docker compose exec frontend npx prisma generate --schema=prisma/master/schema.prisma
$ docker compose exec frontend npx prisma generate --schema=prisma/transaction/schema.prisma
```

マイグレーションは **admin コンテナ**で実行し、`npx prisma migrate dev` を実行します。  
このコマンドはスキーマの変更をデータベースに反映させると同時に Prisma Client のコードも生成します（`--create-only` をつけた場合はマイグレーションファイルのみ作成）

一方、**frontend コンテナ**ではマイグレーションは行わず、Prisma Client のコード生成のみを目的として `npx prisma generate` を実行します。

**補足①：**

はじめて Docker コンテナを起動した直後に `npx prisma migrate dev` を実行すると下記エラーが発生することがあります。

```
sh: prisma: not found
```
もしくは
```
Error: P1001: Can't reach database server at `mysql:3306`
```

上記エラーが発生する場合は、`docker compose restart` を実行してから、もう一度 `npx prisma migrate dev` を実行してください。

**補足②：**

テーブル構造を変更した場合は、**admin コンテナ**で、`npx prisma migrate dev --name [任意の名前]` を実行します。  
**frontend コンテナ**は、`npx prisma generate` のままで問題ありません。  

| コマンド                                     | 説明                                                               | マイグレーション実行 | Client 生成 | チーム開発時の使い分け                           | 実行コンテナ |
| -------------------------------------------- | ------------------------------------------------------------------ | -------------------- | ----------- | ------------------------------------------------ | ------------ |
| `npx prisma migrate dev --name [任意の名前]` | マイグレーションに名前をつけて実行。スキーマ差分があれば作成・適用 | ✅ ○                  | ✅ ○         | テーブル変更者が新規マイグレーション作成時に使う | admin        |
| `npx prisma migrate dev`                     | 開発用マイグレーションを作成＆適用。未適用マイグレーションを適用   | ✅ ○                  | ✅ ○         | 他の開発者はこれを実行して未適用を適用する       | admin        |
| `npx prisma generate`                        | Prisma Client のみを再生成。マイグレーションは行われない           | ❌ ✕                  | ✅ ○         | Client 更新だけしたい時に使う                    | frontend     |

スキーマ変更後は上記コマンドを実行して、`shared_prisma` 以下のファイルを GitHub に `push` します（Prisma Client は node_modules に作成されるため push は不要です）

**補足③：**  

Docker コンテナ上でマイグレーションファイルを作成すると、ファイルの所有者が `root` ユーザになるため、Ubuntu にログインしているユーザでは、そのファイルを削除したり編集したりできない場合があります。  
そのため、`sudo chown` コマンドを使って、マイグレーションファイルの所有者を現在のログインユーザに変更しておいてください。

## MySQL の確認

任意の SQL クライアントツールを使用して、以下の接続情報でデータベースに接続してください。

| 項目       | 値             |
|------------|----------------|
| ユーザ     | pme_user       |
| パスワード | pmepassword    |
| ホスト     | 127.0.0.1      |
| ポート番号 | 3306           |

接続後、以下の2つのデータベースと、それぞれに含まれるテーブルが存在することを確認してください。

- `pme_master`
- `pme_transaction`

また、フロント画面でログインするために必要となるため、`pme_transaction` データベース内の `t_employee` テーブルに、従業員のレコードを 1 件以上手動で追加しておいてください。

## 画面の確認

以下の URL にアクセスし、それぞれのログイン画面で正常にログインできることを確認してください。

### Frontend ログイン画面

- **URL**：[http://localhost:3001/auth/login/](http://localhost:3001/auth/login/)
- **ログイン情報**：  
  `t_employee` テーブルに登録されている  
  - `email_address`（メールアドレス）  
  - `password`（パスワード）  

### 管理者用（Admin）ログイン画面

- **URL**：[http://localhost:3002/auth/login/](http://localhost:3002/auth/login/)
- **ログイン情報**：  
  - ログインID：`admin`  
  - パスワード：`password`

## Visual Studio Code の設定

VSCode 上から Ubuntu（WSL）内で作業できるようにするための設定方法を説明します。

VSCode がまだインストールされていない場合は、以下のサイトからダウンロードしてインストールしてください。  
[Download Visual Studio Code - Mac, Linux, Windows](https://code.visualstudio.com/download)  
特別な理由がなければ、**User Installer** を選べば問題ありません。

### VSCode の拡張機能のインストール

VSCode を起動し、画面左の拡張機能アイコン（四角が 4 つ並んだマーク）をクリックして、以下の拡張機能をインストールしてください。

| 拡張機能名                                    | 説明                                                                                                  |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Japanese Language Pack for Visual Studio Code | VSCode の UI を日本語化するための公式言語パック。メニューや設定画面が日本語になります。               |
| WSL                                           | Windows Subsystem for Linux (WSL) 上の Ubuntu などに接続して、VSCode で直接開発できるようにする拡張。 |

### VSCode から Ubuntu（WSL）に接続する

画面左下の 「><」 のようなアイコン（リモートウィンドウを開きます）をクリックします。  
表示されるメニューから「WSL への接続」を選択すると、Ubuntu に接続された状態で VSCode が開きます。

### プロジェクトのルートディレクトリを開く

Ubuntu に接続できたら、左メニューの 「フォルダーを開く」 から、プロジェクトのルートディレクトリ（`~/pmark_examination`）を選択してください。  
初めてそのフォルダーを開いた場合、 「このフォルダー内のファイルの作成者を信頼しますか？」 という確認ダイアログが表示されます。  
その際は 「はい、作成者を信頼します」 をクリックしてください。