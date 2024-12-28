import { NextResponse } from 'next/server';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../src/app'; // Assuming you have a custom server file to handle Next.js API routes
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Mocking the multer file upload process to prevent actual file upload
jest.mock('multer', () => {
  return jest.fn().mockImplementation(() => ({
    single: () => (req, res, next) => next(), // Mock the multer single file upload
  }));
});

// Mocking JWT token validation
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockReturnValue({ id: '1', role: 'user' }), // Mock a valid token
}));

describe('Test Upload API', () => {
  let validToken: string;

  beforeAll(() => {
    validToken = jwt.sign({ id: '1', role: 'user' }, 'JWT_SECRET'); // Generate a mock JWT token for the tests
  });

  it('should return 401 if no token is provided', async () => {
    const response = await request(app).post('/api/test-upload').send(); // No token provided
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Authorization token missing or invalid');
  });

  it('should return 200 if file is uploaded successfully', async () => {
    const filePath = path.resolve(__dirname, 'test-file.pdf'); // Mock file path

    const response = await request(app)
      .post('/api/test-upload')
      .set('Authorization', `Bearer ${validToken}`) // Set authorization header with token
      .attach('file', filePath); // Attach the file to the request

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('File uploaded successfully');
    expect(response.body.fileUrl).toMatch(/^\/uploads\/\d+-.*\.pdf$/); // Check file URL format
  });

  it('should return 400 if no file is uploaded', async () => {
    const response = await request(app)
      .post('/api/test-upload')
      .set('Authorization', `Bearer ${validToken}`); // No file uploaded

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('No file uploaded');
  });

  it('should return 500 if token is invalid', async () => {
    const invalidToken = 'invalid_token';
    const filePath = path.resolve(__dirname, 'test-file.pdf');

    const response = await request(app)
      .post('/api/test-upload')
      .set('Authorization', `Bearer ${invalidToken}`)
      .attach('file', filePath);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Invalid or expired token');
  });
});
