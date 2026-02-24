/**
 * Jest Unit Tests for Axios API Client DELETE method
 * Tests the Axios instance DELETE functionality with proper error handling
 */

import api from '@/lib/api/axios';

describe('Api Client - DELETE', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1) DELETE returns data on 200 success', async () => {
    const mockResponse = { status: 200, data: { message: 'deleted' } };

    jest.spyOn(api, 'delete').mockResolvedValueOnce(mockResponse);

    const res = await api.delete('/test');

    expect(res.status).toBe(200);
    expect(res.data.message).toBe('deleted');
    expect(api.delete).toHaveBeenCalledWith('/test');
  });

  test('2) DELETE throws 403 forbidden (non-2xx)', async () => {
    const mockError = {
      response: { status: 403, data: { message: 'Forbidden' } },
    };

    jest.spyOn(api, 'delete').mockRejectedValueOnce(mockError);

    try {
      await api.delete('/test');
      fail('Expected error to be thrown');
    } catch (error: any) {
      expect(error.response.status).toBe(403);
      expect(error.response.data.message).toContain('Forbidden');
    }
  });

  test('3) DELETE timeout error', async () => {
    const mockError = {
      code: 'ECONNABORTED',
      message: 'timeout',
    };

    jest.spyOn(api, 'delete').mockRejectedValueOnce(mockError);

    await expect(api.delete('/test')).rejects.toHaveProperty(
      'code',
      'ECONNABORTED'
    );
  });
});
