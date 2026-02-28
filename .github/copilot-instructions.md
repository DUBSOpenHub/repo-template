# Project Instructions

<!-- Add project-specific instructions below this line -->


## Security — Secure Future Initiative (SFI)

When working in this repository, always apply these security principles:

- **Never commit secrets** — API keys, tokens, passwords, or connection strings must never appear in code or config files. Use environment variables or secret managers.
- **Validate all inputs** — Treat user input, API responses, and file contents as untrusted. Sanitize before use.
- **Dependency awareness** — Flag outdated or vulnerable dependencies when encountered. Prefer pinned versions.
- **Least privilege** — Request only the minimum permissions needed. Avoid broad OAuth scopes or wildcard IAM policies.
- **Secure defaults** — Default to HTTPS, encrypted storage, and authenticated endpoints. Opt-in to less secure options, never opt-out of secure ones.

## Responsible AI (RAI)

When generating or modifying code, content, or configurations:

- **Transparency** — When AI-generated content is user-facing, make it clear that AI was involved. Do not impersonate humans.
- **Fairness** — Avoid generating content that stereotypes, excludes, or discriminates based on protected characteristics.
- **Human oversight** — Recommend human review for high-stakes outputs (financial calculations, access control, health-related content).
- **Privacy** — Do not log, store, or transmit personal data beyond what the feature explicitly requires. Minimize data collection.
- **Reliability** — Include error handling and fallback behavior. Do not let AI failures cascade into silent data corruption.

## Accessibility (WCAG 2.1 AA)

All UI work in this repository must meet WCAG 2.1 AA standards:

- **Semantic HTML** — Use proper heading hierarchy (h1→h2→h3), landmark elements (nav, main, aside), and native form controls. Avoid div/span for interactive elements.
- **Keyboard navigation** — All interactive elements must be reachable and operable via keyboard. Maintain visible focus indicators. Never remove outline styles without a replacement.
- **Color contrast** — Text must meet 4.5:1 contrast ratio (3:1 for large text). Never use color as the only indicator of state or meaning.
- **ARIA usage** — Use ARIA only when native HTML semantics are insufficient. Always pair aria-label with visible text where possible. Test with a screen reader.
- **Alt text** — All meaningful images must have descriptive alt text. Decorative images use alt="". Never use "image of" or "photo of" prefixes.
- **Responsive design** — Content must be usable at 200% zoom and on viewport widths down to 320px without horizontal scrolling.
