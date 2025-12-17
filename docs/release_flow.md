# 🚀 リリースブランチ運用ガイド（with リファクタリングルール）

本ドキュメントは、`main` ブランチを常に安定させながら  
複数の開発ブランチを効率的に統合・リリース・管理するための運用ルールを定義します。

## 🎯 目的

1. **main に直接マージする前段階を設けること**
   - 機能や修正を一度まとめてテスト・検証できる「中間ステージ」を持つ。
2. **リリースを `v1.0.0` のようにバージョン管理すること**
   - リリース履歴を明確化し、どの変更がどのバージョンに含まれるか追跡可能にする。
3. **リファクタリング用の安全なブランチ運用**
   - 大きな構造変更やリファクタリングを隔離して実施できる環境を整備する。

## 🧩 ブランチ構成（役割と命名規則）

| ブランチ種別 | 命名例                   | 目的・役割                                                                       |
| ------------ | ------------------------ | -------------------------------------------------------------------------------- |
| **main**     | `main`                   | 本番運用用。常に安定した状態を維持する。直接コミット禁止。                       |
| **release**  | `release/v1.0.0`         | リリース候補の統合・検証用。複数のブランチをまとめて安定化。                     |
| **feature**  | `feature/add-login`      | 新機能開発用。完了後は `release/*` に統合。                                      |
| **improve**  | `improve/ui-ux`          | 機能改善・使い勝手向上用。既存機能の品質や UX を改善するが、仕様変更は行わない。 |
| **fix**      | `fix/calendar-bug`       | バグ修正用。軽微な修正は `release/*` に直接 PR しても可。                        |
| **refactor** | `refactor/backend-logic` | 構造改善・コード整理専用。動作仕様を変えずに品質を高める。                       |

> 💡 バージョン命名は [Semantic Versioning](https://semver.org/lang/ja/) に従う  
> `v<メジャー>.<マイナー>.<パッチ>`  
> 例：`v1.0.0`, `v1.0.1`, `v1.1.0`

### 🧱 運用フロー

## ① リリースブランチの作成

`main` の最新状態からリリースブランチを作成します。

```bash
git checkout main
git pull origin main
git checkout -b release/v1.0.0
git push origin release/v1.0.0
```

このブランチは、main へ一括取り込み前の安定化段階として機能します。

## ② 各種ブランチの作業内容

🧩 feature ブランチ
• 新機能追加用。
• 完成後は release/v1.0.0 へ PR。

git checkout -b feature/add-login main

# コーディング・コミット

git push origin feature/add-login

# PR: base=release/v1.0.0, compare=feature/add-login

🧩 fix ブランチ
• 既存機能のバグ修正用。
• 小さな修正なら release/\* へ直接 PR して OK。

git checkout -b fix/typo-schedule main
git push origin fix/typo-schedule

# PR: base=release/v1.0.0

🧩 refactor ブランチ
• 機能仕様を変えずに内部構造を改善。
• リリースブランチとは別に作成し、安定版に反映する前に検証を行う。

git checkout -b refactor/backend-curd main

# コード整理・リネーム・責務分離など

git push origin refactor/backend-curd

# PR: base=release/v1.0.0 or main

⚠️ refactor ブランチでの仕様変更は禁止。
動作は同じまま、読みやすさ・保守性の改善に専念する。

## ③ リリースブランチでの統合

複数の feature / fix / refactor ブランチを release/v1.0.0 にマージします。

```bash
git checkout release/v1.0.0
git merge feature/add-login
git merge fix/schedule-bug
git merge refactor/backend-curd
```

または GitHub で PR として統合します：

base: release/v1.0.0
compare: feature/add-login

💬 この段階では「最終テスト・微修正・確認」のみ行い、新機能の追加は禁止。

## ④ テスト・確認フェーズ

リリース候補の安定性を検証します。

pytest
npm run build

    •	テストが全て通ることを確認。
    •	本番想定の環境で最終チェック。

## ⑤ main への反映（まとめてマージ）

すべての確認が終わったら、release/v1.0.0 を main にマージします。

git checkout main
git pull origin main
git merge --no-ff release/v1.0.0
git push origin main

✅ main の履歴は「リリース単位」で整理され、常に安定状態が維持されます。

## ⑥ タグ付け（バージョン管理）

git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags

    •	v1.0.0 のタグが正式リリースの目印になります。
    •	GitHubの「Releases」ページに自動的にバージョンが作成されます。

## ⑦ リリースブランチの削除

リリースが完了したら、不要になったリリースブランチを削除します。

git push origin --delete release/v1.0.0
git branch -d release/v1.0.0

次回リリース時は release/v1.0.1 を新規作成。

🛡️ GitHub 保護ルール（推奨設定）

設定項目 main release/\* feature/fix/refactor
Require pull request before merging ✅ 有効 ✅ 有効 ❌ 無効（自由開発）
Require status checks before merging ✅ 有効 ✅ 有効 ❌ 任意
Require approvals ✅ 有効（1 名以上） ✅ 任意 ❌ 無効
Prevent force pushes ✅ 有効 ✅ 有効 ❌ 任意
Allow deletions ❌ 無効 ✅ 有効（リリース後削除可） ✅ 有効

🧭 全体の流れ（図解）

feature/add-login
feature/add-calendar
fix/button-bug
refactor/backend-curd
│
▼
release/v1.0.0
├── 統合
├── テスト
├── 微調整
▼
main ←── 1 回のマージ
▼
タグ付け: v1.0.0
▼
GitHub Releases

🧠 この運用のメリット

目的 効果
main に直接マージしない 常に安定した main を維持
中間ステージを設ける 一括テスト・デプロイ確認が容易
v1.0.0 形式の管理 リリース履歴が明確に追跡可能
refactor ブランチ導入 大規模整理を安全に実施可能
release 削除ルール リポジトリをクリーンに保てる

📌 ルール要約

1. リリースしたいタイミングで main から release/vX.Y.Z を作成
2. 各 feature / fix / refactor ブランチを release/\* に統合
3. リリースブランチ上でテスト・安定化
4. 問題なければ main に一括マージ
5. タグ（vX.Y.Z）を付けてリリース確定
6. リリースブランチを削除して整理

✅ 実務 Tips
• CI を release/_ と main の両方で動かすと安心。
• refactor/_ ブランチは別環境でテストできるようにするのがおすすめ。
• main は「本番反映済みの安定コード」だけを保つ。
• リリースノートを GitHub Releases に記録すると履歴が明快になる。
