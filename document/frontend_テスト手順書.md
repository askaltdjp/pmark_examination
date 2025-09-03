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
コンポーネントを実際にレンダリングし、ボタンのクリックやテキストの入力など、ユーザー操作に近い形で挙動を検証できます。  
これにより、サーバコンポーネントやクライアントコンポーネントの振る舞いを、実際の利用状況に近い形でテストできます。

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

さらに、`transform` のオプションとして `{ tsconfig: 'tsconfig.jest.json' }` を指定することで、テスト実行時に使う TypeScript のコンパイル設定ファイルを切り替えられ、テスト環境に最適化された設定を利用可能です（`tsconfig.jest.json` については後述）

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
これにより、テスト環境で JSX が正しくコンパイルされ、React コンポーネントのテストが可能になります。

## Jest のテストファイルについて

### テストファイルの作成

1. テスト用のディレクトリとしてプロジェクト直下に `__tests__` ディレクトリを作成します。
1. テストしたいファイルと同じディレクトリ構成を `__tests__` ディレクトリの中に作成します。
1. テストファイルの名前は、元のファイル名の拡張子の前に `.test` をつけます。例えば `timeUtils.ts` なら `timeUtils.test.ts` です。

**例：**  
`frontend/lib/utils/timeUtils.ts` をテストする場合、テストファイルは
`frontend/__tests__/lib/utils/timeUtils.test.ts` という名前で作成します。

### テストファイルの書き方

Jest でテストを書くときは、以下のルールを守ると読みやすくメンテナンスしやすいコードになります。

```typescript
// テスト対象の関数をインポート
import { 関数名1, 関数名2 } from "テスト対象ファイルのパス";

// モックの宣言（後述）

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

  // 状況に応じて describe の階層をもっと深くして細分化する
  // 例：クラスのメソッドテストする場合は、ファイル名＞クラス名＞メソッド名という3階層のdescribeを作成する
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

## モックに関するガイド

テスト対象のコードが依存している外部モジュールは、**原則としてすべてモック化してからテストを行います。**  
これにより、依存モジュールの影響を排除し、対象コードだけを純粋に検証できます。

### モジュールの関数を自動でモック化する場合

```typescript
import { currentJST } from "@/lib/utils/timeUtils";

// currentJST モック化する場合
jest.mock("@/lib/utils/timeUtils");

console.log(currentJST()); // => undefined（jest.fn()に置き換えられているため）
```

- `jest.mock('モジュールパス')` によって、対象モジュールの `export` 関数はすべて `jest.fn()` に置き換えられます。
- このとき、関数の挙動（戻り値や副作用）は一切なくなり、戻り値は常に `undefined` になります。

### モック関数に固定の戻り値を設定する場合

```typescript
(currentJST as jest.Mock).mockReturnValue(new Date("2000-01-01T00:00:00Z"));

console.log(currentJST()); // => 常に同じDateを返す
```

- `currentJST` は `jest.mock()` によって `jest.fn()` に置き換わりますが、TypeScript はモック関数になったことを自動では認識しないため、モック関数専用のメソッド（`.mockReturnValue()` など）を使う際に `jest.Mock` 型へのアサーションが必要です。
- `.mockReturnValue()` により、常に同じ値を返すようになります。
- 非同期関数には `.mockResolvedValue()` を使用します。

### 引数に応じてモック関数の戻り値を変更する場合

```typescript
(currentJST as jest.Mock).mockImplementation(() => {
  return new Date("2000-01-01T00:00:00Z");
});
```

- `.mockImplementation(fn)` は、モック関数の内部実装そのものを自由に定義できます。
- 非同期処理にも使用可能です（`async () => {...}`）

### テストごとにモック関数の戻り値を維持する場合

```typescript
test("A", () => {
  (currentJST as jest.Mock).mockReturnValue(new Date("2000-01-01"));
});

