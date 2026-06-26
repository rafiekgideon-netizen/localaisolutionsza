# GitHub CLI Installation & Setup Guide

## Installation

### macOS
```bash
# Using Homebrew
brew install gh

# Verify installation
gh --version
```

### Windows
```bash
# Using Winget
winget install GitHub.cli

# Using Chocolatey
choco install gh

# Verify installation
gh --version
```

### Linux
```bash
# Ubuntu/Debian
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-key C99B11DEB97541F0
sudo apt-add-repository https://cli.github.com/packages
sudo apt update
sudo apt install gh

# Fedora/RHEL
sudo dnf install gh

# Arch Linux
sudo pacman -S github-cli

# Verify installation
gh --version
```

## Authentication

### Login to GitHub
```bash
gh auth login
```

You'll be prompted to:
1. Select your GitHub host (GitHub.com or GitHub Enterprise)
2. Choose authentication method:
   - **HTTPS** (recommended for most users)
   - **SSH** (if you have SSH keys configured)
3. Enter your authentication token or follow the browser-based login

### Verify Authentication
```bash
gh auth status
```

### Logout
```bash
gh auth logout
```

## Quick Start Commands

### Clone a Repository
```bash
gh repo clone rafiekgideon-netizen/localaisolutionsza
```

### Create a Pull Request
```bash
gh pr create --title "Your PR Title" --body "Description of changes"
```

### List Issues
```bash
gh issue list
```

### View Issues
```bash
gh issue view <issue-number>
```

### Create an Issue
```bash
gh issue create --title "Issue Title" --body "Issue description"
```

### Check Repository Status
```bash
gh repo view
```

## Configuration

### Set Default Editor
```bash
gh config set editor "vim"  # or your preferred editor
```

### Set Git Protocol
```bash
gh config set git_protocol ssh  # or https
```

### View All Configuration
```bash
gh config list
```

## Useful Aliases

Create custom commands for frequently used operations:

```bash
# Add to ~/.config/gh/config.yml (Unix) or %APPDATA%\GitHub CLI\config.yml (Windows)
aliases:
  co: pr checkout
  prs: pr list --state all
  issues: issue list --state open
  clone-ssh: repo clone --clone=ssh
```

## Troubleshooting

### Authentication Issues
```bash
# Reset authentication
gh auth logout
gh auth login
```

### Update GitHub CLI
```bash
# macOS (Homebrew)
brew upgrade gh

# Windows (Winget)
winget upgrade GitHub.cli

# Linux (package manager)
sudo apt upgrade gh  # or equivalent for your distro
```

### Get Help
```bash
# General help
gh help

# Command-specific help
gh pr --help
gh issue --help
gh repo --help
```

## Additional Resources

- [GitHub CLI Documentation](https://cli.github.com/manual)
- [GitHub CLI GitHub Repository](https://github.com/cli/cli)
- [GitHub CLI Releases](https://github.com/cli/cli/releases)

## Getting Started with localaisolutionsza

After installing GitHub CLI, get started with this project:

```bash
# Clone the repository
gh repo clone rafiekgideon-netizen/localaisolutionsza

# Navigate to the project
cd localaisolutionsza

# Install dependencies (TypeScript project)
npm install

# Create a new branch for your work
git checkout -b feature/your-feature-name

# Make your changes and commit
git add .
git commit -m "Your commit message"

# Push your branch and create a PR
git push origin feature/your-feature-name
gh pr create --title "Your PR Title" --body "Description"
```

Happy coding! 🚀
