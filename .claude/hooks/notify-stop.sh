#!/bin/bash
# Stop 이벤트 핸들러
# Claude Code 작업이 완료되어 멈출 때 Slack 알림 전송

HOOKS_DIR="$(dirname "$0")"
# shellcheck source=./slack-notify.sh
source "${HOOKS_DIR}/slack-notify.sh"

HOOK_INPUT=$(cat)

SESSION_ID=$(echo "$HOOK_INPUT" | jq -r '.session_id // ""')
TRANSCRIPT_PATH=$(echo "$HOOK_INPUT" | jq -r '.transcript_path // ""')

SHORT_SESSION="${SESSION_ID:0:8}"

LAST_MESSAGE=""
if [ -n "$TRANSCRIPT_PATH" ] && [ -f "$TRANSCRIPT_PATH" ]; then
  LAST_MESSAGE=$(jq -rs '
    [.[] | select(.type == "assistant") | .message.content[]? | select(.type == "text") | .text]
    | last // ""
  ' "$TRANSCRIPT_PATH" 2>/dev/null | head -c 400 || echo "")
fi

BODY="*Claude Code 작업이 완료되었습니다.*

*세션:* \`${SHORT_SESSION}\`"

if [ -n "$LAST_MESSAGE" ] && [ "$LAST_MESSAGE" != "null" ] && [ "$LAST_MESSAGE" != '""' ]; then
  BODY="${BODY}

*최종 응답 요약:*
\`\`\`${LAST_MESSAGE}\`\`\`"
fi

send_slack_message \
  "Claude Code 작업 완료" \
  "$BODY" \
  ":white_check_mark:" \
  "#2eb886" || true

exit 0
