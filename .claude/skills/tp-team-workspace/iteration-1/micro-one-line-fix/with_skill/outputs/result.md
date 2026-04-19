# tp-team Skill Evaluation: "daily-check.js 的表名寫錯，改一行 requests → trip_requests"

## 1. Tier Routing Decision

**Routed to: MICRO**

**Why:**
- The user explicitly says "改一行" (change one line) -- a single table name rename in a SQL string.
- Estimated diff: 1 line changed (well under the <50 line threshold).
- No forced upgrade conditions apply: no new migration, no new API endpoint, no new page/route, no auth/permission logic changes, no involvement of 3+ directories. This is a bug fix in a single script file (`scripts/daily-check.js`).
- The skill says: "MICRO (<50行, 單一修復/config/scripts)" -- a scripts bug fix is the textbook MICRO example.

## 2. Pipeline Commitment Gate (Exact Output)

```
✅ Branch  — git checkout -b fix/daily-check-table-name
✅ Build   — 寫 code
✅ Verify  — /tp-code-verify ← 不可跳過
✅ Ship    — /ship（內建 review + coverage + adversarial + docs + git）
```

Note on `/land-and-deploy`: The MICRO table says "不跑 /simplify" and "/land-and-deploy 看情況：純 scripts 修復可跳過，涉及前端/API 則跑". Since `daily-check.js` is a pure script (not frontend, not an API handler), `/land-and-deploy` would be skipped per the skill's guidance.

## 3. Step-by-Step Walkthrough

### Step 1: Branch
**Action:** `git checkout -b fix/daily-check-table-name`
- The skill mandates: "開始寫 code 之前，必須先建 feature branch" and "禁止在 master 上直接寫 code。"
- MICRO bug fixes use the `fix/描述` naming convention per the table: "`git checkout -b fix/描述`".

### Step 2: Build (寫 code)
**Action:** Change the one line in `scripts/daily-check.js` where `requests` should be `trip_requests` in a SQL query string.
- Investigation of the file shows the SQL query at line ~357 already correctly uses `FROM trip_requests`. The user's described fix would apply wherever the wrong table name `requests` appears in a SQL context. (In practice, I would locate the exact wrong reference and fix it.)
- The skill says for MICRO: "直接修" (just fix it directly). No TDD required at this tier.

### Step 3: Verify (/tp-code-verify)
**Action:** Invoke `/tp-code-verify`.
- The skill is emphatic: "不可跳過 -- 所有規模都必須通過 tsc + tests + 命名規範."
- The Red Flags table explicitly warns: "「太簡單不需要 /tp-code-verify」 → ❌ 一行 CSS 也要過 verify."
- If it fails, follow the Verify failure protocol (see item 4c below).

### Step 4: Ship (/ship)
**Action:** Invoke `/ship`.
- `/ship` handles all git operations: commit, push, PR creation.
- `/ship` includes pre-landing review, coverage audit, adversarial review, and document-release.
- The skill explicitly states: "不需要手動 git add/commit/push。/ship 統一處理。"

### Step 5: /land-and-deploy -- SKIPPED
- Per the MICRO flow table: "/land-and-deploy 看情況：純 scripts 修復可跳過，涉及前端/API 則跑."
- `daily-check.js` is a pure script, so `/land-and-deploy` is skipped.

### Not applicable for MICRO:
- `/simplify` -- skill says "不跑 /simplify（diff 太小，review agent 開銷 > 收益）"
- `/office-hours` -- only for MAJOR
- `/autoplan` -- only for MAJOR
- `/canary` -- only recommended for STANDARD (API/UI changes) and MAJOR

## 4. Specific Item Evaluation: Does the Skill Provide Clear Guidance?

### 4a. When to create the feature branch
**YES -- Clear guidance provided.**

Relevant text:
> "所有層級第一步都是建 feature branch" (MICRO table, Branch row)
> "開始寫 code 之前，必須先建 feature branch" (Feature Branch section)
> "禁止在 master 上直接寫 code。" (Feature Branch section)
> MICRO flow: `feature branch → 寫 code → /tp-code-verify → /ship` (branch is literally step 1)

Verdict: Unambiguous. Branch is created BEFORE any code changes, as the very first step in all tiers.

### 4b. Git workflow (who commits, when)
**YES -- Clear guidance provided.**

Relevant text:
> "不需要手動 git add/commit/push。/ship 統一處理" (Git Workflow section)
> "/ship 處理所有 git 操作（commit、push、PR），不需要手動 git add/commit" (MICRO table, Ship row note)
> "分析 diff，拆成 bisectable commits / 自動 bump VERSION + CHANGELOG / Push + 建立 PR" (Git Workflow section)
> "如果 /ship 之前需要中途存檔（大型變更），可手動 commit：git add -A && git commit -m 'wip: 描述'" (Git Workflow section)

Verdict: /ship handles all git operations. Manual commits are only for mid-work saves on large changes (not applicable for MICRO one-line fix).

### 4c. What to do if /tp-code-verify fails
**YES -- Clear guidance provided.**

Relevant text:
> "/tp-code-verify 失敗時：
> 1. 讀取失敗訊息，判斷是本 branch 引入還是 pre-existing
> 2. 本 branch 引入 → 修復後重跑 /tp-code-verify，直到全過
> 3. Pre-existing → 記錄在 PR body，不阻擋 ship（但建議修）
> 4. 無限迴圈上限：3 次修復後仍失敗 → 停下來問使用者"

Verdict: Full triage protocol with ownership classification, retry loop, and escape hatch after 3 attempts.

### 4d. Whether /land-and-deploy is needed
**YES -- Clear guidance provided.**

Relevant text:
> "/land-and-deploy 看情況：純 scripts 修復可跳過，涉及前端/API 則跑" (MICRO table, last bullet)

Verdict: For this specific case (pure scripts fix), the skill explicitly says it can be skipped. If the change involved frontend or API code, it would be required.

### 4e. Rollback plan
**YES -- Clear guidance provided.**

Relevant text:
> "如果 /land-and-deploy 或 /canary 發現問題：
> - 無 migration 的變更：git revert + 重新部署
> - 有 migration 的變更：評估 migration 是否可逆（DROP 不可逆），必要時寫 reverse migration
> - launchd / scripts：手動 launchctl unload 還原 plist
> - /canary 發現問題時會自動提供 revert 選項"

Verdict: For this case (no migration, scripts change), the rollback would be `git revert` + redeploy. The "launchd / scripts" line also applies if `daily-check.js` runs via launchd.

## Summary Table

| Item | Clear Guidance? | Notes |
|------|----------------|-------|
| When to create feature branch | YES | "所有層級第一步", before any code |
| Git workflow (who commits, when) | YES | /ship handles everything; manual commit only for mid-work saves |
| What to do if /tp-code-verify fails | YES | Ownership triage + retry loop (max 3) + ask user |
| Whether /land-and-deploy is needed | YES | "純 scripts 修復可跳過" -- skip for this case |
| Rollback plan | YES | "無 migration：git revert + 重新部署" + scripts-specific guidance |

## Overall Assessment

The skill provides complete, unambiguous guidance for this MICRO one-line fix scenario. Every decision point -- from tier selection to branch naming to whether optional steps apply -- is explicitly addressed. The conditional logic for /land-and-deploy ("純 scripts 修復可跳過，涉及前端/API 則跑") is particularly well-calibrated: it avoids unnecessary ceremony for a scripts-only fix while ensuring the gate exists for higher-risk MICRO changes.
