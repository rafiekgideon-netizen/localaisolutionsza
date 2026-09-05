---
name: aislop
description: AI Code Quality Gate and cleaner from https://github.com/scanaislop/aislop.git that scans code for AI slop, dead code, complexity, swallowed exceptions, accessibility issues, security advisories, and unused variables.
---

# aislop: AI Code Quality Gate

Source: [https://github.com/scanaislop/aislop.git](https://github.com/scanaislop/aislop.git)

## Overview
`aislop` catches patterns that AI coding agents leave behind:
- Narrative comments above self-explanatory code
- Swallowed exceptions and empty catch blocks
- Hardcoded URLs and environment leaks
- Hallucinated or unused imports
- Unused variables and dead code
- Excessive function length and deep nesting
- Duplicate code blocks
- Accessibility omissions (`jsx-a11y`)
- Dependency vulnerabilities

## Commands
- `npx aislop scan` / `npm run aislop`: Runs the deterministic quality scanner and produces a score from 0-100.
- `npx aislop fix`: Applies deterministic auto-fixes for mechanical issues (e.g. unused imports, dead patterns).
- `npx aislop ci`: Quality gate mode for CI with exit codes based on quality thresholds.
- `npx aislop doctor`: Checks installed engine definitions and project coverage.
