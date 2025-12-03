#!/bin/bash

# GACE - Quick Push to GitHub Script
# This script helps you quickly commit and push changes

echo "🚀 GACE - Push to GitHub"
echo "========================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git not initialized. Initializing now..."
    git init
    git branch -M main
    git remote add origin https://github.com/dju78/gace.git
    echo "✅ Git initialized!"
    echo ""
fi

# Show current status
echo "📋 Current status:"
git status --short
echo ""

# Ask for confirmation
read -p "Do you want to add all files? (y/n): " add_all

if [ "$add_all" = "y" ] || [ "$add_all" = "Y" ]; then
    echo "📦 Adding all files..."
    git add .
    echo "✅ Files staged!"
else
    echo "ℹ️  Please stage files manually with: git add <filename>"
    exit 0
fi

echo ""

# Show what will be committed
echo "📝 Files to be committed:"
git status --short
echo ""

# Ask for commit message
echo "Enter commit message (or press Enter for default):"
read -r commit_message

if [ -z "$commit_message" ]; then
    commit_message="Update GACE platform - $(date +%Y-%m-%d)"
fi

# Commit
echo ""
echo "💾 Committing changes..."
git commit -m "$commit_message"

if [ $? -ne 0 ]; then
    echo "❌ Commit failed. Please check the errors above."
    exit 1
fi

echo "✅ Committed successfully!"
echo ""

# Push
echo "🚀 Pushing to GitHub..."
git push origin main

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Push failed. Trying with upstream flag..."
    git push -u origin main
    
    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ Push still failed. Common solutions:"
        echo "   1. Make sure you're authenticated with GitHub"
        echo "   2. Try: git pull origin main --rebase"
        echo "   3. Then run this script again"
        exit 1
    fi
fi

echo ""
echo "✅ Successfully pushed to GitHub!"
echo "🌐 View your repository at: https://github.com/dju78/gace"
echo ""
echo "🎉 Done!"
