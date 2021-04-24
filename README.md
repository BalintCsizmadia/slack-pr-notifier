
### Post notifications to Slack (triggered by pull request)
---
#### Example:
```
- name: Slack Notification
    uses: BalintCsizmadia/slack-pr-notifier@v0.1.1
    if: github.event_name == 'pull_request' && github.event.action == 'opened'
    with:
      slack-webhook: '${{ secrets.WEBHOOK }}'
      slack-channel: '${{ slack_channel }}'
      slack-title: ${{ slack_title }}
      parameters: ${{ parameters }}
      created-by: '${{ github_actor }}'
      job-status: '${{ job_status }}'
      plan-status: '${{ terraform_plan_outcome }}'
```
