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
pmark_examination/                                       # プロジェクトのルートディレクトリ
│
├── admin                                                # 管理画面用アプリケーション
│   ├── app                                              # Next.js のアプリケーションコード
│   ├── node_modules                                     # 依存パッケージ（Git 管理外）
│   ├── package-lock.json                                # 依存パッケージの固定バージョン情報
│   ├── package.json                                     # npm のパッケージ管理ファイル
│   ├── public                                           # 静的ファイル（画像やフォントなど）
│   ├── .env                                             # 環境設定ファイル（Git 管理外）
│   └── .gitignore                                       # Git 管理除外設定ファイル
│
├── frontend                                             # フロントエンド用アプリケーション
│   ├── app                                              # Next.js のアプリケーションコード
│   ├── node_modules                                     # 依存パッケージ（Git 管理外）
│   ├── package-lock.json                                # 依存パッケージのバージョン管理
│   ├── package.json                                     # npm パッケージ管理ファイル
│   ├── public                                           # 静的ファイル群
│   ├── .env                                             # 環境設定ファイル（Git 管理外）
│   └── .gitignore                                       # Git 管理除外設定ファイル
│
├── shared_prisma                                        # Prisma 関連ファイルを共有する場所
│   ├── master                                           # 「pme_master」データベース用の Prisma 設定フォルダ
│   │   ├── migrations　　　　                        　　# masterDB 用のマイグレーションファイル群（スキーマ変更履歴）
│   │   └── schema.prisma                                # masterDB 用の Prisma スキーマファイル（DB モデル定義）
│   └── transaction                                      # 「pme_transaction」データベース用のPrisma設定フォルダ
│       ├── migrations                                   # transactionDB 用のマイグレーションファイル群（スキーマ変更履歴）
│       └── schema.prisma                                # transactionDB 用の Prisma スキーマファイル（DB モデル定義）
│
├── docker                                               # Docker 関連の設定や構成ファイルを格納
│   ├── compose.yaml                                     # Docker Composeの設定ファイル
│   ├── node                                             # Node.js 関連の Docker 設定用ディレクトリ 
│   │    └── Dockerfile                                  # Node.js アプリ用の Dockerfile
│   └── postgres                                         # PostgreSQL 用の Docker 構成フォルダ 
│        ├── Dockerfile                                  # PostgreSQL コンテナのベースとなる Dockerfile
│        └── initdb                                      # コンテナ初回起動時に実行される初期化スクリプト群
│             ├── 01-create-databases-and-user.sql       # データベース（master/transaction）とユーザの作成スクリプト
│             ├── 02-grant_pme_master.sql                # pme_master データベースに対する pme_user への権限付与
│             ├── 03-grant_pme_transaction.sql           # pme_transaction データベースに対する pme_user への権限付与
│             ├── 04-grant_pme_master_shadow.sql         # pme_master_shadow データベースに対する pme_user への権限付与
│             ├── 05-grant_pme_transaction_shadow.sql    # pme_transaction_shadow データベースに対する pme_user への権限付与
│             └── init.sh                                # 初期化スクリプト一括実行用のシェルスクリプト
│
└── document                                             # ドキュメント用フォルダ
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
      - postgres

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
      - postgres

  postgres:
    build:
      context: ..
      dockerfile: docker/postgres/Dockerfile
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - TZ=Asia/Tokyo
    volumes:
      - ./postgres/initdb:/docker-entrypoint-initdb.d
      - postgres_data:/var/lib/postgresql/data
    restart: always

volumes:
  postgres_data:
