/**
 * Script to rename repository from naomillm to naomi-network
 * This preserves all commit history
 */

import { execSync } from 'child_process';
import * as readline from 'readline';

const OLD_REPO = 'naomillm';
const NEW_REPO = 'naomi-network';
const ORG = 'eternal-labs';

async function main() {
  console.log(`🔄 Renaming repository from ${OLD_REPO} to ${NEW_REPO}\n`);

  try {
    // Step 1: Check current remote
    console.log('📋 Step 1: Checking current remote...');
    const currentRemote = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    console.log(`   Current remote: ${currentRemote}\n`);

    // Step 2: Verify we're in the right repo
    if (!currentRemote.includes(OLD_REPO)) {
      console.log(`⚠️  Warning: Current remote doesn't contain "${OLD_REPO}"`);
      console.log('   Continuing anyway...\n');
    }

    // Step 3: Check commit history
    console.log('📋 Step 2: Verifying commit history...');
    const commitCount = execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim();
    console.log(`   ✅ Found ${commitCount} commits in history\n`);

    // Step 4: Update remote URL
    console.log('📋 Step 3: Updating remote URL...');
    const newRemote = `git@github.com:${ORG}/${NEW_REPO}.git`;
    execSync(`git remote set-url origin "${newRemote}"`, { stdio: 'inherit' });
    console.log(`   ✅ Remote updated to: ${newRemote}\n`);

    // Step 5: Verify remote
    console.log('📋 Step 4: Verifying new remote...');
    const verifyRemote = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    console.log(`   ✅ Verified: ${verifyRemote}\n`);

    // Step 6: Instructions for GitHub
    console.log('📋 Step 5: GitHub Repository Setup');
    console.log('   ⚠️  IMPORTANT: You need to create/rename the repository on GitHub first!\n');
    console.log('   Option A - Rename existing repository:');
    console.log(`      1. Go to https://github.com/${ORG}/${OLD_REPO}/settings`);
    console.log('      2. Scroll to "Repository name" section');
    console.log(`      3. Change name to "${NEW_REPO}"`);
    console.log('      4. Click "Rename"\n');
    console.log('   Option B - Create new repository:');
    console.log(`      1. Go to https://github.com/${ORG}?tab=repositories`);
    console.log(`      2. Click "New"`);
    console.log(`      3. Name it "${NEW_REPO}"`);
    console.log('      4. DO NOT initialize with README, .gitignore, or license');
    console.log('      5. Click "Create repository"\n');

    // Step 7: Ask if ready to push
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise<void>((resolve) => {
      rl.question('   Have you created/renamed the repository on GitHub? (yes/no): ', async (answer) => {
        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
          console.log('\n📋 Step 6: Pushing all history to new repository...\n');
          try {
            execSync('git push -u origin --all', { stdio: 'inherit' });
            execSync('git push -u origin --tags', { stdio: 'inherit' });
            console.log('\n✅ Repository renamed successfully!');
            console.log(`   Old: ${ORG}/${OLD_REPO}`);
            console.log(`   New: ${ORG}/${NEW_REPO}`);
            console.log(`   All ${commitCount} commits preserved!`);
            console.log(`\n🔗 New repository URL: https://github.com/${ORG}/${NEW_REPO}`);
          } catch (error) {
            console.error('\n❌ Push failed. Make sure:');
            console.error('   1. The repository exists on GitHub');
            console.error('   2. You have push access');
            console.error('   3. SSH keys are set up correctly');
          }
        } else {
          console.log('\n⏸️  Skipping push. Run this script again when ready, or manually run:');
          console.log('   git push -u origin --all');
          console.log('   git push -u origin --tags');
        }
        rl.close();
        resolve();
      });
    });

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);

