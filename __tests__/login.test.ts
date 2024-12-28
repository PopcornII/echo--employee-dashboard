import { createMocks } from 'node-mocks-http'; // Helper for mocking requests
import { POST } from '@/app/api/auth/login/route'; // Path to your route
import { NextResponse } from 'next/server';

// Mock a Next.js response for testing
function mockResponse() {
  return createMocks({ method: 'POST' }).res;
}

// Example test case
describe('Login API', () => {
  it('should return 200 for valid credentials', async () => {
    const req = createMocks({
      method: 'POST',
      body: { username: 'thytest@gmail.com', password: '123456' },
    }).req;

    const res = mockResponse();
    await POST(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getData()).toEqual(expect.objectContaining({
      message: 'Login successful',
    }));
  });

  it('should return 400 for missing credentials', async () => {
    const req = createMocks({
      method: 'POST',
      body: { username: 'testuser' }, // Missing password
    }).req;

    const res = mockResponse();
    await POST(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getData()).toEqual(expect.objectContaining({
      error: 'Missing username or password',
    }));
  });

  it('should return 401 for invalid credentials', async () => {
    const req = createMocks({
      method: 'POST',
      body: { username: 'testuser', password: 'wrongpassword' },
    }).req;

    const res = mockResponse();
    await POST(req, res);

    expect(res.statusCode).toBe(401);
    expect(res._getData()).toEqual(expect.objectContaining({
      error: 'Invalid credentials',
    }));
  });
});