```

この `compose.yaml` の構成は、Next.js で作られた 2 つのアプリケーション（`frontend`, `admin`）と、`PostgreSQL` を Docker で一括管理する構成になっています。

#### `build` に関する説明

`build.context` は Docker ビルド時の作業ディレクトリ（コンテキスト）で、この中のファイルだけがビルド対象になります。  
`build.dockerfile` は使用する Dockerfile のパスを指定しますが、**必ず `build.context` 以下のパスである必要があります。**  
この例では、ルートディレクトリ（`..`）をコンテキストとし、その中の `docker/node/Dockerfile` を使用しています。

#### `command` に関する説明

`frontend` と `admin` のコンテナ起動時に、`npm install && npm run dev` のコマンドを実行しています。  
GitHub クローンした直後は `node_modules` がないため、起動時に `npm install` を自動的に行い、依存パッケージをインストールします。  
その後、`npm run dev` を実行することで、すぐに `frontend` と `admin` の開発サーバーが立ち上がり、画面や API の確認が可能になります。

#### `volumes` に関する説明

`postgres_data` は、PostgreSQL のデータを永続化するための **名前付きボリューム** です。  
これにより、コンテナを削除・再作成しても、データベース内の情報（テーブルやデータなど）は失われません。  
名前付きボリュームとして定義することで、**ホスト環境に依存せず、Docker がボリュームの保存場所を自動管理**してくれるため、扱いやすく、安全な運用が可能になります。  
このボリュームは、PostgreSQL コンテナ内の `/var/lib/postgresql/data` にマウントされ、実際のデータ格納先として使用されます。


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

### docker/postgres/Dockerfile

```
FROM postgres:17.6-alpine3.22
```

この Dockerfile は、`postgres:17.6-alpine3.22` という既存の公式イメージをそのまま使うだけの内容です。  
新たに環境を構築せず、ベースイメージをそのまま利用してコンテナを起動します。

### docker/postgres/initdb/init.sh

```bash
#!/bin/bash
set -e

echo "📦 データベースとユーザの作成..."
psql -U postgres -d postgres -f /docker-entrypoint-initdb.d/01-create-databases-and-user.sql

echo "🔐 pme_master に権限付与..."
psql -U postgres -d pme_master -f /docker-entrypoint-initdb.d/02-grant_pme_master.sql

echo "🔐 pme_transaction に権限付与..."
psql -U postgres -d pme_transaction -f /docker-entrypoint-initdb.d/03-grant_pme_transaction.sql

echo "🔐 pme_master_shadow に権限付与..."
psql -U postgres -d pme_master_shadow -f /docker-entrypoint-initdb.d/04-grant_pme_master_shadow.sql

echo "🔐 pme_transaction_shadow に権限付与..."
psql -U postgres -d pme_transaction_shadow -f /docker-entrypoint-initdb.d/05-grant_pme_transaction_shadow.sql

echo "✅ 初期化完了"
```

このスクリプトは、PostgreSQL のコンテナ初回起動時に自動的に実行され、データベースとユーザの作成、各データベースの権限付与を行います。

### docker/postgres/initdb/01-create-databases-and-user.sql

```sql
-- データベース作成（照合順と文字分類をCロケールに設定：バイナリ比較で大文字小文字・全角半角を厳密に区別）
CREATE DATABASE pme_master TEMPLATE template0 ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C';
CREATE DATABASE pme_transaction TEMPLATE template0 ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C';

-- Shadow データベース作成（Prisma マイグレーションや introspection 用）
CREATE DATABASE pme_master_shadow;
CREATE DATABASE pme_transaction_shadow;

