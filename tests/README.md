# Test Suite

A deterministic, agent-friendly test suite with zero flaky patterns.

## Anti-Flake Rules

| Banned Pattern | Use Instead |
|---|---|
| `setTimeout` / `sleep` in assertions | Deterministic state checks |
| Real network calls | `nock` / `responses` / `httpx` mocks |
| `Date.now()` / `new Date()` | Injected clock / frozen time |
| Random data without seeds | Seeded generators or fixed fixtures |
| File system side effects | Temp dirs with guaranteed cleanup |
| Shared mutable state between tests | Fresh state per test via setup/teardown |
| Order-dependent tests | Each test is independently runnable |

## Quick Start

### JavaScript (Jest)

```bash
cd tests/js
npm install
npm test
```

### Python (pytest)

```bash
cd tests/python
pip install -r requirements.txt
pytest
```

## Structure

```
tests/
├── fixtures/              # Shared deterministic test data
├── js/
│   ├── unit/              # Pure function tests
│   ├── integration/       # Component tests (mocked deps)
│   ├── edge-cases/        # Boundary conditions
│   └── regression/        # Bug fix verification
└── python/
    ├── unit/              # Pure function tests
    ├── integration/       # Component tests (mocked deps)
    ├── edge_cases/        # Boundary conditions
    └── regression/        # Bug fix verification
```

## Writing Agent-Compatible Tests

1. **Clear exit codes** — 0 = all pass, non-zero = failure
2. **Structured output** — JUnit XML for CI, JSON for programmatic parsing
3. **No interactive prompts** — everything runs headless
4. **Deterministic ordering** — no test depends on another test's execution
5. **Fast execution** — under 30 seconds for the full unit suite
6. **Descriptive failure messages** — the assertion message alone should explain what broke
