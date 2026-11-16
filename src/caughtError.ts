/**
 * Turns a thrown value into the error shape `recordException` reads.
 * Hermes stack lines include "address at", which breaks stack parsers.
 */
export function normalizeCaughtError(caught: unknown): Error {
  const error: Error = isErrorLike(caught)
    ? caught
    : {
        name: 'UnknownErrorType',
        message: `${caught}`,
        stack: stackOf(caught),
      };

  error.stack = error.stack?.replace(/ \(address at \/?/g, ' (/');
  return error;
}

function isErrorLike(value: unknown): value is Error {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as {
    name?: unknown;
    message?: unknown;
    stack?: unknown;
  };
  return Boolean(record.stack && record.message && record.name);
}

function stackOf(value: unknown): string {
  if (typeof value !== 'object' || value === null || !('stack' in value))
    return '';
  return typeof value.stack === 'string' ? value.stack : '';
}