-- アプリケーション操作用ユーザの作成
CREATE ROLE pme_user WITH LOGIN PASSWORD 'pmepassword';
```

PostgreSQL のデータベースを **4つ作成**しています。  
「`pme_master`」と「`pme_transaction`」は、**アプリケーションが実際に利用するデータベース**です。  
これらは文字の照合順や分類を **「Cロケール」** に設定しており、**大文字小文字や全角半角を厳密に区別するバイナリ比較**を行う仕様です。

さらに、**Prisma のマイグレーションや introspection（既存DB構造の読み込み）用**に  
「`pme_master_shadow`」と「`pme_transaction_shadow`」という **シャドウデータベース**も作成しています。  
これらのシャドウデータベースは、通常 Prisma がマイグレーション時に一時的に自動作成するため、**ユーザに `createdb` 権限を付与する必要**があります。  

ただし、`createdb` は **データベース全体に対して影響を与えうる強めの権限**であるため、**運用上の安全性を考慮してアプリケーションユーザには付与していません**。  
そのため、**あらかじめ手動で作成する方針**を採っています。

最後に、アプリケーションがこれらのデータベースに接続・操作を行うための **専用ユーザ「pme_user」** を作成しています。  
このユーザには **ログイン権限**があり、パスワードは「`pmepassword`」に設定しています。

### docker/postgres/initdb/02-grant_pme_master.sql

```sql
-- スキーマに対する使用・作成権限を付与
GRANT USAGE, CREATE ON SCHEMA public TO pme_user;
```

`pme_user` に `public` スキーマの使用（`USAGE`）とオブジェクト作成（`CREATE`）権限を付与します。  
これにより、`pme_user` はスキーマ内で自由にテーブルやシーケンスを作成できます。

**補足：**  
PostgreSQL では、**テーブルは原則として作成者のみが操作可能です。**  
つまり、`pme_user` が作成したテーブルは、他のユーザは権限を付与されない限り操作できません。  
他ユーザに操作権限を与える場合は以下のように対応してください。

```sql
-- 既存テーブルに対して権限付与する場合
GRANT ALL PRIVILEGES ON テーブル名 TO 他のユーザ名;
```

```sql
-- 今後作成されるテーブルに対して自動付与する場合
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO 他のユーザ名;
```

**注意：**  
`GRANT` や `ALTER DEFAULT PRIVILEGES` は、それぞれ対象テーブルの所有者（通常は作成者）またはスーパーユーザが実行する必要があります。  
つまり、`pme_user` が作成したテーブルの権限を他ユーザに与えたい場合は、必ず `pme_user` ユーザでこれらのコマンドを実行してください。

その他の初期化スクリプトの内容は、上記と同様で、データベースの `public` スキーマに対して同じ権限設定を行っています。

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

# プロジェクト直下に作成された prisma の削除
$ sudo rm -rf prisma/

# admin の直下にある .env を次のように修正
===========================================
# pme_master データベースへの接続URL
DATABASE_URL_MASTER="postgresql://pme_user:pmepassword@postgres:5432/pme_master"

# pme_transaction データベースへの接続URL
DATABASE_URL_TRANSACTION="postgresql://pme_user:pmepassword@postgres:5432/pme_transaction"

# pme_master_shadow データベースへの接続URL
SHADOW_DATABASE_URL_MASTER="postgresql://pme_user:pmepassword@postgres:5432/pme_master_shadow"

# pme_transaction_shadow データベースへの接続URL
SHADOW_DATABASE_URL_TRANSACTION="postgresql://pme_user:pmepassword@postgres:5432/pme_transaction_shadow"

# 管理者のログインID
ADMIN_LOGIN_ID="admin"

# 管理者のパスワード
ADMIN_LOGIN_PASSWORD="password"
===========================================

# 作業ディレクトリに移動（frontend）
$ cd ~/pmark_examination/frontend

# プロジェクト初期化
$ docker run --rm -it \
  -v $(pwd):/usr/src/app \
  -w /usr/src/app \
  node:24.4.1-alpine3.21 \
  sh -c "npx create-next-app@latest . && npm install @prisma/client && npm install prisma --save-dev && npm install --save-dev daisyui"

# frontend の直下に .env を作成
$ vi .env
===========================================
# pme_master データベースへの接続URL
DATABASE_URL_MASTER="postgresql://pme_user:pmepassword@postgres:5432/pme_master"

# pme_transaction データベースへの接続URL
DATABASE_URL_TRANSACTION="postgresql://pme_user:pmepassword@postgres:5432/pme_transaction"

# pme_master_shadow データベースへの接続URL
SHADOW_DATABASE_URL_MASTER="postgresql://pme_user:pmepassword@postgres:5432/pme_master_shadow"

# pme_transaction_shadow データベースへの接続URL
SHADOW_DATABASE_URL_TRANSACTION="postgresql://pme_user:pmepassword@postgres:5432/pme_transaction_shadow"
===========================================
```

