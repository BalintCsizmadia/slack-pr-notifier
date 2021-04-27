
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
---

### Development instructions
#
#### Compile code into one file used for distribution
- npm i -g @vercel/ncc
- ncc build index.js --license licenses.txt
#### Create new release version
- git commit -m "release x"
- git tag -a -m "release x" v1
- git push --follow-tags
#
