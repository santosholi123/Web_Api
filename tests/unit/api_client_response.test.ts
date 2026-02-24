/**
 * Jest Unit Tests for API Response and Error Parsing Helpers
 * Tests helper functions for extracting status codes and error messages
 */

/**
 * Helper function to extract HTTP status code from error object
 * @param error - Error object (Axios-style with response property)
 * @returns HTTP status code or 0 if not available
 */
function getStatus(error: any): number {
  return error.response?.status || 0;
}

/**
 * Helper function to extract error message from error object
 * Tries multiple sources in order: response.data.message, response.data.error, error.message
 * @param error - Error object (Axios-style or plain Error)
 * @returns Error message string or default message
 */
function getMessage(error: any): string {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'Something went wrong';
}

describe('Api Client - RESPONSE HELPERS', () => {
  test('1) getStatus returns 0 when statusCode missing', () => {
    const error = {
      message: 'Network error',
      // No response property
    };

    expect(getStatus(error)).toBe(0);
  });

  test('2) getMessage uses fallback when no message present', () => {
    const error = {
      response: {
        status: 400,
        data: {}, // No message or error field
      },
    };

    expect(getMessage(error)).toBe('Something went wrong');
  });

  test('3) getMessage returns error from response body when "error" exists', () => {
    const error = {
      response: {
        status: 401,
        data: {
          error: 'Invalid token',
        },
      },
    };

    expect(getMessage(error)).toContain('Invalid token');
  });
});
