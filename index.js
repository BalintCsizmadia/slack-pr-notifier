const axios = require('axios');
const core = require('@actions/core');
const MessageFormatter = require('./message-formatter.js');

const main = async () => {
  try {
    const message = {
      webHook: core.getInput('slack-webHook'),
      channel: core.getInput('slack-channel'),
      text: core.getInput('slack-text'),
      username: core.getInput('slack-username'),
      icon: core.getInput('slack-icon'),
      iconEmoji: core.getInput('slack-icon-emoji'),
      parameters: core.getInput('parameters') || null,
      createdBy: core.getInput('created-by') || null,
      jobStatus: core.getInput('job-status') || null,
      planStatus: core.getInput('plan-status') || null,
      isBasic: core.getInput('is-basic') || null
    };

    await axios.post(message.webHook, MessageFormatter.format(message));
  } catch (error) {
    core.setOutput('result', 'failure');
    core.setFailed(error.message);
  }
};

main();
