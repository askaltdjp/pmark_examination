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