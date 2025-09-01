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
$ docker compose exec frontend npm install --save-dev jest @types/jest ts-jest jest-environment-jsdom
```

- `jest`
  - テストランナー本体
- `@types/jest`
  - TypeScript 用の型定義
- `ts-jest`
  - TypeScript を Jest で実行できるようにするトランスパイラ
- `jest-environment-jsdom`
  - Jest でブラウザの DOM 環境をエミュレートするための環境設定パッケージ（React のテストなどで必要）

## React Testing Library のインストール

React Testing Library は、React コンポーネントをユーザ視点でテストするためのライブラリです。  
実際の DOM 操作に近い形でコンポーネントの振る舞いを検証でき、サーバコンポーネントやクライアントコンポーネントのテストに使用します。

```bash
$ docker compose exec frontend npm install --save-dev \
  @testing-library/react \
  @testing-library/dom \
  @testing-library/jest-dom \
  @testing-library/user-event
```

- `@testing-library/react`
  - React コンポーネントのテストに使う基本ライブラリ
- `@testing-library/dom`
  - DOM 要素の操作や検証を助けるユーティリティライブラリ
- `@testing-library/jest-dom`
  - Jest のテストで使う拡張マッチャー（例: `toBeInTheDocument`）を追加
- `@testing-library/user-event`
  - ユーザーの実際の操作を忠実に再現（クリック・入力など）できる補助ライブラリ

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

### 94 行目付近：
```
■ 修正前
// A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
// moduleNameMapper: {},

■ 修正後
// A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
moduleNameMapper: {'^@/(.*)$': '<rootDir>/$1'},
```

`moduleNameMapper` は、`@/` で始まるモジュールのインポートパスを `<rootDir>/` 以下の対応するパスに変換します。  
`<rootDir>` はプロジェクトルート（通常はプロジェクトのルートディレクトリ）を指します。  
これにより、`@/lib/utils/timeUtils` のようなエイリアスを使ったインポートが正しく解決されるようになります。

### 106 行目付近：
```
■ 修正前
// A preset that is used as a base for Jest's configuration
// preset: undefined,

■ 修正後
// A preset that is used as a base for Jest's configuration
preset: 'ts-jest',
```

`preset` は Jest の設定の「ひな型」のようなもので、あらかじめ用意された設定群をまとめて読み込むためのものです。  
`preset: 'ts-jest'` を指定すると、TypeScript を扱うために必要な基本設定（`transform` 設定など）を自動で適用してくれます。

ただし、`preset` による設定はあくまで基本のひな型であり、状況によっては細かい設定をカスタマイズするために `transform` を明示的に指定する必要があります。  
今回のように JSX のトランスパイルを正しく動作させたい場合は、`transform` の設定を上書きして独自の設定を加えることで対応できます。

### 179 行目付近：
```
■ 修正前
// A map from regular expressions to paths to transformers
// transform: undefined,

■ 修正後
// A map from regular expressions to paths to transformers
transform: { '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }] },
```

`transform` は Jest に対して「どのファイルをどう変換（トランスパイル）するか」を細かく指定する設定です。  
例えば、`.ts` や `.tsx` ファイルは Jest がそのまま理解できないため、`ts-jest` というトランスフォーマーを使って TypeScript から JavaScript に変換するというルールをここで自分で定義します。

この設定により、Jest はテスト実行時に対象ファイルを自動でトランスパイルし、TypeScript の構文や型情報を考慮した形でテストを実行できます。

さらに、`transform` のオプションとして `{ tsconfig: 'tsconfig.jest.json' }` を指定することで、テスト実行時に使う TypeScript のコンパイル設定ファイルを切り替えられ、テスト環境に最適化された設定を利用可能です。

**補足：**  
`preset: 'ts-jest'` は `transform` を含む基本設定を持っていますが、`transform` を明示的に書くと `preset` の設定を上書きするため、カスタマイズしたい場合は `transform` を自分で指定する必要があります。

そのため、最初は `preset` だけ設定しても `.ts` ファイルの基本的なトランスパイルは動きますが、JSX を含むファイルは正しく変換されないケースがあります。  
今回のような環境では、`transform` で JSX も含めたトランスパイル設定を明示的に指定するのが確実な方法です。

### 191 行目付近：
```
■ 修正前
// Indicates whether each individual test should be reported during the run
// verbose: undefined,

■ 修正後
// Indicates whether each individual test should be reported during the run
verbose: true,
```

`verbose` はテスト実行時に各テストケースの詳細な結果をコンソールに表示するかどうかを決める設定です。  
`true` にするとテスト名ごとにパス・失敗などが詳しくレポートされ、デバッグしやすくなります。

## Jest テスト環境向け tsconfig.jest.json の作成

プロジェクトの直下に次のファイル（`tsconfig.jest.json`）を作成します。

```typescript
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "jsx": "react-jsx",
  }
}
```

`tsconfig.jest.json` は Jest のテスト実行時に使う TypeScript のコンパイル設定ファイルです。  
このファイルは通常の `tsconfig.json` をベースにしていて、`extends` によって設定を継承しています。

`compilerOptions` の中で `"jsx": "react-jsx"` を指定しているのは、React の新しい JSX 変換方式を有効にするためです。  
これにより、テスト環境で JSX が正しくコンパイルされ、React コンポーネントのテストがスムーズに実行できます。

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

  // 状況に応じて describe の階層をもっと深くして細分化してもよい
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

### 注意点

サーバコンポーネントとクライアントコンポーネントをテストする場合は下記のコードをファイルの先頭に記述する必要があります。

```
/**
 * @jest-environment jsdom
 */
```

このコメントは、Jest に対して「このテストファイルはブラウザの DOM 環境（jsdom）で実行する」ことを指定するものです。

特に React のコンポーネントテストでは、ブラウザの DOM が必要になるため、この指定が重要です。  
サーバコンポーネントのテストでは通常 Node 環境が使われますが、レンダリング結果の検証や DOM 操作を行う場合は jsdom が必要になります。

また、クライアントコンポーネントのテストでも DOM が必須なので、ほとんどの React コンポーネントテストでは `@jest-environment jsdom` を付けることで、安全かつ確実にブラウザ環境をエミュレートしてテストできます。

## Jest の実行方法

**全てのテストコードを実行する場合**
```bash
$ docker compose exec frontend npm run test
```

**個別にテストコードを実行する場合 ①**

ファイル指定で実行したいときはファイルパスを指定します。  
```bash 
$ docker compose exec frontend npm run test [__tests__/からのテストファイルのファイルパス]
```

**個別にテストコードを実行する場合 ②**

`npm run` 経由で jest に引数を渡すときは、`--` の後にオプションを渡してください。  
これは、`--` がないと `-t` オプション以降の文字列が npm コマンドの引数として解釈されてしまい、jest に正しく渡らないためです。

```bash
例）describe 名にマッチするテストだけを実行する場合
$ docker compose exec frontend npm run test -- -t [describeの第一引数に指定した文字列（部分一致）]
```