まず、`admin` ディレクトリ内で Next.js の初期プロジェクトと Prisma と DaisyUI を導入しています。  
Prisma は ORM で、DaisyUI は Tailwind CSS をベースにしたコンポーネントライブラリです。

`npx prisma init` を実行すると、`admin` 内に `.env` と `prisma/schema.prisma` が作成されます。  
`.env` は環境固有の設定を定義するためプロジェクトごとに必要になりますが、`schema.prisma` はスキーマを定義するファイルなので一元管理すべきものになります。  
のちほど、`admin` と `frontend` の両方から参照できるように `shared_prisma` の下に `schema.prisma` を作成するため、プロジェクトの直下にある `schema.prisma` は削除しておきます。

次に、`frontend` では `npx prisma init` は実行せず、代わりに `.env` を手動で作成しています。  
スキーマファイルは共有ディレクトリのものを参照するため、プロジェクト内になくても問題ありません。

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

次のようにファイルを作成します。

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
  provider          = "postgresql"
  url               = env("DATABASE_URL_MASTER")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL_MASTER")
}

/// 試験の概要
model MTest {
  /// ID
  id          Int       @id @default(autoincrement())
  /// 名前
  name        String?   @db.VarChar(64)
  /// 開始日
  startAt     DateTime  @map("start_at")
  /// 終了日
  endAt       DateTime  @map("end_at")
  /// 出題数
  questionNum Int       @map("question_num")
  /// 合格数
  passNum     Int       @map("pass_num")
  /// 登録日時
  createAt    DateTime? @map("create_at")
  /// 更新日時
  updateAt    DateTime? @map("update_at")
  /// 削除日時
  deleteAt    DateTime? @map("delete_at")

  @@map("m_test")
}

/// 試験の問題
model MTestQuestion {
  /// ID
  id         Int       @id @default(autoincrement())
  /// 試験ID
  testId     Int       @map("test_id")
  /// 問題No
  questionNo Int       @map("question_no")
  /// 問題文
  question   String    @db.Text
  /// 解説
  commentary String?   @db.Text
  /// 正解
  correct    Boolean
  /// 登録日時
  createAt   DateTime? @map("create_at")
  /// 更新日時
  updateAt   DateTime? @map("update_at")
  /// 削除日時
  deleteAt   DateTime? @map("delete_at")

  @@unique([testId, questionNo])
  @@map("m_test_question")
}
```

このファイルは、Prisma を使ってデータベースの構造（スキーマ）を定義するためのものです。  

- **`generator`**  
  Prisma Client を TypeScript 用に生成し、`../../node_modules/.prisma/client_master` ディレクトリに出力する設定です。  
  `output` を指定しない場合、Prisma Client はデフォルトで `node_modules/@prisma/client` に出力されますが、今回は `pme_master` と `pme_transaction` の 2 つのクライアントを区別して扱うため、明示的にパスを指定しています。
- **`datasource`**  
  データベースとして PostgreSQL を使用し、接続先は `.env` の `DATABASE_URL_MASTER` に記述します。  
  マイグレーションの検証には `.env` の `SHADOW_DATABASE_URL_MASTER` を使用し、これは一時的な「シャドウデータベース」への接続を意味します。
- **`model`**  
  データベースのテーブルを表現するもので、各フィールドがテーブルのカラムに対応します。  
  リレーションや制約を指定して、データベース構造をコードで定義します。

PostgreSQL に複数のデータベースがあるため、それぞれに対応する `pme_master` 用と `pme_transaction` 用の2つの `schema.prisma` ファイルを用意し、個別に管理しています。

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
  provider          = "postgresql"
  url               = env("DATABASE_URL_TRANSACTION")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL_TRANSACTION")
}

/// 受験対象の社員情報
model TEmployee {
  /// ID
  id           Int       @id @default(autoincrement())
  /// 社員No
  employeeNo   String    @map("employee_no") @db.VarChar(64)
  /// 名前
  name         String    @db.VarChar(64)
  /// メールアドレス
  emailAddress String    @map("email_address") @db.VarChar(256)
  /// パスワード
  password     String    @db.VarChar(64)
  /// 入社日
  joinDate     DateTime  @map("join_date") @db.Date
  /// 登録日時
  createAt     DateTime? @map("create_at")
  /// 更新日時
  updateAt     DateTime? @map("update_at")
  /// 削除日時
  deleteAt     DateTime? @map("delete_at")

  @@index([employeeNo])
  @@index([emailAddress])
  @@map("t_employee")
}

/// 社員の受験履歴
model TTest {
  /// ID
  id         Int       @id @default(autoincrement())
  /// 社員ID
  employeeId Int       @map("employee_id")
  /// 試験ID
  testId     Int       @map("test_id")
  /// 受験回数
  testCnt    Int       @default(1) @map("test_cnt")
  /// 正解数
  correctNum Int       @map("correct_num")
  /// 合否
  result     Int
  /// 受験日時
  testAt     DateTime  @map("test_at")
  /// 登録日時
  createAt   DateTime? @map("create_at")
  /// 更新日時
  updateAt   DateTime? @map("update_at")
  /// 削除日時
  deleteAt   DateTime? @map("delete_at")

  @@unique([employeeId, testId, testCnt])
  @@map("t_test")
}

/// 社員の解答履歴
model TTestAnswer {
  /// ID
  id         Int       @id @default(autoincrement())
  /// 社員ID
  employeeId Int       @map("employee_id")
  /// 試験ID
  testId     Int       @map("test_id")
  /// 受験回数
  testCnt    Int       @default(1) @map("test_cnt")
  /// 問題No
  questionNo Int       @map("question_no")
  /// 解答
  answer     Boolean   @default(false)
  /// 登録日時
  createAt   DateTime? @map("create_at")
  /// 更新日時
  updateAt   DateTime? @map("update_at")
  /// 削除日時
  deleteAt   DateTime? @map("delete_at")

  @@unique([employeeId, testId, testCnt, questionNo])
  @@map("t_test_answer")
}
```

