// server/src/__tests__/app.test.ts
import request from 'supertest';
import app from '../app'; // Import the app object

describe('GET /', () => {
  it('should return 200 OK and the welcome message', async () => {
    // Act: Send a request to the app
    const response = await request(app).get('/');

    // Assert: Check the response
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('EHR Backend API is running...');
  });
});