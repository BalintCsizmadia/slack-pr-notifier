
### Post notifications to Slack
---
#### Examples:
##### Basic
```
- name: Slack Notification
    uses: BalintCsizmadia/slack-pr-notifier@v1.0.0
    with:
      slack-webhook: ${{ secrets.WEBHOOK }}
      slack-channel: ${{ slack_channel }}
      slack-text: ${{ slack_text }}
      is-basic: true
```
##### Special (Post notification about Terraform plan status, triggered by Pull Request)
```
- name: Slack Notification
    uses: BalintCsizmadia/slack-pr-notifier@v1.0.0
    if: github.event_name == 'pull_request'
    with:
      slack-webhook: ${{ secrets.WEBHOOK }}
      slack-channel: ${{ slack_channel }}
      slack-text: ${{ slack_text }}
      parameters: ${{ parameters }}
      created-by: ${{ github_actor }}
      job-status: ${{ job_status }}
      plan-status: ${{ terraform_plan_outcome }}
```
