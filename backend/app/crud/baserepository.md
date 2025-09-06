# BaseRepository 取扱説明書

本リポジトリは、SQLAlchemy を利用した CRUD 処理を共通化するための基底クラスです。  
FastAPI などのアプリケーションで、モデルごとの Repository を実装する際の土台として利用します。

---

## ✅ 目的
- CRUD の共通処理をまとめて重複を減らす
- 例外発生時やデータ未存在時の返り値を統一する
- ビジネスロジックは各モデル専用の Repository に記述し、BaseRepository は最低限の共通処理のみを担当する

---

## ✅ 使用方法
1. Repository クラスを作成し、BaseRepository を継承する
2. `db` (Session) と `model` (SQLAlchemy モデルクラス) を渡して初期化する
3. CRUD メソッドを呼び出す

---

## ✅ 実装されているメソッド

### add(obj)
- 新規オブジェクトを追加して commit する
- 成功時 → `obj` を返す
- 失敗時 → `None`

### get(id)
- 主キーで検索
- 存在すれば該当オブジェクトを返す
- 存在しなければ `None`

### list()
- 全件取得
- 存在しなければ空リスト `[]` を返す

### delete(obj)
- 指定オブジェクトを削除して commit
- 成功時 → `True`
- obj が `None` または失敗時 → `False`

### update(obj)
- オブジェクトの属性変更を commit / refresh
- 成功時 → 更新後の `obj`
- obj が `None` または失敗時 → `None`

---

## ✅ 注意点
- **例外処理** は Repository 内ではシンプルに `None / False` を返すのみ  
  - Web API で利用する際は、ルーター層で `404` や `400` に変換する  
- **ビジネスロジック**（例: パスワードハッシュ化, Todo 完了時の done_at 付与）は BaseRepository には書かない  
  - 各モデル専用の Repository に実装する  

---

## ✅ 想定される利用例
```python
db = Depends(get_db)
repo = UserRepository(db)

# Create
user = repo.add(new_user)

# Read
user = repo.get(user_id)
if not user:
    raise HTTPException(status_code=404)

# List
users = repo.list()

# Update
user.name = "new name"
repo.update(user)

# Delete
repo.delete(user)

```



