/**
 * Jest Unit Tests for Axios API Client Multipart Upload
 * Tests the Axios instance POST functionality with FormData for file uploads
 */

import api from '@/lib/api/axios';

describe('Api Client - MULTIPART', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1) Multipart upload returns data on 201 success', async () => {
    const mockResponse = { status: 201, data: { message: 'upload ok' } };

    // Create FormData with dummy file
    const formData = new FormData();
    const dummyFile = new Blob(['file content'], { type: 'text/plain' });
    formData.append('file', dummyFile, 'test-file.txt');

    jest.spyOn(api, 'post').mockResolvedValueOnce(mockResponse);

    const res = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    expect(res.status).toBe(201);
    expect(res.data.message).toBe('upload ok');
    expect(api.post).toHaveBeenCalledWith(
      '/upload',
      formData,
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'multipart/form-data',
        }),
      })
    );
  });

  test('2) Multipart upload throws error on non-2xx', async () => {
    const mockError = {
      response: { status: 400, data: { message: 'Upload failed' } },
    };

    // Create FormData with dummy file
    const formData = new FormData();
    const dummyFile = new Blob(['file content'], { type: 'text/plain' });
    formData.append('file', dummyFile, 'test-file.txt');

    jest.spyOn(api, 'post').mockRejectedValueOnce(mockError);

    try {
      await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fail('Expected error to be thrown');
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toContain('Upload failed');
    }
  });
});
