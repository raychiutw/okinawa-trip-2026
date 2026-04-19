# tp-team Skill Evaluation: Major Architecture Change

**User Request:** "把 cron 輪詢改成事件驅動 + SSE 即時推送，需要新 API endpoint、新 hook、migration、launchd job"

---

## 1. Tier Routing: MAJOR

**Routed to: MAJOR (>500 lines)**

This request triggers multiple forced upgrade conditions from the skill's "強制升級條件（不論行數）" section (lines 39-45):

| Forced Upgrade Condition | Triggered? | Reason |
|---|---|---|
| 新增 migration → 至少 STANDARD | YES | User explicitly says "migration" is needed |
| 新增 API endpoint → MAJOR | YES | User explicitly says "新 API endpoint" for SSE |
| 新增頁面/路由 → MAJOR | NO | No new page mentioned |
| 修改認證/權限邏輯 → MAJOR | NO | Not mentioned |
| 涉及 3 個以上目錄 → 至少 STANDARD | YES | Would touch functions/api/, src/hooks/, migrations/, scripts/ (launchd), plus likely src/components/ and src/lib/ -- at least 4-6 directories |
| 引入新架構模式（SSE、WebSocket、事件驅動等）→ MAJOR | YES | User explicitly says "事件驅動 + SSE 即時推送" -- SSE and event-driven are both called out by name in the condition |

**Summary:** 4 out of 6 forced upgrade conditions trigger. Even if the estimated line count were under 50, any single one of "新增 API endpoint", "新增 migration", or "引入新架構模式（SSE...事件驅動等）" individually forces MAJOR. This is an unambiguous MAJOR routing.

---

## 2. Pipeline Commitment Gate

Per the skill (lines 200-209), the exact MAJOR Pipeline Commitment Gate output:

```
✅ Branch  — git checkout -b feat/sse-event-driven
✅ Think   — /office-hours（架構變更強烈建議）
✅ Plan    — /autoplan → 三審，plan 存 ~/.gstack/projects/
✅ Build   — 寫 code（TDD）+ /simplify
✅ Verify  — /tp-code-verify ← 不可跳過
✅ Ship    — /ship（內建 review + coverage + adversarial + docs + git）
✅ Deploy  — /land-and-deploy → /canary（強烈建議）
```

---

## 3. Step-by-Step Walkthrough

### Step 1: Branch
- Run `git checkout -b feat/sse-event-driven`
- Skill says: "開始寫 code 之前，必須先建 feature branch" (line 116) and "禁止在 master 上直接寫 code" (line 120)

### Step 2: Think -- /office-hours
- Invoke `/office-hours` to evaluate the architecture change
- Skill says for MAJOR: "架構變更強烈建議" (line 95)
- This is an architecture change (cron polling to event-driven + SSE), so /office-hours is strongly recommended
- Would explore: Is SSE the right choice vs WebSocket? Does Cloudflare Workers support SSE well? What are the failure modes? How does this interact with the existing cron-based system?

### Step 3: Plan -- /autoplan
- Invoke `/autoplan` which runs CEO + Eng + Design three-way review
- Plan output stored in `~/.gstack/projects/` (line 96)
- The plan would need to cover: new SSE endpoint design, event emission points, migration schema, hook API, launchd configuration, backward compatibility

### Step 4: Build -- Write Code (TDD) + /simplify
- **Implementation order** per skill (lines 104-109):
  1. **Migration** (DB schema first) -- e.g., new table for event log or SSE connection tracking, migration 0024+
  2. **API handler / backend logic** -- new SSE endpoint in `functions/api/`, event emission logic replacing cron polling
  3. **Frontend hooks + components** -- new `useSSE` or `useEventStream` hook in `src/hooks/`, update components that currently depend on polling
  4. **Scripts / infra** -- launchd job plist for the event-driven scheduler, replacing or augmenting existing cron
  5. **Tests** -- or TDD interspersed at each step
- Follow TDD: write tests first, then implementation
- After build, invoke `/simplify` for 3-agent parallel review
- If `/simplify` finds issues: fix them, do NOT re-run `/simplify`, proceed to Verify (lines 143-146)

### Step 5: Verify -- /tp-code-verify
- Invoke `/tp-code-verify` -- this is mandatory ("不可跳過", line 213)
- Runs tsc + tests + naming conventions
- If it fails: read failure message, determine if introduced by this branch or pre-existing (lines 137-140)
- Branch-introduced failures: fix and re-run, up to 3 times before asking user (line 140)
- Pre-existing failures: note in PR body, do not block ship

### Step 6: Ship -- /ship
- Invoke `/ship` which handles: review + coverage audit + adversarial review + document-release + TODOS + commit + push + PR creation
- `/ship` includes scope drift detection: compares stated intent vs actual diff (line 217)
- No manual git add/commit/push needed (lines 124-125)

### Step 7: Deploy -- /land-and-deploy
- Invoke `/land-and-deploy` to merge PR + deploy + verify production health

### Step 8: Monitor -- /canary
- Invoke `/canary` -- "有 migration 或新 endpoint 時強烈建議" (line 102)
- This change has BOTH migration AND new endpoint, so /canary is strongly recommended
- Monitors live app for console errors, performance regressions, page failures

### Multi-Session Handling
- This is a MAJOR change likely spanning multiple sessions
- Use `/checkpoint` to save progress when context approaches limit (lines 168-171)
- Principle: "一個 session 完成一個完整步驟" -- do not interrupt mid-Build (line 177)
- If no `/checkpoint` available, manually record: completed steps, current pipeline stage, next action (lines 173-176)

