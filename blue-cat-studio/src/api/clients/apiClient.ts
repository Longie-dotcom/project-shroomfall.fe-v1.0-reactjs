import axios, { AxiosError } from 'axios';
import { AUTH_KEYS } from '../../constants/auth.constants';
import { dispatchApiError } from '../handlers/error/errorDispatcher';
import type { ApiErrorDTO } from '../../contracts/common/api-error-dto';
import type { TokenDTO } from '../../contracts/identity/responses/token-dto';
import type { RefreshTokenDTO } from '../../contracts/identity/commands/refresh-token-dto';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_KEYS.TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorDTO>) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && originalRequest && !originalRequest.headers._retry) {
      
      if (originalRequest.url?.includes('/identity/refresh') || originalRequest.url?.includes('/identity/login')) {
        localStorage.removeItem(AUTH_KEYS.TOKEN);
        localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
        window.dispatchEvent(new Event('auth:logout'));
        
        dispatchApiError(error); 
        return Promise.reject(error);
      }

      originalRequest.headers._retry = true;

      try {
        const currentRefreshToken = localStorage.getItem(AUTH_KEYS.REFRESH_TOKEN) || '';
        const refreshPayload: RefreshTokenDTO = { refreshToken: currentRefreshToken };

        const { data } = await axios.post<TokenDTO>(
          `${import.meta.env.VITE_API_BASE_URL}/identity/refresh`, 
          refreshPayload
        );

        localStorage.setItem(AUTH_KEYS.TOKEN, data.accessToken);
        localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, data.refreshToken);
        window.dispatchEvent(new Event('auth:login'));

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
        
      } catch (refreshFailure) {
        localStorage.removeItem(AUTH_KEYS.TOKEN);
        localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
        window.dispatchEvent(new Event('auth:logout'));
        
        dispatchApiError(refreshFailure as AxiosError<ApiErrorDTO>);
        return Promise.reject(refreshFailure);
      }
    }

    dispatchApiError(error);
    return Promise.reject(error);
  }
);