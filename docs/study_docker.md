1. 基本コマンド

# コンテナ起動（ログを表示しながら）
docker compose up

# コンテナ起動（バックグラウンド）
docker compose up -d

# 再ビルドして起動（Dockerfile を更新した場合）
docker compose up -d --build

# 再起動
docker compose restart <backend>

# コンテナ停止
docker compose down

# コンテナ + ボリュームを削除（DBリセット）
docker compose down -v


# backend コンテナに入る
docker compose exec backend bash

# db コンテナに入る
docker compose exec db bash


# 実行中のコンテナ一覧
docker ps

# 全コンテナ一覧（停止中も含む）
docker ps -a

# コンテナのログ確認
docker compose logs backend
docker compose logs -f backend   # リアルタイム表示

# イメージ一覧
docker images

# イメージ削除
docker rmi <image_id>

# ボリューム一覧
docker volume ls

# ボリューム削除
docker volume rm <volume_name>

# 未使用のボリューム/イメージを一括削除
docker system prune -f
docker system prune -a -f   # 未使用イメージも削除

# コンテナのログを確認
docker logs <container_id>

# リソース使用状況を確認
docker stats



2. alembicコマンド
# 新しいリビジョン作成（差分検知してファイルを生成）
docker compose exec backend alembic revision --autogenerate -m "message"

# マイグレーションを適用
docker compose exec backend alembic upgrade head

# 現在のバージョン確認
docker compose exec backend alembic current

# 過去のバージョンに戻す
docker compose exec backend alembic downgrade -1

3. dbコマンド
# DBコンテナに入らず、直接SQLを実行する
docker compose exec db psql -U postgres -d schedule_app -c "\dt"

# 特定のテーブルの構造を確認する（例: categories テーブル）
docker compose exec db psql -U postgres -d schedule_app -c "\d categories"

# 全てのテーブル一覧
docker compose exec db psql -U postgres -d schedule_app -c "\dt"

# インデックス一覧を確認する
docker compose exec db psql -U postgres -d schedule_app -c "\di"

# ユーザー一覧（DB内部のロール確認）
docker compose exec db psql -U postgres -c "\du"

# コンテナの中に入って psql を開く（終了は \q）
docker compose exec -it db psql -U postgres -d schedule_app

# ↑ psql 内でよく使うコマンド
# テーブル一覧
\dt
# インデックス一覧
\di
# テーブル構造確認
\d <テーブル名>
# psql 終了
\q
