#!/bin/bash
# 공통 Slack Block Kit 전송 함수 라이브러리
# 직접 실행하지 않음 — notify-*.sh 에서 source로 로드

# .claude/.env 에서 SLACK_WEBHOOK_URL 로드
ENV_FILE="$(dirname "$0")/../.env"
if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

# send_slack_message <title> <body> <emoji> <color>
send_slack_message() {
  local title="$1"
  local body="$2"
  local emoji="${3:-:robot_face:}"
  local color="${4:-#36a64f}"
  local hostname
  hostname=$(hostname -s 2>/dev/null || echo "unknown")
  local timestamp
  timestamp=$(date '+%Y-%m-%d %H:%M:%S')

  if [ -z "${SLACK_WEBHOOK_URL:-}" ] || \
     [ "$SLACK_WEBHOOK_URL" = "https://hooks.slack.com/services/YOUR/WEBHOOK/URL" ]; then
    return 0
  fi

  local payload
  payload=$(jq -n \
    --arg emoji "$emoji" \
    --arg title "$title" \
    --arg body "$body" \
    --arg color "$color" \
    --arg host "$hostname" \
    --arg ts "$timestamp" \
    '{
      attachments: [
        {
          color: $color,
          blocks: [
            {
              type: "header",
              text: { type: "plain_text", text: ($emoji + " " + $title), emoji: true }
            },
            {
              type: "section",
              text: { type: "mrkdwn", text: $body }
            },
            {
              type: "context",
              elements: [
                { type: "mrkdwn", text: ("*Host:* " + $host + "  |  *Time:* " + $ts) }
              ]
            }
          ]
        }
      ]
    }')

  curl -s -o /dev/null \
    -X POST \
    -H 'Content-Type: application/json' \
    --max-time 5 \
    --data "$payload" \
    "$SLACK_WEBHOOK_URL" 2>/dev/null || true
}
