# @repo/utilities

Shared utility functions for the Strava Tracker monorepo.

## Installation

This package is automatically available in the monorepo. Import it in your apps or packages:

```typescript
// In any app or package
import { formatDate, getWeekRange, isSameDay } from "@repo/utilities";
```

## Usage

### Calendar Utilities

```typescript
import { formatDate, getWeekRange, getDateRange } from "@repo/utilities";

// Format dates
const formatted = formatDate(new Date(), "MMM d, yyyy");

// Get week range
const { start, end } = getWeekRange(new Date());

// Get date range
const dates = getDateRange(new Date("2024-01-01"), new Date("2024-01-07"));
```

## Development

```bash
# Run in watch mode
yarn dev

# Build for production
yarn build

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Generate coverage report
yarn test:coverage

# Type check
yarn check-types
```

## Adding New Utilities

1. Create a new file in `src/` (e.g., `string-utilities.ts`)
2. Export your functions from the file
3. Add exports to `src/index.ts`
4. Create corresponding test file (e.g., `string-utilities.test.ts`)
5. Write tests using Vitest

Example:

```typescript
// src/string-utilities.ts
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// src/string-utilities.test.ts
import { describe, it, expect } from "vitest";
import { capitalize } from "./string-utilities";

describe("capitalize", () => {
  it("capitalizes first letter", () => {
    expect(capitalize("hello")).toBe("Hello");
  });
});

// src/index.ts
export * from "./string-utilities";
```
