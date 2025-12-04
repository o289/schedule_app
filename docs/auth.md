**📌 学習観点（ここを押さえよう！）**
	1.	主キー（PK）: primary_key=True でユニークな識別子を作る
	2.	ユニーク制約: email には unique=True をつける
	3.	リレーション: 片側に relationship()、もう片側に ForeignKey を書く
	4.	カスケード: cascade="all, delete" で親削除時に子も消える


**2つのUUIDの違い**
DBのカラム型 → sqlalchemy.dialects.postgresql.UUID
Pythonのデータ型 → uuid.UUID

**サインアップとログインで違うPydanticモデル（スキーマ）を作る理由**
✅ 理由1: 入力データが違う
	•	サインアップ（新規登録）
	•	email + password + name（プロフィール情報も含むことが多い）
	•	ログイン
	•	email + password だけ

👉 つまり 受け取るデータの項目が違うので、1つのスキーマで兼用すると無駄な項目が出てきてしまいます。

⸻

✅ 理由2: 出力データが違う
	•	サインアップ
	•	登録したユーザー情報（id, email, nameなど）を返す
	•	パスワードは含めない
	•	ログイン
	•	ユーザー情報ではなく JWTトークン を返す
	•	例: { "access_token": "...", "token_type": "bearer" }

👉 出力の形が根本的に違うので、別モデルに分けた方が安全・明確。

⸻

✅ 理由3: セキュリティのため

もし「サインアップとログインを同じスキーマ」で作ったら、こんな問題が起きます👇
	•	サインアップ用スキーマにnameがあるのに、ログイン時もnameが要求されてしまう
	•	出力モデルを共用したら、ログイン後にユーザー情報を返すつもりがないのに返してしまう

👉 「入力に余計なフィールドがある」＝攻撃者がそこにデータを突っ込んで悪用できる余地になるので危険。

⸻

✅ 理由4: 責務を分離して可読性を上げる
	•	UserCreate … 新規ユーザー登録のためのスキーマ
	•	UserLogin … ログインのためのスキーマ
	•	TokenResponse … ログイン成功時の返却用

👉 こう分けることで、コードを読んだ人が「これはサインアップ用」「これはログイン用」とすぐ理解できる。

⸻

🎯 まとめ
	•	入力項目が違う（Signup: email+password+name / Login: email+password）
	•	出力項目が違う（Signup: ユーザー情報 / Login: トークン）
	•	セキュリティ的に安全（余計な項目を受け取らない）
	•	責務分離で可読性UP

だから「サインアップとログインで別モデルを作る」必要があるんです💡


**学習**
1. 共通クラス (BaseRepository) を作る
	•	例: backend/app/crud/base.py
	•	add / delete / get / list / update など「全モデルで共通の処理」をまとめる

ヒント：
	•	__init__ で db: Session と model: Type[Base] を受け取る
	•	self.db と self.model を使えばどのモデルでも使える

⸻

2. モデルごとのリポジトリを作る
	•	例: backend/app/crud/user.py に UserRepository を定義
	•	BaseRepository を継承して get_by_email() などモデル固有の処理を追加

ヒント：
	•	User なら「メール検索」や「認証処理」
	•	Todo なら「完了済み一覧」「復元処理」

⸻

3. サービス層やAPI層から呼び出す
	•	APIルーター内で
	•	repo = UserRepository(db)
	•	repo.add(user)
	•	repo.get_by_email(email)
のように利用する

⸻

✅ メリット（整理）
	•	共通処理は BaseRepository に集約 → 1か所修正で全体に反映
	•	モデル固有処理はサブクラスに閉じ込める → 責務が明確
	•	IDE補完が効くので 開発効率アップ
	•	将来的に テストが書きやすい（依存注入でモック化可能）

⸻

🎯 学習ポイント
	•	「BaseRepository」は 共通ルール
	•	「UserRepository / TodoRepository」などは 個別のビジネスルール
	•	責務を切り分けることが 保守性UPのカギ
