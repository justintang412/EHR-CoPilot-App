# Client-Side Unit Testing Guide

This document provides a practical guide to writing unit tests for our client-side React application. A robust testing suite is crucial for ensuring code quality, preventing regressions, and enabling confident refactoring.

## Testing Philosophy

Our goal is to test behavior, not implementation details. We want to be confident that our application works as a user would expect. We achieve this by testing three main categories of code:

1.  **Utility Functions:** Pure logic that manipulates data.
2.  **Presentational Components:** Simple components that render UI based on props.
3.  **Interactive Components:** Complex components that manage state and respond to user actions.

Our testing stack for the client is:

  * **Vitest:** The test runner.
  * **React Testing Library:** The core library for testing components.
  * **`@testing-library/user-event`:** The preferred tool for simulating user interactions.

-----

## 1\. Testing Utility Functions

Utility functions are pure JavaScript/TypeScript functions that do not involve React. They are the simplest to test. The goal is to verify that for a given input, the function returns the expected output.

### Example: `formatDateString`

This utility takes a date string and formats it for display.

**File Location:** `client/src/utils/formatters.ts`

```typescript
/**
 * Formats an ISO date string into a more readable format (e.g., "July 4, 2025").
 * @param isoString The date string to format.
 * @returns The formatted date string, or an empty string if the input is invalid.
 */
export function formatDateString(isoString: string | null | undefined): string {
  if (!isoString) {
    return '';
  }
  try {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return '';
  }
}
```

**Test File:** `client/src/utils/__tests__/formatters.test.ts`

This test uses only Vitest's `describe`, `it`, and `expect` functions.

```typescript
import { describe, it, expect } from 'vitest';
import { formatDateString } from '../formatters';

describe('formatDateString Utility', () => {
  it('should format a valid ISO date string correctly', () => {
    const isoDate = '2025-07-04T12:00:00.000Z';
    expect(formatDateString(isoDate)).toBe('July 4, 2025');
  });

  it('should return an empty string for a null input', () => {
    expect(formatDateString(null)).toBe('');
  });

  it('should return an empty string for an undefined input', () => {
    expect(formatDateString(undefined)).toBe('');
  });

  it('should return an empty string for an invalid date string', () => {
    expect(formatDateString('not-a-date')).toBe('');
  });
});
```

-----

## 2\. Testing Simple/Presentational Components

These tests ensure that components render the correct UI based on the `props` they receive.

### Example: `PatientBanner`

This component displays a patient's name and age.

**File Location:** `client/src/components/PatientBanner.tsx`

```tsx
import React from 'react';

type PatientBannerProps = {
  name: string;
  age: number;
};

export const PatientBanner: React.FC<PatientBannerProps> = ({ name, age }) => {
  return (
    <header>
      <h1>{name}</h1>
      <p>Age: {age}</p>
    </header>
  );
};
```

**Test File:** `client/src/components/__tests__/PatientBanner.test.tsx`

This test uses `render` from React Testing Library to render the component and `screen` to query the resulting DOM.

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PatientBanner } from '../PatientBanner';

describe('PatientBanner Component', () => {
  it('should display the patient name and age correctly', () => {
    // Arrange: Define props and render the component
    const patientProps = { name: 'Jane Doe', age: 42 };
    render(<PatientBanner {...patientProps} />);

    // Assert: Check if the content is rendered correctly
    const heading = screen.getByRole('heading', { name: /jane doe/i });
    expect(heading).toBeInTheDocument();

    const ageText = screen.getByText(`Age: ${patientProps.age}`);
    expect(ageText).toBeInTheDocument();
  });
});
```

-----

## 3\. Testing Complex/Interactive Components

These tests are crucial. They simulate real user behavior—like typing into forms and clicking buttons—to ensure the component responds correctly.

### Example: `LoginForm`

This component captures user credentials and calls an `onSubmit` function.

**File Location:** `client/src/components/LoginForm.tsx`

```tsx
import React, { useState } from 'react';

type Credentials = {
  username: string;
  password: string;
};

type LoginFormProps = {
  onSubmit: (credentials: Credentials) => void;
};

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Log In</button>
    </form>
  );
};
```

**Test File:** `client/src/components/__tests__/LoginForm.test.tsx`

This test uses `userEvent` to simulate typing and clicking and `vi.fn()` to create a "mock" function, allowing us to verify that it was called correctly.

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { LoginForm } from '../LoginForm';

describe('LoginForm Component', () => {
  it('should allow the user to enter credentials and submit the form', async () => {
    // Arrange: Create a mock function for the onSubmit prop
    const handleSubmitMock = vi.fn();
    render(<LoginForm onSubmit={handleSubmitMock} />);

    // Act: Simulate a user typing and clicking
    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    // Assert: Check if our mock function was called with the correct data
    expect(handleSubmitMock).toHaveBeenCalledTimes(1);
    expect(handleSubmitMock).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123',
    });
  });
});
```