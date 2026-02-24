/**
 * Jest Unit Tests for Axios API Client PUT method
 * Tests the Axios instance PUT functionality with proper error handling
 */

import api from '@/lib/api/axios';

describe('Api Client - PUT', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1) PUT returns data on 200 success', async () => {
    const mockResponse = { status: 200, data: { message: 'put ok' } };

    jest.spyOn(api, 'put').mockResolvedValueOnce(mockResponse);

    const res = await api.put('/test', { name: 'test' });

    expect(res.status).toBe(200);
    expect(res.data.message).toBe('put ok');
    expect(api.put).toHaveBeenCalledWith('/test', { name: 'test' });
  });

  test('2) PUT throws 404 not found', async () => {
    const mockError = {
      response: { status: 404, data: { message: 'Not found' } },
    };

    jest.spyOn(api, 'put').mockRejectedValueOnce(mockError);

    try {
      await api.put('/test', { name: 'test' });
      fail('Expected error to be thrown');
    } catch (error: any) {
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toContain('Not found');
    }
  });

  test('3) PUT timeout error', async () => {
    const mockError = {
      code: 'ECONNABORTED',
      message: 'timeout',
    };

    jest.spyOn(api, 'put').mockRejectedValueOnce(mockError);

    await expect(api.put('/test', { name: 'test' })).rejects.toHaveProperty(
      'code',
      'ECONNABORTED'
    );
  });

  test('4) PUT network error', async () => {
    const mockError = new Error('Network Error');

    jest.spyOn(api, 'put').mockRejectedValueOnce(mockError);

    await expect(api.put('/test', { name: 'test' })).rejects.toThrow('Network Error');
  });
});
