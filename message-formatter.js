import github from '@actions/github';

export default class MessageFormatter {
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
          color: 'good',
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
                  text: `*Url:*\n<${context.payload.pr.url}|PR URL>`
                },
                {
                  type: 'mrkdwn',
                  text: `*Created by:*\n<example.com|${message.createdBy}>`
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
                  text: `*Commit:*\n<${context.payload.repository.compare_url}|${commitId}>`
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
    }
  };
}
