#!/bin/bash
# PostToolUse 이벤트 핸들러 — Bash 도구 실행 기록 로깅

HOOKS_DIR="$(dirname "$0")"
PROJECT_DIR="$(dirname "$HOOKS_DIR")"
LOG_DIR="${PROJECT_DIR}/logs"
LOG_FILE="${LOG_DIR}/commands.log"

mkdir -p "$LOG_DIR"

HOOK_INPUT=$(cat)

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
SESSION_ID=$(echo "$HOOK_INPUT" | jq -r '.session_id // ""')
COMMAND=$(echo "$HOOK_INPUT"    | jq -r '.tool_input.command // ""')
DESCRIPTION=$(echo "$HOOK_INPUT" | jq -r '.tool_input.description // ""')
INTERRUPTED=$(echo "$HOOK_INPUT" | jq -r '.tool_response.interrupted // false')
STDERR=$(echo "$HOOK_INPUT"     | jq -r '.tool_response.stderr // ""')

SHORT_SESSION="${SESSION_ID:0:8}"

# interrupted=true 이거나 stderr가 있으면 실패로 표시
if [ "$INTERRUPTED" = "true" ]; then
  STATUS="interrupted"
elif [ -n "$STDERR" ] && [ "$STDERR" != "null" ]; then
  STATUS="err"
else
  STATUS="ok"
fi

LOG_LINE="[${TIMESTAMP}] [${SHORT_SESSION}] ${STATUS}"

if [ -n "$DESCRIPTION" ] && [ "$DESCRIPTION" != "null" ]; then
  LOG_LINE="${LOG_LINE} desc=\"${DESCRIPTION}\""
fi

LOG_LINE="${LOG_LINE} cmd=${COMMAND}"

echo "$LOG_LINE" >> "$LOG_FILE"

exit 0
