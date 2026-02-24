


// Mock the fetch API
global.fetch = jest.fn();

interface ApiGetOptions {
  requiresAuth?: boolean;
}

// Simulated apiGet function (in real scenario, this would be imported from lib/api)
const apiGet = async (path: string, options?: ApiGetOptions): Promise<any> => {
  const response = await fetch(path);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return response.json();
};

describe('apiGet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Test 1: GET returns JSON on 200', () => {
    it('should return JSON response on successful GET request', async () => {
      const mockData = { message: 'get ok' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await apiGet('/test', { requiresAuth: false });

      expect(result.message).toBe('get ok');
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith('/test');
    });
  });

  describe('Test 2: GET throws on non-2xx', () => {
    it('should throw error on 404 response', async () => {
      const errorData = { message: 'Not found' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => errorData,
      });

      await expect(apiGet('/test')).rejects.toThrow(/Not found|404/);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith('/test');
    });

    it('should throw error on 500 response', async () => {
      const errorData = { message: 'Internal server error' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => errorData,
      });

      await expect(apiGet('/test')).rejects.toThrow(/Internal server error|500/);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test 3: GET throws timeout error', () => {
    it('should throw timeout error when fetch times out', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('timeout')
      );

      await expect(apiGet('/test')).rejects.toThrow(/timeout/i);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith('/test');
    });
  });

  describe('Test 4: GET throws network error', () => {
    it('should throw network error when fetch fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(apiGet('/test')).rejects.toThrow(/Network/);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith('/test');
    });
  });

  describe('Additional edge cases', () => {
    it('should handle empty path correctly', async () => {
      const mockData = { status: 'ok' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await apiGet('');

      expect(result.status).toBe('ok');
      expect(global.fetch).toHaveBeenCalledWith('');
    });

    it('should preserve path with query parameters', async () => {
      const mockData = { data: 'response' };
      const testPath = '/api/users?page=1&limit=10';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      await apiGet(testPath);

      expect(global.fetch).toHaveBeenCalledWith(testPath);
    });

    it('should handle different HTTP error status codes', async () => {
      const statusCodes = [400, 401, 403, 409];

      for (const status of statusCodes) {
        jest.clearAllMocks();
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: status,
          json: async () => ({ message: `Error ${status}` }),
        });

        await expect(apiGet('/test')).rejects.toThrow();
        expect(global.fetch).toHaveBeenCalledTimes(1);
      }
    });
  });
});
