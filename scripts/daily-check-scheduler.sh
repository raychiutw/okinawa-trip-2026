#!/bin/zsh
# daily-check-scheduler.sh — 每日 06:13 排程：執行 daily-check.js + claude /tp-daily-check
set -eo pipefail

PROJECT_DIR="/Users/ray/Projects/trip-planner"
LOG_DIR="$PROJECT_DIR/scripts/logs/daily-check"
LOG_FILE="$LOG_DIR/$(date +%Y-%m-%d).log"
ERR_LOG_FILE="$LOG_DIR/$(date +%Y-%m-%d).error.log"

source "$PROJECT_DIR/scripts/lib/scheduler-common.sh"

log "--- 排程啟動 ---"

# Phase 1: 執行 daily-check.js 產出報告 JSON
log "Phase 1: 執行 daily-check.js"
cd "$PROJECT_DIR"

if node scripts/daily-check.js >> "$LOG_FILE" 2>&1; then
  log "Phase 1 完成"
else
  log_error "daily-check.js 執行失敗"
  log_error "--- 排程結束（錯誤）---"
  exit 1
fi

# Phase 2: 呼叫 Claude tp-daily-check（自動修復 + Telegram）
log "Phase 2: claude /tp-daily-check"

if claude --dangerously-skip-permissions -p "/tp-daily-check" >> "$LOG_FILE" 2>&1; then
  log "Phase 2 完成"
else
  log_error "Claude /tp-daily-check 執行失敗"
  log_error "--- 排程結束（錯誤）---"
  exit 1
fi

log "--- 排程結束 ---"
