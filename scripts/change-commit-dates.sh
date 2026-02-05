#!/bin/bash
# Script to change commit dates in Git history
# Usage: ./change-commit-dates.sh [date] [number-of-commits]

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}⚠️  WARNING: This will rewrite Git history!${NC}"
echo -e "${YELLOW}   Make sure you have a backup or are okay with force-pushing.${NC}"
echo ""

# Get parameters
NEW_DATE=${1:-"2026-02-05 10:00:00"}
NUM_COMMITS=${2:-10}

echo "Changing dates for last $NUM_COMMITS commits to: $NEW_DATE"
echo ""

# Method 1: Interactive rebase (recommended for specific commits)
echo -e "${GREEN}Method 1: Interactive Rebase${NC}"
echo "Run: git rebase -i HEAD~$NUM_COMMITS"
echo "Then for each commit, change 'pick' to 'edit'"
echo "Then run:"
echo "  GIT_AUTHOR_DATE=\"$NEW_DATE\" GIT_COMMITTER_DATE=\"$NEW_DATE\" git commit --amend --no-edit --date=\"$NEW_DATE\""
echo "  git rebase --continue"
echo ""

# Method 2: Filter-branch (for bulk changes)
echo -e "${GREEN}Method 2: Filter-Branch (Bulk Change)${NC}"
echo "This will change ALL commits to the same date:"
echo ""
echo "git filter-branch -f --env-filter '"
echo "  export GIT_AUTHOR_DATE=\"$NEW_DATE\""
echo "  export GIT_COMMITTER_DATE=\"$NEW_DATE\""
echo "' HEAD~$NUM_COMMITS..HEAD"
echo ""

# Method 3: Amend last commit
echo -e "${GREEN}Method 3: Amend Last Commit${NC}"
echo "git commit --amend --date=\"$NEW_DATE\" --no-edit"
echo ""

echo -e "${RED}After changing dates, you'll need to force-push:${NC}"
echo "git push --force-with-lease origin main"
echo ""

