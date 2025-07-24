# Server-Side Unit Testing Guide

This document provides a practical guide to writing unit tests for our Express.js backend. The primary goal of server-side unit testing is to verify the correctness of our business logic in isolation, separate from the complexities of the Express framework, database connections, and network requests.

## Testing Philosophy

A backend unit test should focus on a single function or "unit" of logic. We want to ensure that given a specific input, our function produces the expected output or side effect. This is different from integration testing, where we test entire API endpoints.

Our testing stack for the server is:

  * **Jest:** The test runner and assertion library.
  * **`ts-jest`:** A preset to make Jest work seamlessly with TypeScript.

Key candidates for unit tests are:

1.  **Service Functions:** The core business logic of our application.
2.  **Utility Functions:** Any helper functions that perform pure data manipulation.

-----

## 1\. Testing Service Layer Logic

The `services` directory contains the heart of our application's business logic. Testing these functions is a top priority.

### Example: `calculateAge` Service Function

This function contains pure logic for calculating a patient's age based on their date of birth.

**File Location:** `server/src/api/services/patient.service.ts`

```typescript
/**
 * Calculates the age of a person based on their date of birth.
 * @param dateOfBirth The date of birth as a Date object.
 * @returns The age in years.
 */
export function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDifference = today.getMonth() - dateOfBirth.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  
  return age < 0 ? 0 : age;
}
```

**Test File:** `server/src/api/services/__tests__/patient.service.test.ts`

This test is notable because it uses `jest.useFakeTimers()`. This is a crucial technique for testing date-dependent logic. It allows us to "lock" the current date for the test, ensuring that the test will produce the same result today, tomorrow, or a year from now.

```typescript
import { calculateAge } from '../patient.service';

describe('Patient Service - calculateAge', () => {

  // IMPORTANT: We use fake timers to make our tests predictable.
  beforeAll(() => {
    jest.useFakeTimers();
    // We set the "current" date to July 4, 2025 for all tests in this file.
    jest.setSystemTime(new Date('2025-07-04'));
  });

  // Remember to clean up the fake timers after all tests are done.
  afterAll(() => {
    jest.useRealTimers();
  });

  it('should correctly calculate the age for a person whose birthday has passed this year', () => {
    const dob = new Date('1990-03-15'); // March 15, 1990
    expect(calculateAge(dob)).toBe(35);
  });

  it('should correctly calculate the age for a person whose birthday is today', () => {
    const dob = new Date('2005-07-04'); // July 4, 2005
    expect(calculateAge(dob)).toBe(20);
  });

  it('should correctly calculate the age for a person whose birthday is yet to come this year', () => {
    const dob = new Date('1995-12-25'); // December 25, 1995
    expect(calculateAge(dob)).toBe(29);
  });
  
  it('should return 0 for a date of birth in the future', () => {
    const dob = new Date('2030-01-01');
    expect(calculateAge(dob)).toBe(0);
  });
});
```

-----

## 2\. Testing Utility Functions

The same principles apply to any helper function you might write.

### Example: `capitalize` Utility

A simple utility to capitalize the first letter of a string.

**File Location:** `server/src/utils/stringUtils.ts`

```typescript
/**
 * Capitalizes the first letter of a string.
 * @param str The string to capitalize.
 * @returns The capitalized string, or an empty string if input is falsy.
 */
export function capitalize(str: string | null | undefined): string {
  if (!str) {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}
```

**Test File:** `server/src/utils/__tests__/stringUtils.test.ts`

```typescript
import { capitalize } from '../stringUtils';

describe('stringUtils - capitalize', () => {
  it('should capitalize the first letter of a lowercase string', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('should not change a string that is already capitalized', () => {
    expect(capitalize('World')).toBe('World');
  });

  it('should handle a single character string', () => {
    expect(capitalize('a')).toBe('A');
  });

  it('should return an empty string for an empty input', () => {
    expect(capitalize('')).toBe('');
  });

  it('should return an empty string for a null or undefined input', () => {
    expect(capitalize(null)).toBe('');
    expect(capitalize(undefined)).toBe('');
  });
});
```

-----

## How This Differs from Integration Tests

It is important to remember that these are **unit tests**. They test a single function's logic.

An **integration test**, like the one in `server/src/__tests__/app.test.ts`, tests how multiple parts work together. That test uses **Supertest** to make a simulated HTTP request to an endpoint, verifying the entire request-response cycle.

By writing both unit and integration tests, we can be confident that our individual logic functions are correct *and* that they are correctly wired together within our Express application.