test("B", () => {
  // test 関数に設定している A の設定は B に引き継がれない
});
```

- **`test()` 関数内で設定したモック挙動は他の `test()` に引き継がれません。**
- すべてのテストで同じ設定を使いたい場合は、`beforeAll` や `beforeEach` に記述します。

### モジュール構造が複雑でモック化できない場合

Prisma などの一部ライブラリでは、単純な `jest.mock()` ではモックが正しく適用されないことがあります。

```typescript
jest.mock("@/lib/prisma/masterPrisma", () => ({
  masterPrisma: {
    mTest: {
      findFirst: jest.fn(), // 明示的にモック関数にする
    },
  },
}));
```

- 上記のように、第 2 引数で返すオブジェクト内にモック関数を明示的に定義することで、Prisma Client の複雑な型と型アサーションエラーを回避しやすくなります。
- 特に `Prisma Client` のような自動生成された型は、モジュールの構造が複雑なため、暗黙的なモックが失敗しやすいです。

### モック関数の呼び出し履歴を検証する場合

```typescript
import { useRouter } from "next/navigation";

jest.mock("next/navigation");

test("should navigate to /exam/take", () => {
  (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });

  const router = useRouter();
  router.push("/exam/take");

  // push 関数が "/exam/take" を引数に呼び出されたことを確認します
  expect(router.push).toHaveBeenCalledWith("/exam/take");
});
```

- `useRouter` はモック化されると `jest.fn()` によって関数として差し替えられるため、戻り値として返すオブジェクト（この例では `router`）にも、テストで使う関数（例: `push`）を `jest.fn()` で用意しておく必要があります。
- `jest.fn()` によって作られたモック関数には、呼び出し回数や引数などの呼び出し履歴が自動で記録されるため、`expect(...).toHaveBeenCalledWith(...)` を使って、指定された引数で関数が呼び出されたかどうかを検証できます。

### モック関数の呼び出し履歴をリセットする場合

```typescript
// モック関数を個別に呼び出し履歴をリセットする場合
// モック関数.mockClear(); という形で呼び出す。
router.push.mockClear();

または

// すべてのモック関数の呼び出し履歴をリセットする場合
jest.clearAllMocks();
```

- 1 つのテスト内でモック関数の呼び出し検証が 1 回だけの場合、呼び出し履歴のクリアは不要です。
- 同じテスト関数内で同じモック関数を複数回呼び出して検証する場合は、途中で履歴をクリアする必要があるケースがあります。
- テスト関数が異なってもモック関数の呼び出し履歴は引き継がれるため、テストごとに履歴をリセットしたい場合は `beforeEach` でクリアするのが一般的です。
- 呼び出し履歴をまとめてクリアするには `jest.clearAllMocks()` を使います。これは履歴のみをクリアし、モックの実装は維持されます。
- モック関数の実装も含めてリセットしたい場合は `jest.resetAllMocks()` を使います。

### 特定の関数を spy して挙動を一時的に上書きする場合

テスト中に `console.error` などのグローバル関数が呼ばれると、テストの実行結果にエラーメッセージが表示されてしまうことがあります。  
これは視認性が下がるだけでなく、エラーかどうかを判別しにくくなるため、テストの実行時には 一時的に spy して何も出力しないようにするのが一般的です。

```typescript
test("テスト中にconsole.errorを実行してもエラーが出力されない", () => {
  const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  // ここで console.error を呼び出しても、実際には何も出力されない
  console.error("これは表示されない");

  // 必要なテスト処理...

  // spy を解除して元の実装に戻す
  errorSpy.mockRestore();
});
```

- `jest.spyOn(obj, "method")` は、対象のオブジェクトのメソッドに対して **呼び出し監視や上書き** を行うことができます。
- `.mockImplementation(fn)` を使うことで、元の関数の代わりに任意の処理（例：何もしない）を差し込めます。
- テスト後は `.mockRestore()` を呼び出して spy の効果を元に戻すのが推奨されます。
  - **spy の効果は `test()` 間でも引き継がれるため、他のテストに影響を与えないよう明示的にリセットしておくことが重要です。**

> **使い分けの判断基準としては、**
> - グローバル関数をモックや監視するときは、`jest.spyOn` で一時的に差し替え、あとで元に戻す。
> - 単純に関数を置き換えっぱなしにしたい（元に戻さなくて良い）場合は `jest.fn()` を使う。