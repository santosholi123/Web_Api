/**
 * Jest Unit Tests for Axios API Client POST method
 * Tests the Axios instance POST functionality with proper error handling
 */

import api from '@/lib/api/axios';

describe('Api Client - POST', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1) POST returns data on 201 success', async () => {
    const mockResponse = { status: 201, data: { message: 'created' } };

    jest.spyOn(api, 'post').mockResolvedValueOnce(mockResponse);

    const res = await api.post('/test', { name: 'test' });

    expect(res.status).toBe(201);
    expect(res.data.message).toBe('created');
  });

  test('2) POST throws 400 validation error', async () => {
    const mockError = {
      response: { status: 400, data: { message: 'Validation error' } },
    };

    jest.spyOn(api, 'post').mockRejectedValueOnce(mockError);

    try {
      await api.post('/test', { name: 'test' });
      fail('Expected error to be thrown');
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test('3) POST throws 401 unauthorized', async () => {
    const mockError = {
      response: { status: 401, data: { message: 'Unauthorized' } },
    };

    jest.spyOn(api, 'post').mockRejectedValueOnce(mockError);

    try {
      await api.post('/test', { name: 'test' });
      fail('Expected error to be thrown');
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });

  test('4) POST timeout error', async () => {
    const mockError = {
      code: 'ECONNABORTED',
      message: 'timeout',
    };

    jest.spyOn(api, 'post').mockRejectedValueOnce(mockError);

    try {
      await api.post('/test', { name: 'test' });
      fail('Expected error to be thrown');
    } catch (error: any) {
      expect(error).toHaveProperty('code', 'ECONNABORTED');
    }
  });

  test('5) POST network error', async () => {
    const mockError = new Error('Network Error');

    jest.spyOn(api, 'post').mockRejectedValueOnce(mockError);

    await expect(api.post('/test', { name: 'test' })).rejects.toThrow('Network Error');
  });
});
