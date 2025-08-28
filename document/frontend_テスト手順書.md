# frontend テスト手順書

## Jest の概要

Jest は JavaScript と TypeScript 向けの定番テストフレームワークで、手軽にユニットテストやスナップショットテストを実行できます。  
特に React や Next.js と相性が良く、豊富なモック機能と直感的な API を備えているのが特徴です。  
今回はこの Jest を使って、効率的に単体テストを進めていきます。

## Jest のインストール

Ubuntu ターミナルでログインして、下記のコマンドを実行します。

```bash
# docker の中に移動
$ cd ~/pmark_examination/docker

# Jest と関連パッケージのインストール
$ docker compose exec frontend npm install --save-dev jest @types/jest ts-jest
```

- `jest`: テストランナー本体
- `@types/jest`: TypeScript 用の型定義
- `ts-jest`: TypeScript を Jest で実行できるようにするトランスパイラ

## Jest の設定ファイル（jest.config.js）の作成

```bash
$ docker compose exec frontend npx create-jest
Need to install the following packages:
create-jest@30.1.1
Ok to proceed? (y)　<- y を入力

npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported

The following questions will help Jest to create a suitable configuration for your project

? Would you like to use Jest when running "test" script in "package.json"? › (Y/n)  <- y を入力
? Would you like to use Typescript for the configuration file? › (y/N)  <- y を入力
? Choose the test environment that will be used for testing › - Use arrow-keys. Return to submit.  <- Enter キーを押下（node を選択）
❯   node
    jsdom (browser-like)
? Do you want Jest to add coverage reports? › (y/N)  <- n を入力
? Which provider should be used to instrument code for coverage? › - Use arrow-keys. Return to submit.  <- Enter キーを押下（v8 を選択）
❯   v8
    babel
? Automatically clear mock calls, instances, contexts and results before every test? › (y/N)  <- y を入力

✏️  Modified /usr/src/app/package.json

📝  Configuration file created at /usr/src/app/jest.config.ts
```

設定ファイル（jest.config.js）が作成されたら、中身を下記のように修正します。

**94 行目付近：**
```
修正前
// A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
// moduleNameMapper: {},

修正後
// A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
moduleNameMapper: {'^@/(.*)$': '<rootDir>/$1'},
```

`moduleNameMapper` は、`@/` で始まるモジュールのインポートパスを `<rootDir>/` 以下の対応するパスに変換します。  
`<rootDir>` はプロジェクトルート（通常は package.json のあるディレクトリ）を指します。  
これにより、`@/lib/utils/timeUtils` のようなエイリアスを使ったインポートが正しく解決されるようになります。

**106 行目付近：**
```
修正前
// A preset that is used as a base for Jest's configuration
// preset: undefined,

修正後
// A preset that is used as a base for Jest's configuration
preset: 'ts-jest',
```

`preset: 'ts-jest'` を指定することで、TypeScript ファイルを Jest 実行時に自動でトランスパイル（ts → js）し、TypeScript コードをそのままテストできるようになります。  
これがないと Jest は TypeScript を理解できずエラーになります。

上記の修正後に下記のファイルを GitHub に push します。

- 追加ファイル
  - jest.config.ts
- 更新ファイル
  - package-lock.json
  - package.json

## Jest のテストファイルについて

### テストファイルの作成

1. テスト用のディレクトリとしてプロジェクト直下に `__tests__` ディレクトリを作成します。
1. テストしたいファイルと同じディレクトリ構成を、`__tests__` ディレクトリの中に作成します。
1. テストファイルの名前は、元のファイル名の拡張子の前に `.test` をつけます。例えば `timeUtils.ts` なら `timeUtils.test.ts` です。

**例：**  
`frontend/lib/utils/timeUtils.ts` をテストする場合、テストファイルは
`frontend/__tests__/lib/utils/timeUtils.test.ts` という名前で作成します。

### テストファイルの書き方

Jest でテストを書くときは、以下のルールを守ると読みやすくメンテナンスしやすいコードになります。

```typescript
// テスト対象の関数をインポート
import { 関数名1, 関数名2 } from "テスト対象ファイルのパス";

describe("ファイル名", () => {
  describe("関数名", () => {
    test("期待される挙動を自然文で記載", () => {
      // テスト内容を書く
    });
  });

  describe("別の関数名", () => {
    test("別の期待される挙動を自然文で記載", () => {
      // テスト内容を書く
    });
  });
});
```

### ルール説明

- `describe` はテスト対象の「まとまり」を表します。一般的には「ファイル名」や「モジュール名」を使います。  
  複数の関数があるファイルなら、ファイル名でひとくくりにします。
- `describe` は入れ子（ネスト）にして、関数やメソッドごとにグループ化できます。  
  関数ごとのテストグループを分けて見やすくします。
- `test`（または `it`）は「具体的な動作や仕様を表す文章」を書き、その中に実際のテストコードを記述します。  
  例：「数値を正しく足し合わせること」「エラーが投げられること」など。
- テスト内容は `test` ブロック内に具体的な検証コードを書きます。
- 1つの `test` には 1 つの期待動作を書くのが望ましいです。  
  複数の動作をまとめると、どの部分で失敗したかわかりにくくなります。
- ファイルの冒頭でテスト対象の関数を `import` して使います。

## Jest の実行方法

**全てのテストコードを実行する場合**
```bash
$ docker compose exec frontend npm run test
```

**個別にテストコードを実行する場合①**

ファイル指定で実行したいときはファイルパスを指定します。  
```bash 
$ docker compose exec frontend npm run test [__tests__/からのテストファイルのファイルパス]
```

**個別にテストコードを実行する場合②**

`npm run` 経由で jest に引数を渡すときは、`--` の後にオプションを渡してください。  
これは、`--` がないと `-t` オプション以降の文字列が npm コマンドの引数として解釈されてしまい、jest に正しく渡らないためです。

```bash
例）describe 名にマッチするテストだけを実行する場合
$ docker compose exec frontend npm run test -- -t "describeの第一引数に指定した文字列（部分一致）"
```
