/**
 * Prefer API-provided error text; fall back to a local message id default.
 */
export default function getApiErrorMessage(error, fallbackMessage) {
  const data = error?.response?.data;

  if (typeof data === 'string' && data.trim()) {
    return data;
  }

  if (data?.message) {
    return data.message;
  }

  if (data?.detail) {
    return typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
  }

  if (typeof data?.error === 'string') {
    return data.error;
  }

  if (data?.error?.message) {
    return data.error.message;
  }

  if (Array.isArray(data?.messages) && data.messages.length > 0) {
    return data.messages.join(' ');
  }

  if (error?.message && !error.message.startsWith('Request failed')) {
    return error.message;
  }

  return fallbackMessage;
}
