-- データベース作成（照合順と文字分類をCロケールに設定：バイナリ比較で大文字小文字・全角半角を厳密に区別）
CREATE DATABASE pme_master TEMPLATE template0 ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C';
CREATE DATABASE pme_transaction TEMPLATE template0 ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C';

-- Shadow データベース作成（Prisma マイグレーションや introspection 用）
CREATE DATABASE pme_master_shadow;
CREATE DATABASE pme_transaction_shadow;

-- アプリケーション操作用ユーザの作成
CREATE ROLE pme_user WITH LOGIN PASSWORD 'pmepassword';