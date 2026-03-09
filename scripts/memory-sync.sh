#!/usr/bin/env bash
set -euo pipefail

# Claude Code 記憶檔同步腳本
# export: 本機 memory → .claude/memory-sync/（準備 commit + push）
# import: .claude/memory-sync/ → 本機 memory（pull 後匯入）
#
# 偵測策略：將 repo 絕對路徑轉為 Claude Code 的目錄編碼格式，
# 精確匹配而非模糊搜尋，解決 A/B 電腦不同工作目錄的問題。

REPO_ROOT="$(git rev-parse --show-toplevel)"
SYNC_DIR="$REPO_ROOT/.claude/memory-sync"

# 將路徑轉為 Claude Code 的 projects 目錄編碼格式
# /c/Users/RayChiu/Desktop/Source/GithubRepos/trip-planner
# → C--Users-RayChiu-Desktop-Source-GithubRepos-trip-planner
path_to_project_key() {
  local p="$1"
  # 移除結尾斜線
  p="${p%/}"
  # Git Bash: /c/Users/... → c:/Users/...
  if [[ "$p" =~ ^/([a-zA-Z])/ ]]; then
    p="${BASH_REMATCH[1]^^}:${p:2}"
  fi
  # Claude Code 編碼：每個 : / \ 各替換為一個 -
  # 所以 C:/Users → C--Users（冒號→- 加上斜線→-）
  p="${p//[:\/\\]/-}"
  # 移除首尾 -
  p="$(echo "$p" | sed 's/^-//; s/-$//')"
  echo "$p"
}

detect_memory_dir() {
  local mode="$1"
  local key
  key="$(path_to_project_key "$REPO_ROOT")"
  local project_dir="$HOME/.claude/projects/$key"
  local mem_dir="$project_dir/memory"

  if [[ -d "$mem_dir" ]]; then
    echo "$mem_dir"
    return
  fi

  # memory 目錄不存在
  if [[ "$mode" == "import" && -d "$project_dir" ]]; then
    mkdir -p "$mem_dir"
    echo "$mem_dir"
    return
  fi

  # project 目錄也不存在，嘗試模糊匹配（fallback）
  local repo_name
  repo_name="$(basename "$REPO_ROOT")"
  local matches=()
  for dir in "$HOME/.claude/projects"/*/memory; do
    if [[ -d "$dir" ]]; then
      local parent
      parent="$(basename "$(dirname "$dir")")"
      # 排除 worktree 目錄
      if [[ "$parent" == *"$repo_name"* && "$parent" != *worktree* ]]; then
        matches+=("$dir")
      fi
    fi
  done

  if [[ ${#matches[@]} -eq 1 ]]; then
    echo "${matches[0]}"
    return
  fi

  if [[ ${#matches[@]} -gt 1 ]]; then
    echo "ERROR: 找到多個匹配的 memory 目錄：" >&2
    printf '  %s\n' "${matches[@]}" >&2
    exit 1
  fi

  if [[ "$mode" == "import" ]]; then
    # 連模糊匹配都找不到，建立精確路徑
    mkdir -p "$mem_dir"
    echo "$mem_dir"
    return
  fi

  echo "ERROR: 找不到 memory 目錄" >&2
  echo "  預期路徑：$mem_dir" >&2
  echo "  請先在此專案中使用過 Claude Code，讓它自動建立 memory 目錄" >&2
  exit 1
}

sync_files() {
  local src="$1" dst="$2"
  mkdir -p "$dst"

  # 複製所有檔案（覆寫）
  local count=0
  for f in "$src"/*; do
    [[ -e "$f" ]] || continue
    cp -r "$f" "$dst"/
    count=$((count + 1))
  done

  # 刪除目標中來源已不存在的檔案（保持同步）
  for f in "$dst"/*; do
    [[ -e "$f" ]] || continue
    local name
    name="$(basename "$f")"
    if [[ ! -e "$src/$name" ]]; then
      rm -rf "$dst/$name"
      echo "  刪除已移除的檔案：$name"
    fi
  done

  echo "$count"
}

cmd="${1:-}"

case "$cmd" in
  export)
    MEMORY_DIR="$(detect_memory_dir export)"
    count="$(sync_files "$MEMORY_DIR" "$SYNC_DIR")"
    echo "已匯出 $count 個檔案：$MEMORY_DIR → $SYNC_DIR"
    ;;
  import)
    if [[ ! -d "$SYNC_DIR" || -z "$(ls -A "$SYNC_DIR" 2>/dev/null)" ]]; then
      echo "ERROR: $SYNC_DIR 不存在或為空，請先從另一台機器 export + push" >&2
      exit 1
    fi
    MEMORY_DIR="$(detect_memory_dir import)"
    count="$(sync_files "$SYNC_DIR" "$MEMORY_DIR")"
    echo "已匯入 $count 個檔案：$SYNC_DIR → $MEMORY_DIR"
    ;;
  debug)
    echo "REPO_ROOT: $REPO_ROOT"
    echo "PROJECT_KEY: $(path_to_project_key "$REPO_ROOT")"
    echo "SYNC_DIR: $SYNC_DIR"
    MEMORY_DIR="$(detect_memory_dir export 2>&1)" || true
    echo "MEMORY_DIR: $MEMORY_DIR"
    echo ""
    echo "sync 目錄內容："
    ls -la "$SYNC_DIR" 2>/dev/null || echo "  （不存在）"
    echo ""
    echo "memory 目錄內容："
    if [[ -d "$MEMORY_DIR" ]]; then
      ls -la "$MEMORY_DIR"
    else
      echo "  （不存在）"
    fi
    ;;
  *)
    echo "用法: $0 {export|import|debug}" >&2
    echo "  export  本機 memory → .claude/memory-sync/（準備 commit）" >&2
    echo "  import  .claude/memory-sync/ → 本機 memory（pull 後匯入）" >&2
    echo "  debug   顯示路徑偵測結果（排錯用）" >&2
    exit 1
    ;;
esac
