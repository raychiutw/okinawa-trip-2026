# Git 規則

- 完成修改後主動 commit，**不要自動 push**，由使用者手動觸發
- Commit 訊息繁體中文，格式：
  ```
  簡述改了什麼

  - 細節說明

  Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
  ```
- pre-commit hook 已建立在 `.git/hooks/pre-commit`，會自動根據 staged 檔案跑對應測試
- push 後檢查本次變更是否影響專案規則或架構，若有則同步更新 `CLAUDE.md` 與 `openspec/config.yaml`
