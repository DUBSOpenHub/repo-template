# Agents

## Overview

This is a project template repo enforcing Microsoft's Software Foundation Initiative (SFI), Responsible AI, and Accessibility standards. It ships with a deterministic test suite and baseline compliance files. There are no pre-built Copilot CLI agents included — this section documents how GitHub Copilot and AI agents can be used effectively with projects created from this template.

## Using GitHub Copilot with This Template

### Copilot CLI

Projects created from this template work with Copilot CLI for standard development tasks:

- **Code generation**: Ask Copilot to scaffold new features following the existing patterns
- **Test writing**: Copilot can generate tests for the JS (`tests/js/`) and Python (`tests/python/`) suites included in the template
- **Compliance checks**: Ask Copilot to verify code against the SFI, Responsible AI, and Accessibility requirements documented in this repo
- **Documentation**: Copilot can help fill in the README placeholders and generate contributing guides

### Recommended Copilot Workflows

```
# Generate implementation scaffolding
"Add a new module following the patterns in this repo"

# Write tests for new code
"Write tests for <module> in the existing test suite format"

# Check compliance
"Review this code for Responsible AI issues"
"Check this UI component for accessibility (WCAG 2.1 AA)"
```

## Configuration

- **Test suite**: Deterministic with anti-flake guardrails. Run `cd tests/js && npm test` (JavaScript) or `cd tests/python && pytest` (Python).
- **Compliance baseline**: SECURITY.md, CODE_OF_CONDUCT.md, and accessibility standards are pre-configured
- **CLA**: Contributions require a signed [Contributor License Agreement](https://cla.opensource.microsoft.com)
- **Code of Conduct**: [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/)

## Adding Agents to Your Project

If you are building a project from this template that includes Copilot CLI agents or skills, add them to:
- `agents/` — for `.agent.md` custom agent files
- `skills/<skill-name>/SKILL.md` — for Copilot CLI skill files

Update this AGENTS.md with descriptions following the format above.
