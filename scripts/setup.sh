#!/bin/bash

# 116 Frontend Development Setup Script
# Configures git hooks for code quality and branch protection

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

printf "${BLUE}🚀 Starting 116 Frontend development environment setup...${NC}\n"

# Setup git hooks
printf "${BLUE}🔧 Setting up git hooks...${NC}\n"
GIT_HOOKS_DIR=$(git rev-parse --git-path hooks)

if [ ! -d "$GIT_HOOKS_DIR" ]; then
    GIT_HOOKS_DIR=".git/hooks/"
    printf "${YELLOW}📁 Git hooks directory not found, creating: $GIT_HOOKS_DIR${NC}\n"
    mkdir -p $GIT_HOOKS_DIR
fi

printf "${BLUE}📋 Copying pre-commit and pre-push hooks...${NC}\n"
cp .git_hooks/pre-commit "$GIT_HOOKS_DIR"/pre-commit
cp .git_hooks/pre-push "$GIT_HOOKS_DIR"/pre-push

# Make hooks executable
printf "${BLUE}🔐 Making hooks executable...${NC}\n"
chmod +x "$GIT_HOOKS_DIR/pre-commit" "$GIT_HOOKS_DIR/pre-push"

printf "${GREEN}✅ Git hooks configured successfully!${NC}\n"
printf "${GREEN}🎉 Setup complete! Your development environment is ready${NC}\n"
printf "\n"
printf "${BLUE}📋 What was configured:${NC}\n"
printf "${YELLOW}  • Pre-commit hook runs lint-staged via yarn${NC}\n"
printf "${YELLOW}  • Pre-push hook enforces branch naming and protection rules${NC}\n"
printf "\n"
printf "${BLUE}💡 Next steps:${NC}\n"
printf "${YELLOW}  • Make your changes and commit them${NC}\n"
printf "${YELLOW}  • The pre-commit hook will automatically lint staged files${NC}\n"
printf "${YELLOW}  • The pre-push hook will validate your branch name and prevent pushes to protected branches${NC}\n"
