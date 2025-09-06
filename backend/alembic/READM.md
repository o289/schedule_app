Generic single-database configuration.


**今回遭遇したエラーと対処法**

# ❌ 空リビジョンしか生成されない
	•	原因: engine_from_config + alembic.ini に sqlalchemy.url が未設定
	•	解決: create_engine(settings.DATABASE_URL) を利用

⸻

# ❌ server_default が出力されない
	•	原因: default=uuid.uuid4 は Python 側の処理で、DBのデフォルトとしては扱われない
	•	解決:
	•	モデルで server_default=sa.text("gen_random_uuid()") を指定
	•	Alembic の compare_server_default=True を有効化
	•	それでも出ない場合は マイグレーションファイルを手で修正

⸻

# ❌ DuplicateTable / DuplicateIndex (ix_users_email already exists)
	•	原因: モデルで unique=True, index=True を両方指定 → Alembic が二重にインデックス生成
	•	解決: unique=True のみ指定すればOK（Postgresはuniqueで自動的にインデックス作成）

⸻

# ❌ DBをリセットしてもエラーが残る
	•	原因: Alembic のマイグレーションファイル内に二重処理 (create_index) が残っている
	•	解決:
	•	DBをリセット（docker compose down -v）
	•	マイグレーションファイルを修正して再実行


3. 運用ポイント
	•	モデルを修正したら必ず：
        3-1	alembic revision --autogenerate -m "..."
        3-2	ファイルをレビュー（自動生成は完全ではない！）
        3-3	alembic upgrade head
	•	最初のマイグレーションは手直し必須になることが多い（UUID, server_default, indexなど）
	•	学習MVPでは DBリセットで解決してOK、本番では必ず差分だけを適用すること