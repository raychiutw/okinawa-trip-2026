#!/usr/bin/env bash
set -euo pipefail

# Claude Code 記憶檔同步腳本
# export: 本機 memory → .claude/memory-sync/（準備 commit + push）
# import: .claude/memory-sync/ → 本機 memory（pull 後匯入）

REPO_ROOT="$(git rev-parse --show-toplevel)"
SYNC_DIR="$REPO_ROOT/.claude/memory-sync"

# 自動偵測本機 memory 路徑
detect_memory_dir() {
  local matches=()
  for dir in ~/.claude/projects/*/memory; do
    if [[ -d "$dir" ]]; then
      # 父目錄名稱含 trip-planner 即匹配
      local parent
      parent="$(basename "$(dirname "$dir")")"
      if [[ "$parent" == *trip-planner* ]]; then
        matches+=("$dir")
      fi
    fi
  done

  if [[ ${#matches[@]} -eq 0 ]]; then
    if [[ "$1" == "import" ]]; then
      # import 時無匹配：找第一個含 trip-planner 的 projects 子目錄，建立 memory/
      for dir in ~/.claude/projects/*; do
        if [[ -d "$dir" && "$(basename "$dir")" == *trip-planner* ]]; then
          local mem_dir="$dir/memory"
          mkdir -p "$mem_dir"
          echo "$mem_dir"
          return
        fi
      done
      echo "ERROR: 找不到含 trip-planner 的 ~/.claude/projects/ 子目錄" >&2
      exit 1
    else
      echo "ERROR: 找不到本機 memory 目錄（~/.claude/projects/*/memory 中無含 trip-planner 者）" >&2
      exit 1
    fi
  elif [[ ${#matches[@]} -gt 1 ]]; then
    echo "ERROR: 找到多個匹配的 memory 目錄，請手動指定：" >&2
    printf '  %s\n' "${matches[@]}" >&2
    exit 1
  else
    echo "${matches[0]}"
  fi
}

cmd="${1:-}"

case "$cmd" in
  export)
    MEMORY_DIR="$(detect_memory_dir export)"
    mkdir -p "$SYNC_DIR"
    cp -r "$MEMORY_DIR"/* "$SYNC_DIR"/
    echo "已匯出：$MEMORY_DIR → $SYNC_DIR"
    ;;
  import)
    if [[ ! -d "$SYNC_DIR" || -z "$(ls -A "$SYNC_DIR" 2>/dev/null)" ]]; then
      echo "ERROR: $SYNC_DIR 不存在或為空，請先從另一台機器 export + push" >&2
      exit 1
    fi
    MEMORY_DIR="$(detect_memory_dir import)"
    mkdir -p "$MEMORY_DIR"
    cp -r "$SYNC_DIR"/* "$MEMORY_DIR"/
    echo "已匯入：$SYNC_DIR → $MEMORY_DIR"
    ;;
  *)
    echo "用法: $0 {export|import}" >&2
    echo "  export  複製本機 memory 到 .claude/memory-sync/（準備 commit）" >&2
    echo "  import  從 .claude/memory-sync/ 複製到本機 memory" >&2
    exit 1
    ;;
esac
