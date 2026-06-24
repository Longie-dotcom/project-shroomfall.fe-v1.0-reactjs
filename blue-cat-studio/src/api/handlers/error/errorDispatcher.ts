// src/api/handlers/error/errorDispatcher.ts
import { handleValidationError } from './errorHandler';
import type { AxiosError } from 'axios';
import type { ApiErrorDTO } from '../../../contracts/common/api-error-dto';

export const dispatchApiError = (error: AxiosError<ApiErrorDTO>): void => {
  const errorData = error.response?.data;

  // 🔍 DATA STREAM DEBUG LOGS
  console.log('--- [DEBUG] Pipeline Error Data Check ---');
  console.log('Data Type:', typeof errorData);
  console.log('Is Array?:', Array.isArray(errorData));
  console.log('Raw Value:', errorData);
  console.log('JSON Stringified:', JSON.stringify(errorData));
  console.log('-----------------------------------------');

  handleValidationError(errorData);
};