const github = require('@actions/github');
const MessageFormatter = require('./message-formatter.js');

let originalContext = { ...github.context };

describe('MessageFormatter', () => {
  beforeEach(() => {
    jest.spyOn(github.context, 'repo', 'get').mockImplementation(() => {
      return {
        repo: 'some-repo'
      };
    });
    setupGitHubContext();
  });

  it('returns a properly formatted message', () => {
    const expectedMessage = {
      text: 'text',
      attachments: [
        {
          color: '#2eb886',
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '*text*'
              }
            },
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: '*URL:*\n<https://pull_request_html_url|Pull Request URL>'
                },
                {
                  type: 'mrkdwn',
                  text: '*Created by:*\n<https://github.com/user|user>'
                }
              ]
            },
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: '*Parameters:*\nparam_1,param_2,param_3'
                },
                {
                  type: 'mrkdwn',
                  text: '*Terraform plan:*\nsuccess'
                }
              ]
            },
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: '*Commit:*\n<https://repository_html_url/commit/123456789|1234567>'
                },
                {
                  type: 'mrkdwn',
                  text: '*Actions:*\n<https://repository_html_url/actions/runs/987654321|workflow>'
                }
              ]
            }
          ]
        }
      ]
    };

    const message = MessageFormatter.format(createMessage());

    expect(message).toEqual(expectedMessage);
  });

  it('returns a properly formatted message if Terraform plan has been failed', () => {
    const expectedMessage = {
      text: 'text',
      attachments: [
        {
          color: '#FF0000',
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '*text*'
              }
            },
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: '*URL:*\n<https://pull_request_html_url|Pull Request URL>'
                },
                {
                  type: 'mrkdwn',
                  text: '*Created by:*\n<https://github.com/user|user>'
                }
              ]
            },
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: '*Parameters:*\nparam_1,param_2,param_3'
                },
                {
                  type: 'mrkdwn',
                  text: '*Terraform plan:*\nfailure'
                }
              ]
            },
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: '*Commit:*\n<https://repository_html_url/commit/123456789|1234567>'
                },
                {
                  type: 'mrkdwn',
                  text: '*Actions:*\n<https://repository_html_url/actions/runs/987654321|workflow>'
                }
              ]
            }
          ]
        }
      ]
    };

    const message = MessageFormatter.format(createMessage({ planStatus: 'failure' }));

    expect(message).toEqual(expectedMessage);
  });

  it('returns a properly formatted message if isBasic property is true', () => {
    const expectedMessage = {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'plain_text',
            text: 'text',
            emoji: true
          }
        }
      ]
    };

    const message = MessageFormatter.format(createMessage({ isBasic: true }));

    expect(message).toEqual(expectedMessage);
  });

  it('throws error if isBasic is not true and parameter(s) is/are missing', () => {
    const message = () =>
      MessageFormatter.format(createMessage({ planStatus: null, jobStatus: null }));

    expect(message).toThrow(Error);
    expect(message).toThrow('Parameter(s) missing: jobStatus, planStatus');
  });

  it('throws error if isBasic is not true and github event is not supported', () => {
    setupGitHubContext({ eventName: 'push' });

    const message = () => MessageFormatter.format(createMessage());

    expect(message).toThrow(Error);
    expect(message).toThrow("Trigger event must be a 'pull_request' but it was a 'push'");
  });

  afterEach(() => {
    restoreGitHubContext();
    jest.restoreAllMocks();
  });
});

const setupGitHubContext = ({
  eventName = 'pull_request',
  commitId = '123456789',
  runId = '987654321',
  workflowName = 'workflow',
  repoUrl = 'https://repository_html_url',
  prUrl = 'https://pull_request_html_url'
} = {}) => {
  github.context.eventName = eventName;
  github.context.sha = commitId;
  github.context.runId = runId;
  github.context.workflow = workflowName;
  github.context.payload = {
    repository: {
      html_url: repoUrl
    },
    pull_request: {
      html_url: prUrl
    }
  };
};

const restoreGitHubContext = () => {
  github.context.eventName = originalContext.eventName;
  github.context.sha = originalContext.sha;
  github.context.runId = originalContext.runId;
  github.context.workflow = originalContext.workflow;
  github.context.payload = originalContext.payload;
};

const createMessage = ({
  text = 'text',
  parameters = 'param_1,param_2,param_3',
  createdBy = 'user',
  jobStatus = 'success',
  planStatus = 'success',
  isBasic = null
} = {}) => {
  return {
    text,
    parameters,
    createdBy,
    jobStatus,
    planStatus,
    isBasic
  };
};
