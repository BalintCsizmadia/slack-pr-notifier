const github = require('@actions/github');

class MessageFormatter {
  static format(message) {
    let context = github.context;
    let htmlUrl = '';
    if (context.payload.repository != null) {
      htmlUrl = context.payload.repository.html_url;
    }
    const runUrl = `${htmlUrl}/actions/runs/${process.env.GITHUB_RUN_ID}`;
    const commitId = context.sha.substring(0, 7);

    return {
      attachments: [
        {
          color: this.transformColor(message.jobStatus),
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: `${message.title}`,
                emoji: true
              }
            },
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: `*Url:*\n<${context.payload.pull_request.html_url}|PR URL>`
                },
                {
                  type: 'mrkdwn',
                  text: `*Created by:*\n<https://github.com/${message.createdBy}|${message.createdBy}>`
                }
              ]
            },
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: `*Parameters:*\n${message.parameters}`
                },
                {
                  type: 'mrkdwn',
                  text: `*Terraform plan:*\n${message.planStatus}`
                }
              ]
            },
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: `*Commit:*\n<${htmlUrl}/commit/${context.sha}|${commitId}>`
                },
                {
                  type: 'mrkdwn',
                  text: `*Actions:*\n<${runUrl}|Action url>`
                }
              ]
            }
          ]
        }
      ]
    };
  }

  static transformColor(jobStatus) {
    let color = '';
    switch (jobStatus) {
      case 'success':
        color = '#32CD32';
      case 'cancelled':
        color = '#808080';
      case 'failure':
        color = '#FF0000';
      default:
        color = '#d3d3d3';
    }
    return color;
  }
}

module.exports = MessageFormatter;
