const github =  require('@actions/github');

class MessageFormatter {
  static format(message) {
    let context = github.context;
    let htmlUrl = '';
    if (context.payload.repository != null) {
      htmlUrl = context.payload.repository.html_url;
    }
    console.log(htmlUrl);
    const runUrl = `${htmlUrl}/actions/runs/${process.env.GITHUB_RUN_ID}`;
    console.log(runUrl);
    const commitId = context.sha.substring(0, 7);
    console.log(commitId);
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
                  text: `*Url:*\n<url|PR URL>`
                  // text: `*Url:*\n<${context.payload.pr.url}|PR URL>`
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
                  text: `*Url:*\n<commit url|Commit>`
                  // text: `*Commit:*\n<${context.payload.repository.compare_url}|${commitId}>`
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

module.exports = MessageFormatter;