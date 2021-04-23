const axios = require('axios');
const core = require('@actions/core');
const MessageFormatter = require('./message-formatter.js')

const main = async () => {
  try {
    const message = {
        webHook: core.getInput('slack-webHook'),
        channel: core.getInput('slack-channel'),
        title: core.getInput('slack-title'),
        parameters: core.getInput('parameters'),
        createdBy: core.getInput('created-by'),
        jobStatus: core.getInput('job-status'),
        planStatus: core.getInput('plan-status'),
        username: core.getInput('slack-username'),
        icon: core.getInput('slack-icon'),
        iconEmoji: core.getInput('slack-icon-emoji')
    }

    await axios.post({
        url: message.webHook,
        data: MessageFormatter.format(message)
    })
  } catch (error) {
    core.setOutput('result', 'failure');
    core.setFailed(error.message);
  }
};

main();