この設定は、`DATABASE_URL_TRANSACTION` の環境変数を使って、PostgreSQLデータベース (`pme_transaction`) に接続するデータソースを定義しています。

### admin/app/globals.css と frontend/app/globals.css

```css
@import "tailwindcss";
@plugin "daisyui";    ← 追加
･･･
```

`@plugin "daisyui";` は、Tailwind CSS のビルドプロセスに DaisyUI のプラグイン機能を追加するための記述です。

これによって、DaisyUI が提供するカスタムコンポーネントやユーティリティクラスが Tailwind のスタイルに組み込まれ、簡単に DaisyUI のデザインを使えるようになります。

### Docker のビルド・起動

上記までファイルの準備、コマンド操作を行ったら、Docker イメージのビルド、および、Docker コンテナの起動を行います（コマンドについては後述）

### マイグレーションと Prisma Client の生成

Docker コンテナ起動後、schema.prisma の内容に基づきデータベースのマイグレーションと Prisma Client の生成を行います（コマンドについては後述）

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
DATABASE_URL_MASTER="postgresql://pme_user:pmepassword@postgres:5432/pme_master"

# pme_transaction データベースへの接続URL
DATABASE_URL_TRANSACTION="postgresql://pme_user:pmepassword@postgres:5432/pme_transaction"

# pme_master_shadow データベースへの接続URL
SHADOW_DATABASE_URL_MASTER="postgresql://pme_user:pmepassword@postgres:5432/pme_master_shadow"

# pme_transaction_shadow データベースへの接続URL
SHADOW_DATABASE_URL_TRANSACTION="postgresql://pme_user:pmepassword@postgres:5432/pme_transaction_shadow"

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
DATABASE_URL_MASTER="postgresql://pme_user:pmepassword@postgres:5432/pme_master"

# pme_transaction データベースへの接続URL
DATABASE_URL_TRANSACTION="postgresql://pme_user:pmepassword@postgres:5432/pme_transaction"

