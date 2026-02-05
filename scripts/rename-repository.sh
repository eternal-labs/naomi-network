#!/bin/bash
# Script to rename repository from naomillm to naomi-network
# This preserves all commit history

set -e

OLD_REPO="naomillm"
NEW_REPO="naomi-network"
ORG="eternal-labs"

echo "🔄 Renaming repository from $OLD_REPO to $NEW_REPO"
echo ""

# Step 1: Check current remote
echo "📋 Step 1: Checking current remote..."
CURRENT_REMOTE=$(git remote get-url origin)
echo "   Current remote: $CURRENT_REMOTE"
echo ""

# Step 2: Update remote URL to new repository name
echo "📋 Step 2: Updating remote URL..."
NEW_REMOTE="git@github.com:$ORG/$NEW_REPO.git"
git remote set-url origin "$NEW_REMOTE"
echo "   ✅ Remote updated to: $NEW_REMOTE"
echo ""

# Step 3: Verify commit history is intact
echo "📋 Step 3: Verifying commit history..."
COMMIT_COUNT=$(git rev-list --count HEAD)
echo "   ✅ Found $COMMIT_COUNT commits in history"
echo ""

# Step 4: Push all branches and tags to new repository
echo "📋 Step 4: Pushing all history to new repository..."
echo "   ⚠️  Make sure the repository '$NEW_REPO' exists on GitHub first!"
echo ""
read -p "   Press Enter to continue with push, or Ctrl+C to cancel..."

git push -u origin --all
git push -u origin --tags

echo ""
echo "✅ Repository renamed successfully!"
echo "   Old: $ORG/$OLD_REPO"
echo "   New: $ORG/$NEW_REPO"
echo "   All commit history preserved!"
echo ""
echo "🔗 New repository URL: https://github.com/$ORG/$NEW_REPO"

