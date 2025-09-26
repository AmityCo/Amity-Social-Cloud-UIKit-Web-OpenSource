import dotenv from 'dotenv';
import { Octokit } from '@octokit/core';

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GH_PERSONAL_ACCESS_TOKEN,
});

async function main() {
  const lines = [
    'This is a placeholder file.',
    '',
    'This file will be automatically deleted, once you update this gist via the automated script (update-sample-code.js).',
  ];

  const res = await octokit.request('POST /gists', {
    description: 'ASC Sample Code',
    public: false,
    files: {
      'placeholder_file.txt': {
        content: lines.join('\n'),
      },
    },
  });
  console.log(`gistId: ${res.data.id}`);
  console.log(`gistUrl: ${res.data.html_url}`);
}

main();
