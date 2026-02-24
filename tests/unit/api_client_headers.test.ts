/**
 * Jest Unit Tests for Axios Request Interceptor
 * Tests the Authorization header injection from localStorage token
 */

import api from '@/lib/api/axios';

describe('Api Client - HEADERS / INTERCEPTOR', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
      },
      writable: true,
    });
  });

  test('1) Adds Authorization header when token exists', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue('abc123');

    const interceptor = (api.interceptors.request as any).handlers[0].fulfilled;
    const config: any = { headers: {} };

    const result = interceptor(config);

    expect(result.headers.Authorization).toBe('Bearer abc123');
  });

  test('2) Does not add Authorization when token is null', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);

    const interceptor = (api.interceptors.request as any).handlers[0].fulfilled;
    const config: any = { headers: {} };

    const result = interceptor(config);

    expect(result.headers.Authorization).toBeUndefined();
  });

  test('3) Preserves existing headers', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue('token');

    const interceptor = (api.interceptors.request as any).handlers[0].fulfilled;
    const config: any = {
      headers: { 'Content-Type': 'application/json' },
    };

    const result = interceptor(config);

    expect(result.headers['Content-Type']).toBe('application/json');
    expect(result.headers.Authorization).toBe('Bearer token');
  });

  test('4) Works safely when headers initially undefined', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue('xyz');

    const interceptor = (api.interceptors.request as any).handlers[0].fulfilled;
    const config: any = {};

    const result = interceptor(config);

    expect(result.headers.Authorization).toBe('Bearer xyz');
  });
});
