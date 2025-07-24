// server/src/api/services/__tests__/patient.service.test.ts
import { calculateAge } from '../patient.service';

describe('Patient Service - calculateAge', () => {

  // IMPORTANT: We use fake timers to make our tests predictable.
  // This ensures the tests don't fail a year from now because "today" has changed.
  beforeAll(() => {
    jest.useFakeTimers();
    // Let's set the "current" date to July 4, 2025 for all tests in this file.
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