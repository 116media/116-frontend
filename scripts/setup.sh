#!/bin/bash

# 🛠️  116 Dashboard Development Setup Script
# Configures git hooks for code quality and branch protection

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "${BLUE}🚀 Starting 116 Dashboard development environment setup...${NC}"

# Setup git hooks
echo "${BLUE}🔧 Setting up git hooks...${NC}"
GIT_HOOKS_DIR=$(git rev-parse --git-path hooks)

if [ ! -d "$GIT_HOOKS_DIR" ]; then
    GIT_HOOKS_DIR=".git/hooks/"
    echo "${YELLOW}📁 Git hooks directory not found, creating: $GIT_HOOKS_DIR${NC}"
    mkdir -p $GIT_HOOKS_DIR
fi

echo "${BLUE}📋 Copying pre-commit and pre-push hooks...${NC}"
cp .git_hooks/pre-commit "$GIT_HOOKS_DIR"/pre-commit
cp .git_hooks/pre-push "$GIT_HOOKS_DIR"/pre-push

# Make hooks executable
echo "${BLUE}🔐 Making hooks executable...${NC}"
chmod +x "$GIT_HOOKS_DIR/pre-commit" "$GIT_HOOKS_DIR/pre-push"

echo "${GREEN}✅ Git hooks configured successfully!${NC}"
echo "${GREEN}🎉 Setup complete! Your development environment is ready${NC}"
echo ""
echo "${BLUE}📋 What was configured:${NC}"
echo "${YELLOW}  • Pre-commit hook runs lint-staged via yarn${NC}"
echo "${YELLOW}  • Pre-push hook enforces branch naming and protection rules${NC}"
echo ""
echo "${BLUE}💡 Next steps:${NC}"
echo "${YELLOW}  • Make your changes and commit them${NC}"
echo "${YELLOW}  • The pre-commit hook will automatically lint staged files${NC}"
echo "${YELLOW}  • The pre-push hook will validate your branch name and prevent pushes to protected branches${NC}"
