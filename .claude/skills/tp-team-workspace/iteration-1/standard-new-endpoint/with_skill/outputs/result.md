# tp-team Skill Evaluation: "新增 GET /api/trips/:id/weather endpoint"

## 1. Tier Routing Decision

**Routed to: MAJOR**

**Why:** The skill defines a set of "forced upgrade conditions" (line 39-46):

> **強制升級條件（不論行數）：**
> - 新增 API endpoint → MAJOR

The user's request explicitly states "新增 GET /api/trips/:id/weather endpoint", which is a new API endpoint. Regardless of estimated line count, this triggers the forced upgrade to MAJOR tier.

Even without the forced upgrade rule, analysis suggests this would involve:
- A new route handler file at `functions/api/trips/[id]/weather.ts`
- Weather fetching logic (likely in `src/lib/weather`)
- Integration tests (requested explicitly)
- Possibly a weather data cache table (migration)

This would likely land in the 200-400 line range (STANDARD by line count), but the forced upgrade rule overrides to MAJOR.

---

## 2. Pipeline Commitment Gate

Per the skill's MAJOR template (lines 200-209):

```
✅ Branch  — git checkout -b feat/trip-weather-endpoint
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
Create a feature branch before any code changes.
```bash
git checkout -b feat/trip-weather-endpoint
```
The skill forbids working on master: "禁止在 master 上直接寫 code" (line 121).

### Step 2: Think (/office-hours)
Invoke `/office-hours` to discuss architecture decisions:
- Where does the weather data come from? (External API? Cached in D1?)
- Does this need a new migration for a weather cache table?
- Rate limiting / API key management for the weather provider
- How does this integrate with existing trip date structure (`trip_days`)?
- Response format: raw weather data or UI-ready summary?

The skill says this is "strongly recommended" for architecture changes. A new API endpoint with an external dependency qualifies.

### Step 3: Plan (/autoplan)
Invoke `/autoplan` which runs CEO + Eng + Design three-party review.
- The plan is saved to `~/.gstack/projects/`
- This would produce an ordered implementation plan

### Step 4: Build (TDD + code)
Follow the MAJOR implementation order (lines 104-109):
1. **Migration** (if weather cache table needed) -- DB schema first
2. **API handler** -- `functions/api/trips/[id]/weather.ts` with GET handler
3. **Backend logic** -- weather fetching, caching, date mapping in `src/lib/weather`
4. **Frontend** (if any hooks/components needed for display)
5. **Tests** -- integration tests as requested, TDD interspersed throughout

TDD workflow: write integration tests first that define the expected behavior of `GET /api/trips/:id/weather`, then implement to make them pass.

### Step 5: Simplify (/simplify)
Invoke `/simplify` after build is complete. Three agents review in parallel for:
- Code reuse opportunities
- Quality issues
- Efficiency improvements

Fix all reasonable findings, then proceed (no need to re-run /simplify).

### Step 6: Verify (/tp-code-verify)
Invoke `/tp-code-verify` -- mandatory for all tiers. Runs:
- `tsc` (TypeScript type checking)
- Test suite
- Naming convention validation

If it fails: determine if the failure is from this branch or pre-existing, fix up to 3 times, then escalate to user.

### Step 7: Ship (/ship)
Invoke `/ship` which handles:
- Diff analysis and bisectable commits
- VERSION bump + CHANGELOG update
- Pre-landing review (code review)
- Coverage audit
- Adversarial review
- Documentation update
- Push + PR creation

No manual `git add/commit/push` needed.

### Step 8: Deploy (/land-and-deploy)
Invoke `/land-and-deploy` to merge the PR and verify production deployment.

### Step 9: Monitor (/canary)
Invoke `/canary` for post-deploy monitoring. The skill says this is "strongly recommended" when there is a new endpoint (line 102):
> 有 migration 或新 endpoint 時**強烈建議**

Monitor for console errors, performance regressions, and page failures.

### Mid-Build Checkpoint
If the build spans multiple sessions (likely for MAJOR), use `/checkpoint` to save progress. The skill advises: "一個 session 完成一個完整步驟" (line 177).

---

## 4. Specific Guidance Assessment

### When to create the feature branch
**YES** -- Clear guidance provided.

> "所有層級第一步都是建 feature branch" (line 58)

> "開始寫 code 之前，必須先建 feature branch" (line 115-118)

> "禁止在 master 上直接寫 code。" (line 121)

The skill is unambiguous: branch creation is the very first step of every tier, before any code is written.

---

### TDD workflow mentioned
**YES** -- Clear guidance provided.

> "寫 code（TDD：先寫測試再寫實作）" (line 76, 97)

For STANDARD and MAJOR tiers, TDD is explicitly called out. The Build column in both tables says "TDD：先寫測試再寫實作" (write tests first, then implementation). The MAJOR implementation order (lines 104-109) also mentions "Tests（或 TDD 穿插在每個步驟）" as step 5.

---

### What /simplify does and what to do with findings
**YES** -- Clear guidance provided.

> "/simplify — 3 agent 平行審查" (line 79)

> "1. `/simplify` 的 3 個 agent 回報問題
> 2. 修復所有合理的建議（忽略 false positive）
> 3. **不需要重跑 /simplify**，直接進入 `/tp-code-verify`
> 4. `/tp-code-verify` 會重新驗證所有修改" (lines 143-147)

The skill defines what /simplify is (3 parallel review agents), what to do with findings (fix reasonable ones, ignore false positives), and explicitly states you do NOT need to re-run /simplify after fixes.

---

### /canary recommended for API changes
**YES** -- Clear guidance provided.

> "/canary（API 或 UI 變更建議跑）" (line 83, in STANDARD table)

> "有 migration 或新 endpoint 時**強烈建議**" (line 102, in MAJOR table)

For STANDARD, /canary is "recommended" for API or UI changes. For MAJOR (which is the tier this request falls into), /canary is "strongly recommended" when there are migrations or new endpoints. This request has a new endpoint, so /canary is strongly recommended.

---

### Mid-build scope upgrade if migration discovered
**YES** -- Clear guidance provided.

> "**中途升級：** 實作過程中發現需要 migration 或 scope 超出預期，立即重新評估層級並輸出新的 Pipeline Gate。" (line 47)

> "**scope drift detection** — `/ship` 內建，比對 stated intent vs actual diff" (line 217)

> "**中途發現 scope 超出** → 重新評估層級，升級流程" (line 219)

The skill addresses this at three different points. If during build you discover a migration is needed (e.g., a weather_cache table), you must immediately re-evaluate the tier and output a new Pipeline Commitment Gate. Since this request is already at MAJOR, the migration wouldn't change the tier, but the Gate output would be updated to reflect the migration step.

---

### Rollback plan
**YES** -- Clear guidance provided.

> "### Rollback 計畫
>
> 如果 `/land-and-deploy` 或 `/canary` 發現問題：
> - **無 migration 的變更：** `git revert` + 重新部署
> - **有 migration 的變更：** 評估 migration 是否可逆（DROP 不可逆），必要時寫 reverse migration
> - **launchd / scripts：** 手動 `launchctl unload` 還原 plist
> - `/canary` 發現問題時會自動提供 revert 選項" (lines 149-156)

The skill provides a structured rollback plan covering three scenarios: no-migration changes (simple git revert), migration changes (evaluate reversibility, write reverse migration if needed), and infrastructure changes (manual unload). It also notes that /canary has a built-in revert option.

---

## Summary

The tp-team skill provides **clear, actionable guidance on all 6 evaluated items**. The routing logic is deterministic for this request (new API endpoint = forced MAJOR), and every pipeline step has defined entry/exit criteria. The skill covers both the happy path and edge cases (mid-build scope changes, verify failures, rollback scenarios).

| Item | Clear Guidance? |
|------|----------------|
| Feature branch timing | YES |
| TDD workflow | YES |
| /simplify behavior + findings handling | YES |
| /canary for API changes | YES |
| Mid-build scope upgrade | YES |
| Rollback plan | YES |
