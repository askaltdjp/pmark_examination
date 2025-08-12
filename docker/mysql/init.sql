-- データベース作成（バイナリ照合順：大文字小文字・全角半角を完全に区別）
CREATE DATABASE IF NOT EXISTS pme_master CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
CREATE DATABASE IF NOT EXISTS pme_transaction CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

-- アプリケーション操作用ユーザの作成（すでに存在していなければ）
CREATE USER IF NOT EXISTS 'pme_user'@'%' IDENTIFIED WITH mysql_native_password BY 'pmepassword';

-- すべてのデータベースに対してすべての操作権限を付与（CREATE, DROP, SELECT, INSERT, UPDATE, DELETE など含む）
GRANT ALL PRIVILEGES ON *.* TO 'pme_user'@'%';

-- 権限の変更を即時反映
FLUSH PRIVILEGES;