/**
 * Script to change commit dates in Git history
 * This provides a TypeScript/Node.js way to change commit dates
 */

import { execSync } from 'child_process';

interface CommitDateChange {
  commitHash: string;
  newDate: string;
}

/**
 * Change the date of the last commit
 */
function amendLastCommit(newDate: string): void {
  console.log(`📅 Changing last commit date to: ${newDate}`);
  try {
    execSync(`git commit --amend --date="${newDate}" --no-edit`, { stdio: 'inherit' });
    console.log('✅ Last commit date changed successfully!');
    console.log('⚠️  You may need to force-push: git push --force-with-lease');
  } catch (error) {
    console.error('❌ Failed to change commit date:', error);
  }
}

/**
 * Change dates for multiple commits using interactive rebase
 */
function changeMultipleCommits(commits: CommitDateChange[]): void {
  console.log(`📅 Changing dates for ${commits.length} commits...`);
  console.log('\n⚠️  This requires interactive rebase. Steps:');
  console.log('1. Run: git rebase -i HEAD~' + commits.length);
  console.log('2. Change "pick" to "edit" for commits you want to change');
  console.log('3. For each commit, run:');
  commits.forEach(({ commitHash, newDate }) => {
    console.log(`   GIT_AUTHOR_DATE="${newDate}" GIT_COMMITTER_DATE="${newDate}" git commit --amend --no-edit --date="${newDate}"`);
  });
  console.log('4. Continue: git rebase --continue');
}

/**
 * Change all commits to the same date (bulk operation)
 */
function changeAllCommitsToDate(newDate: string, numCommits: number = 10): void {
  console.log(`📅 Changing last ${numCommits} commits to: ${newDate}`);
  console.log('\n⚠️  WARNING: This will rewrite Git history!');
  console.log('Make sure you have a backup or are okay with force-pushing.\n');
  
  const command = `git filter-branch -f --env-filter '
export GIT_AUTHOR_DATE="${newDate}"
export GIT_COMMITTER_DATE="${newDate}"
' HEAD~${numCommits}..HEAD`;
  
  console.log('Run this command:');
  console.log(command);
  console.log('\nThen force-push: git push --force-with-lease origin main');
}

// CLI interface
const args = process.argv.slice(2);
const command = args[0];

if (command === 'amend') {
  const date = args[1] || new Date().toISOString().replace('T', ' ').slice(0, 19);
  amendLastCommit(date);
} else if (command === 'bulk') {
  const date = args[1] || new Date().toISOString().replace('T', ' ').slice(0, 19);
  const numCommits = parseInt(args[2] || '10');
  changeAllCommitsToDate(date, numCommits);
} else {
  console.log('Usage:');
  console.log('  npx ts-node scripts/change-commit-dates.ts amend [date]');
  console.log('  npx ts-node scripts/change-commit-dates.ts bulk [date] [num-commits]');
  console.log('');
  console.log('Examples:');
  console.log('  npx ts-node scripts/change-commit-dates.ts amend "2026-02-05 10:00:00"');
  console.log('  npx ts-node scripts/change-commit-dates.ts bulk "2026-02-05 10:00:00" 10');
}

