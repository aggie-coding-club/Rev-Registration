/* eslint-disable import/no-extraneous-dependencies */
import {
  warn, fail, danger,
} from 'danger';

const { github } = danger;
const { pr } = github;

// Modified or created files
const touchedFiles = danger.git.modified_files.concat(danger.git.created_files);


// Checks if the total additions (minus an offset, for ignoring package-lock.json changes)
function checkForBigPR(offset = 0) {
  const bigPRThreshold = 500;
  const changedLines = pr.additions + pr.deletions - offset;
  if (changedLines - offset > bigPRThreshold) {
    warn(':exclamation: Big PR! You might want to split this up into separate commits in '
          + 'order to maximize the effectiveness of code review');
  }
}

const packageLockPath = 'autoscheduler/frontend/src/package-lock.json';
let commitContainsPackageLock = false;
touchedFiles.forEach((file) => {
  if (file === packageLockPath) {
    commitContainsPackageLock = true;
  }
});

// Check if the PR line count(other than package-lock.json?) is over 500 lines
if (commitContainsPackageLock) {
  // Counts the changes in package-lock.json, so that the big PR check doesn't include them
  danger.git.diffForFile(packageLockPath).then((diff) => {
    const changed = diff.added.split('\n').length + diff.removed.split('\n').length;
    checkForBigPR(changed);
  });
} else {
  // Add up the additions normally and check if it's over a certain threshold
  checkForBigPR();
}

// Add a warning if the PR doesn't have an assignee
const someoneAssigned = pr.assignee;
if (someoneAssigned == null) {
  warn('Please assign someone to this PR, such as the creator of the PR or people to'
         + ' review it');
}

// Add a failure if it doens't have a PR description
if (pr.body.length === 0) {
  warn('Please add a PR description');
}

// Add a warning if there aren't any labels on this PR
if (github.issue.labels.length === 0) {
  warn('Please add a label to this PR');
}

/* Code-specific warnings */

let frontendTouchedFiles = touchedFiles.filter(
  (f) => f.includes('.ts') || f.includes('.tsx'),
);

const backendTouchedFiles = touchedFiles.filter((f) => f.includes('.py'));

const frontendTouchedFilesTests = frontendTouchedFiles.map(
  (f) => f.includes('autoscheduler/frontend/src/tests/'),
);

const backendTouchedFilesTests = backendTouchedFiles.map(
  (f) => f.includes('autoscheduler/scraper/tests/')
          || f.includes('autoscheduler/scheduler/tests/'),
);

// Check if there's a corresponding test file update for any frontend changes
const hasFrontendChanges = frontendTouchedFiles.length - frontendTouchedFilesTests.length > 0;
const hasFrontendTestChanges = frontendTouchedFilesTests.length > 0;
if (hasFrontendChanges && !hasFrontendTestChanges) {
  warn('There are frontend changes, but not tests. That\'s ok as long are you\'re'
        + ' refactoring existing code.');
}

// Check if there's a corresponding test file update for any backend changes
const hasBackendChanges = backendTouchedFiles.length - backendTouchedFilesTests.length > 0;
const hasBackendTestChanges = backendTouchedFilesTests.length > 0;
if (hasBackendChanges && !hasBackendTestChanges) {
  warn('There are backend changes, but not tests. That\'s ok as long are you\'re'
        + ' refactoring existing code.');
}

// Add a failure if there are backend changes on a frontend branch
if (pr.head.label.includes('frontend/') && backendTouchedFiles.length > 0) {
  // Add a warning if there's touched files in the backend
  fail(':exclamation: No Python/Django related files should be touched on a frontend-'
        + 'related branch');
}

frontendTouchedFiles = touchedFiles.filter(
  (f) => f.endsWith('.js') || f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.'),
);

// Add a failure if there are frontend changes on a backend branch
if (pr.head.label.startsWith('backend/') && frontendTouchedFiles.length > 0) {
  fail(':exclamation: No Python/Django related files should be touched on a backend-'
        + 'related branch');
}
