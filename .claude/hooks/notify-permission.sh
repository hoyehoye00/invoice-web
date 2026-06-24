#!/bin/bash
# Notification(permission_prompt) 이벤트 핸들러
# Claude Code가 권한 승인을 요청할 때 Slack 알림 전송

HOOKS_DIR="$(dirname "$0")"
# shellcheck source=./slack-notify.sh
source "${HOOKS_DIR}/slack-notify.sh"

HOOK_INPUT=$(cat)

TOOL_NAME=$(echo "$HOOK_INPUT" | jq -r '.tool_name // "Unknown"')
SESSION_ID=$(echo "$HOOK_INPUT" | jq -r '.session_id // ""')
REASON=$(echo "$HOOK_INPUT" | jq -r '.reason // ""')

SHORT_SESSION="${SESSION_ID:0:8}"

BODY="*Claude Code가 권한 승인을 요청합니다.*

*도구:* \`${TOOL_NAME}\`
*세션:* \`${SHORT_SESSION}\`"

if [ -n "$REASON" ] && [ "$REASON" != "null" ]; then
  BODY="${BODY}
*요청 내용:*
\`\`\`${REASON}\`\`\`"
fi

BODY="${BODY}

Claude Code 터미널로 돌아가서 승인/거부를 선택하세요."

send_slack_message \
  "Claude Code 권한 요청" \
  "$BODY" \
  ":key:" \
  "#e8a838" || true

exit 0
