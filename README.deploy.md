⸻

📋 VPS導入 進捗管理表

⸻

# ✅ 契約前チェック表（準備フェーズ）

1. アプリ側の準備
	•	本番用 Dockerfile.prod 作成
	•	backend: gunicorn で起動
	•	frontend: Nginx で静的ファイル配信
	•	docker-compose.override.yml（本番用）作成
	•	DB 非公開化（ports: []）
	•	volume マウント削除
	•	restart ポリシーを always に変更
	•	.env.prod 準備
	•	DBユーザー名・パスワード・DB名
	•	APIポート番号
	•	JWT_SECRET_KEY, DEBUG=false
	•	マイグレーション手順確認（Alembic / Django Migrate / Rails db:migrate）

⸻

2. Webサーバー設定準備
	•	nginx.conf 作成
	•	/ → frontend (静的ファイル)
	•	/api/ → backend (FastAPI, Gunicorn)
	•	HTTPS 化用の設定雛形を用意
	•	Let’s Encrypt 事前準備
	•	certbot の導入手順を控える

⸻

3. OS / VPS側を想定した準備
	•	初期設定手順書ドラフト作成
	•	apt update && apt upgrade
	•	一般ユーザー作成 & sudo付与
	•	SSH鍵ログイン設定（パスワードログイン禁止）
	•	UFW（ファイアウォール）設定（22, 80, 443 のみ許可）
	•	Docker / Docker Compose インストール手順確認

⸻

4. デプロイフロー準備
	•	手動デプロイ手順書作成
	•	git clone → .env.prod 配置
	•	docker compose up -d --build
	•	DBマイグレーション実行
	•	動作確認（API / Frontend）
	•	CI/CD 方針決定
	•	手動運用で始めるか
	•	GitHub Actions で自動化するか
	•	GitHub Actions ワークフロー雛形（必要なら）
	•	VPS へ SSH 接続
	•	git pull && docker compose up -d --build 自動化

⸻

5. 想定トラブル対応準備
	•	ロールバック手順確認
	•	docker compose down && docker compose up -d <前のイメージ>
	•	pg_dump による DB バックアップ手順確認
	•	ログ確認手順整理
	•	docker compose logs backend
	•	docker compose logs frontend
	•	docker compose logs db

⸻

6. タイムマネジメント
	•	VPS契約後にやることを日次で計画
	•	Day1: OS初期設定 → Docker導入 → 手動デプロイ
	•	Day2: Nginx + HTTPS 導入
	•	Day3: CI/CD 導入

⸻

🚀 契約後チェック表（実行フェーズ）

Day 1: VPS初期セットアップ & 手動デプロイ
	•	VPS契約 & SSHログイン確認
	•	OSアップデート
	•	sudo apt update && sudo apt upgrade -y
	•	一般ユーザー作成 & sudo権限付与
	•	SSH鍵認証設定（パスワードログイン無効化）
	•	UFWファイアウォール設定（22, 80, 443 のみ許可）
	•	Docker / Docker Compose インストール
	•	git clone → .env.prod 配置
	•	docker compose -f docker-compose.yml -f docker-compose.override.yml up -d --build 実行
	•	DBマイグレーション実行
	•	APIとフロントが動作しているかブラウザで確認

⸻

Day 2: Webサーバー（Nginx + HTTPS）
	•	Nginx インストール & systemd 登録
	•	nginx.conf を /etc/nginx/sites-available に配置 & symlink
	•	nginx -t で構文確認
	•	certbot インストール
	•	Let’s Encrypt 証明書を取得 (certbot --nginx -d example.com)
	•	HTTPSアクセス確認（自動リダイレクトも含む）

⸻

Day 3: CI/CD 導入
	•	GitHub Actions secrets に VPS の SSH鍵設定
	•	ワークフロー作成
	•	on: push (main ブランチ)
	•	VPSへSSH接続
	•	git pull && docker compose -f ... up -d --build 実行
	•	push したら自動デプロイされるか確認
	•	不具合時に手動ロールバックできることを確認

⸻



🌐 インフラ選定理由（無料VPSプラン比較）

今回のデプロイ先として XServer 無料VPS を利用するにあたり、2GBプランと4GBプランを比較しました。

項目	2GBプラン（4日更新）	4GBプラン（2日更新）
メモリ	2GB（FastAPI + React + Postgresには十分）	4GB（余裕あり、負荷耐性が高い）
CPU	2コア	3コア
更新頻度	4日に1回 → 更新忘れにくい	2日に1回 → 更新忘れリスク大
安定性（稼働率）	◎ → 落ちにくい	△ → 更新忘れで停止しやすい
性能	○ → 数人〜十数人まで問題なし	◎ → 数十人アクセスでも比較的安定
運用の楽さ	◎ → メンテナンス頻度少なく、実務で扱いやすい	△ → 面接前に落ちている可能性が高くリスクあり
用途の適合性	ポートフォリオ公開・少人数の使用感テストに最適	ストレステストや負荷検証には良いが運用には不安

✅ 選定結論
	•	ポートフォリオ公開が主目的
→ 2GBプランを選定。
	•	理由: 「安定してアクセス可能」であることが最重要。
	•	FastAPI + React + PostgreSQL を稼働させるには十分なスペック。
	•	数人〜十数人規模の利用を想定しており、性能上の問題なし。

⸻


# アプリ起動方法
docker compose -f docker-compose.prod.yml up -d

# リポジトリの作成
# ローカルのプロジェクトで
git init
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git add .
git commit -m "first commit"
git push -u origin main