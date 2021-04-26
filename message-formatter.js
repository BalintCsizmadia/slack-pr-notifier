const github = require('@actions/github');

class MessageFormatter {
  static format(message) {
    if (message.isBasic && (message.isBasic === true || message.isBasic === 'true')) {
      return this._createBasicMessage(message.text);
    }
    if (github.context.eventName !== 'pull_request') {
      throw new Error(
        `Trigger event must be a 'pull_request' but it was a '${github.context.eventName}'`
      );
    }
    if (this._missingParameters(message)) {
      throw new Error(`Parameter(s) missing: ${this._missingParameters(message).join(', ')}`);
    }
    const webhookPayload = github.context.payload;
    const htmlUrl = webhookPayload.repository ? webhookPayload.repository.html_url : '';
    const pullRequestUrl = webhookPayload.pull_request ? webhookPayload.pull_request.html_url : '';
    const runUrl = `${htmlUrl}/actions/runs/${github.context.runId}`;
    const commitId = github.context.sha.substring(0, 7);

    return {
      attachments: [
        {
          color: this._transformColor(message.jobStatus),
          blocks: [
            this._createSection(message.text, 'title'),
            this._createSectionWithFields([
              `*URL:*\n<${pullRequestUrl}|Pull Request URL>`,
              `*Created by:*\n<https://github.com/${message.createdBy}|${message.createdBy}>`
            ]),
            this._createSectionWithFields([
              `*Parameters:*\n${message.parameters}`,
              `*Terraform plan:*\n${message.planStatus}`
            ]),
            this._createSectionWithFields([
              `*Commit:*\n<${htmlUrl}/commit/${github.context.sha}|${commitId}>`,
              `*Actions:*\n<${runUrl}|${github.context.workflow}>`
            ])
          ]
        }
      ]
    };
  }

  static _transformColor(jobStatus, planStatus) {
    let color = '#d3d3d3';
    if (jobStatus === 'success' || planStatus === 'success') {
      color = '#2eb886';
    } else if (jobStatus === 'failure' || planStatus === 'failure') {
      color = '#FF0000';
    }
    return color;
  }

  static _createSection(content, contentType = '') {
    return {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: contentType === 'title' ? `*${content}*` : content
      }
    };
  }

  static _createSectionWithFields(textsForFields) {
    return {
      type: 'section',
      fields: textsForFields.map((text) => ({
        type: 'mrkdwn',
        text
      }))
    };
  }

  static _createBasicMessage(text) {
    return {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'plain_text',
            text,
            emoji: true
          }
        }
      ]
    };
  }

  static _missingParameters(params) {
    const whitelist = ['channel', 'username', 'icon', 'iconEmoji', 'isBasic'];
    const missingParams = Object.entries(params).filter(
      (param) => !param[1] && !whitelist.includes(param[0])
    );
    return missingParams.length > 0 ? missingParams.map((param) => param[0]) : null;
  }
}

module.exports = MessageFormatter;
