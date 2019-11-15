/* eslint-disable import/no-extraneous-dependencies */
import { message, warn, fail, danger } from 'danger';
import jest from 'danger-plugin-jest';

import * as fs from 'fs';
import * as path from 'path';

const { github } = danger;
const { pr } = github;

// Modified or created files
const touchedFiles = [...danger.git.modified_files, ...danger.git.created_files];

if (fs.existsSync('test-results.json')) {
  jest();
}

// Check if the PR line count(other than package-lock.json?) is over 500 lines
const bigPRThreshold = 500;
if (pr.additions + pr.deletions > bigPRThreshold) {
  warn(':exclamation: Big PR! You might want to split this up into separate commits in '
       + 'order to maximize the effectiveness of code review');
}

// Add a warning if the PR doesn't have an assignee
const someoneAssigned = danger.github.pr.assignee;
if (someoneAssigned == null) {
  warn('Please assign someone to this PR, such as the creator of the PR or people to'
       + ' review it');
}

// Add a failure if it doens't have a PR description
if (pr.body.length === 0) {
  fail('Please add a PR description');
}

const frontendTouchedFiles = touchedFiles.filter(
  (f) => f.includes('.ts') || f.includes('.tsx'),
);

const backendTouchedFiles = touchedFiles.filter((f) => {
  return f.includes('.py');
});

const frontendTouchedFilesNotTests = frontendTouchedFiles.map(
  (f) => !f.includes('autoscheduler/frontend/src/tests/'),
);

const backendTouchedFilesNotTests = backendTouchedFiles.map(
  (f) => !f.includes('autoscheduler/scraper/tests/')
         || !f.includes('autoscheduler/scheduler/tests/'),
);

const hasFrontendChanges = frontendTouchedFilesNotTests.length > 0;
const hasBackendChanges = backendTouchedFilesNotTests.length > 0;

const hasFrontendTestChanges = frontendTouchedFiles.length - frontendTouchedFilesNotTests.length > 0;
const hasBackendTestChanges = backendTouchedFiles.length - backendTouchedFilesNotTests.length > 0;

// Check if there's a corresponding test file update for any frontend changes
if (hasFrontendChanges && !hasFrontendTestChanges) {
  warn('There are frontend changes, but not tests. That\'s ok as long are you\'re'
       + ' refactoring existing code.');
}

// Check if there's a corresponding test file update for any backend changes
if (hasBackendChanges && !hasBackendTestChanges) {
  warn('There are backend changes, but not tests. That\'s ok as long are you\'re'
       + ' refactoring existing code.');
}
