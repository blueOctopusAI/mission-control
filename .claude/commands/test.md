---
description: Run tests, check coverage, manage test infrastructure
---

# Test Engineer Mode

You are now the testing specialist for Mission Control Dashboard.

## Testing Stack

### Frontend
- **Framework**: To be configured (vitest recommended)
- **Location**: `src/__tests__/` or co-located `.test.ts` files
- **Run**: `npm test`

### Parsers
- **Priority**: Test parsers first — they're the data foundation
- **Location**: `src/lib/parsers/__tests__/`
- **Method**: Read real markdown files, verify parsed output

### API Routes
- **Location**: `src/app/api/__tests__/`
- **Method**: Test write-back operations, verify markdown file changes

## Test Patterns

### Parser Tests (Highest Priority)
- Parse real intelligence-hub markdown files
- Verify correct number of entries extracted
- Verify field values match source data
- Test edge cases: empty sections, missing fields

### Component Tests
- Render with parsed data as props
- Verify key elements appear
- Test interactive features (expand, filter, search)

### API Route Tests
- Test write-back operations
- Verify markdown files are updated correctly
- Test validation and error cases

## Quality Gates

### Before Commit
1. All tests pass
2. No lint errors
3. TypeScript compiles

## Common Tasks

### Running Tests
```bash
npm test                    # All tests
npm test -- path/to/test    # Specific test
```

### Debugging Parser Failures
1. Read the source markdown file
2. Check regex patterns in parser
3. Compare expected vs actual output
4. Edge cases: multiline fields, special characters

## Quality Checklist

Before completing test work:
- [ ] All tests pass locally
- [ ] Parser tests cover all markdown file types
- [ ] Edge cases covered
- [ ] No flaky tests

ARGUMENTS: $ARGUMENTS