# pme_master_shadow データベースへの接続URL
SHADOW_DATABASE_URL_MASTER="postgresql://pme_user:pmepassword@postgres:5432/pme_master_shadow"

# pme_transaction_shadow データベースへの接続URL
SHADOW_DATABASE_URL_TRANSACTION="postgresql://pme_user:pmepassword@postgres:5432/pme_transaction_shadow"
EOF
```

これらの `.env` ファイルは、Prisma が PostgreSQL コンテナに接続するために使用します。  
具体的には、2つの PostgreSQL データベース（`pme_master` と `pme_transaction`）およびそれぞれのシャドウデータベースへの接続URLが含まれています。

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
NAME                IMAGE             COMMAND                  SERVICE    CREATED        STATUS          PORTS
docker-admin-1      docker-admin      "docker-entrypoint.s…"   admin      17 hours ago   Up 16 seconds   0.0.0.0:3002->3000/tcp, [::]:3002->3000/tcp
docker-frontend-1   docker-frontend   "docker-entrypoint.s…"   frontend   17 hours ago   Up 16 seconds   0.0.0.0:3001->3000/tcp, [::]:3001->3000/tcp
docker-postgres-1   docker-postgres   "docker-entrypoint.s…"   postgres   17 hours ago   Up 32 minutes   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp
```

### 補足：使用頻度が高いコマンド
- Docker コンテナを停止・削除する場合
  - `docker compose down`
- Docker コンテナを再起動する場合
  - `docker compose restart`
- Docker コンテナのログを確認する場合
  - `docker compose logs [サービス名 (例：frontend)]`
  - `docker compose logs -f [サービス名 (例：frontend)]`
    - サービス名を省略した場合は全ての Docker コンテナのログが出力されます
- Docker コンテナ内のコマンドを実行する場合
  - `docker compose exec [サービス名 (例：frontend)] [コンテナ内で実行するコマンド]`
  - `docker compose exec [サービス名 (例：frontend)] sh`
    - コマンドに shell コマンド (sh, bash 等) を指定するとコンテナの中に入ります

## マイグレーションと Prisma Client の生成

リポジトリをクローンした直後は、PostgreSQL の テーブルが存在しないため、まずマイグレーションを実行してテーブルを作成する必要があります。  
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
# マイグレーションファイルを修正したい場合は --create-only オプションを付けて実行
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
Error: P1001: Can't reach database server at `postgres:5432`
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

Docker コンテナ上でマイグレーションファイルを作成すると、ファイルの所有者が `root` ユーザになるため、Ubuntu にログインしているユーザでは、そのファイルの編集や削除ができません。  
そのため、`sudo chown` コマンドを使って、マイグレーションファイルの所有者を現在のログインユーザに変更しておいてください。

## PostgreSQL の確認

任意の SQL クライアントツールを使用して、以下の接続情報でデータベースに接続してください。

| 項目           | 値                            |
| -------------- | ----------------------------- |
| ユーザ         | pme_user                      |
| パスワード     | pmepassword                   |
| ホスト         | 127.0.0.1                     |
| ポート番号     | 5432                          |
| データベース名 | pme_master と pme_transaction |

接続後、各データベースの `public` スキーマの中にテーブルが存在することを確認してください。

また、フロント画面でログインするために必要となるため、`pme_transaction` データベース内の `t_employee` テーブルに、従業員のレコードを 1 件以上手動で追加しておいてください。

## 画面の確認

以下の URL にアクセスし、それぞれのログイン画面で正常にログインできることを確認してください。

### フロント用ログイン画面

- **URL**：[http://localhost:3001/auth/login/](http://localhost:3001/auth/login/)
- **ログイン情報**：  
  `t_employee` テーブルに登録されている  
  - `email_address`（メールアドレス）  
  - `password`（パスワード）  

### 管理者用ログイン画面

- **URL**：[http://localhost:3002/auth/login/](http://localhost:3002/auth/login/)
- **ログイン情報**：  
  `.env` に定義されている
  - `ADMIN_LOGIN_ID`（ログインID）
  - `ADMIN_LOGIN_PASSWORD`（パスワード）

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