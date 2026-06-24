import { toastBus } from './errorEvent';
import type { ApiErrorDTO } from '../../../contracts/common/api-error-dto';

export const handleValidationError = (errorData: ApiErrorDTO | string | undefined): void => {
  // 1. If the API returned a structured object, pass it straight through to the toast!
  if (errorData && typeof errorData === 'object') {
    toastBus.emitError(errorData);
    return;
  }

  // 2. If the API returned a raw string (like "" or standard IIS/ASP.NET text errors), print it exactly!
  if (typeof errorData === 'string') {
    const rawStringPayload: ApiErrorDTO = {
      type: 'API Error',
      code: errorData || 'EMPTY_RESPONSE', // Shows the literal text or logs that the response body was empty
      message: errorData || 'The server returned an empty response body.',
      details: 'Raw string response intercepted from the network stream.'
    };
    
    toastBus.emitError(rawStringPayload);
    return;
  }

  // 3. Absolute fallback only if errorData is completely undefined (e.g., total network dropout)
  const fallbackError: ApiErrorDTO = {
    type: 'Bad Request',
    code: 'api.unreachable',
    message: 'Could not connect to service pipeline.',
    details: 'The server response payload was missing or empty.',
  };

  toastBus.emitError(fallbackError);
};