### Rollback Plan (if /land-and-deploy or /canary finds problems)
Per lines 149-155:
- **Migration component:** Evaluate if migration is reversible (DROP is not). Write reverse migration if needed.
- **New endpoint:** `git revert` + redeploy for the code portion
- **launchd job:** `launchctl unload` the plist to restore previous state
- `/canary` provides automatic revert option if problems detected (line 155)

---

## 4. Specific Guidance Audit

### /office-hours recommendation level for architecture changes
**YES -- clear guidance provided.**

> Line 95: "**架構變更強烈建議**，純重構可跳過"
> Line 229 (Red Flags table): "「架構大改不需要 /office-hours」 | ❌ 架構變更強烈建議跑 Think 階段"

The skill uses "強烈建議" (strongly recommended) rather than "必須" (required). It is not mandatory, but skipping it for architecture changes is listed as a Red Flag. This is a soft-mandatory: the skill says you SHOULD do it and flags the opposite as a mistake, but technically allows skipping for "純重構".

---

### Where /autoplan output is stored
**YES -- clear guidance provided.**

> Line 96: "CEO + Eng + Design 三審，plan 存在 `~/.gstack/projects/`"
> Line 204 (Pipeline Gate): "/autoplan → 三審，plan 存 ~/.gstack/projects/"

Explicitly stated twice: plans are stored in `~/.gstack/projects/`.

---

### Implementation order for multi-component changes
**YES -- clear guidance provided.**

> Lines 104-109:
> "**MAJOR 實作順序指引：**
> 1. Migration（DB schema 先行）
> 2. API handler / backend logic
> 3. Frontend hooks + components
> 4. Scripts / infra（launchd、cron 等非 web 部署的元件）
> 5. Tests（或 TDD 穿插在每個步驟）"

This directly addresses the user's request which involves all four categories: migration, new API endpoint, new hook, and launchd job. The ordering is explicit and numbered.

---

### Multi-session handoff mechanism
**YES -- clear guidance provided.**

> Lines 166-177:
> "## Multi-Session 交接（MAJOR 限定）
> MAJOR 變更可能跨多個 session。當 context 接近上限時：
> 1. 用 `/checkpoint` 儲存進度（自動記錄 git state + 決策 + 剩餘工作）
> 2. 下個 session 開始時，`/checkpoint` 自動恢復 context
> 3. 如果沒有 `/checkpoint`，手動記錄：
>    - 哪些步驟已完成
>    - 目前在 pipeline 哪個階段
>    - 下一步要做什麼
> **原則：一個 session 完成一個完整步驟。** 不要在 Build 做到一半時中斷。"

Also reinforced in the iron rules (line 218): "**context 快滿了** → `/checkpoint` 或手動存進度，下個 session 接續"

---

### /canary recommendation level
**YES -- clear guidance provided.**

> Line 102: "有 migration 或新 endpoint 時**強烈建議**"
> Line 208 (MAJOR Pipeline Gate): "/land-and-deploy → /canary（強烈建議）"
> Line 83 (STANDARD): "/canary（API 或 UI 變更建議跑）" -- uses "建議" (recommended) for STANDARD vs "強烈建議" (strongly recommended) for MAJOR

The skill differentiates recommendation levels: "建議" for STANDARD, "強烈建議" for MAJOR. For this change (which has both migration and new endpoint), it is "strongly recommended".

---

### Rollback plan for migration + new endpoints
**YES -- clear guidance provided.**

> Lines 149-155:
> "### Rollback 計畫
> 如果 `/land-and-deploy` 或 `/canary` 發現問題：
> - **無 migration 的變更：** `git revert` + 重新部署
> - **有 migration 的變更：** 評估 migration 是否可逆（DROP 不可逆），必要時寫 reverse migration
> - **launchd / scripts：** 手動 `launchctl unload` 還原 plist
> - `/canary` 發現問題時會自動提供 revert 選項"

Covers all three rollback scenarios relevant to this change: migration rollback (with caveat about irreversible DDL), code revert for endpoints, and launchd unload for the job. The guidance is specific and actionable.

---

### Mid-build scope handling
**YES -- clear guidance provided.**

> Line 47: "**中途升級：** 實作過程中發現需要 migration 或 scope 超出預期，立即重新評估層級並輸出新的 Pipeline Gate。"
> Line 219 (Iron Rule #6): "**中途發現 scope 超出** → 重新評估層級，升級流程"

The skill has an explicit mechanism: if during build you discover the scope is larger than expected, you MUST stop, re-evaluate the tier, and output a new Pipeline Commitment Gate. This prevents scope creep without process coverage.

---

## Summary Table

| Guidance Item | Clear? | Skill Reference |
|---|---|---|
| /office-hours for architecture | YES | Line 95, Line 229 -- "強烈建議" + Red Flag |
| /autoplan output location | YES | Line 96, Line 204 -- `~/.gstack/projects/` |
| Implementation order | YES | Lines 104-109 -- numbered 1-5 sequence |
| Multi-session handoff | YES | Lines 166-177 -- `/checkpoint` + manual fallback + session boundary rule |
| /canary recommendation | YES | Line 102, Line 208 -- "強烈建議" for migration/new endpoint |
| Rollback plan | YES | Lines 149-155 -- per-component rollback strategies |
| Mid-build scope handling | YES | Line 47, Line 219 -- immediate re-evaluation + new Gate |

**Result: 7/7 items have clear, actionable guidance in the skill.**
