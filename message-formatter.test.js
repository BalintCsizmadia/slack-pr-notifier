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
    setupGitHubContext(
      '123456789',
      '987654321',
      'workflow',
      'https://repository_html_url',
      'https://pull_request_html_url'
    );
    process.env.GITHUB_RUN_ID = 987654321;
    process.env.GITHUB_WORKFLOW = 'workflow';
  });

  it('returns a properly formatted message', () => {
    const message = MessageFormatter.format({
      title: 'slack-title',
      parameters: 'param_1,param_2,param_3',
      createdBy: 'user',
      jobStatus: 'success',
      planStatus: 'success'
    });
    const expectedMessage = {
      attachments: [
        {
          color: '#2eb886',
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '*slack-title*'
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
    expect(message).toEqual(expectedMessage);
  });

  afterEach(() => {
    restoreGitHubContext();
    jest.restoreAllMocks();
  });
});

function setupGitHubContext(commitId, runId, workflowName, repoUrl, prUrl) {
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
}

function restoreGitHubContext() {
  github.context.sha = originalContext.sha;
  github.context.runId = originalContext.runId;
  github.context.workflow = originalContext.workflow;
  github.context.payload = originalContext.payload;
}
