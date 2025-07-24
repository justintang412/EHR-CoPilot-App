import Axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { getAuth } from 'firebase/auth';

import { useNotifications } from '@/components/ui/notifications';
import { env } from '@/config/env';
import { paths } from '@/config/paths';

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  config.headers.set('Accept', 'application/json');
  // Don't set withCredentials for Firebase Functions
  // We use Firebase Auth tokens instead of cookies
  return config;
}

export const api = Axios.create({
  baseURL: env.API_URL,
});

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error) => {
    // Only show notification if not /auth/me
    if (!(error.response?.status === 401 && error.config?.url?.includes('/auth/me'))) {
      const message = error.response?.data?.message || error.message;
      useNotifications.getState().addNotification({
        type: 'error',
        title: 'Error',
        message,
      });
    }

    // Don't redirect on 401 for auth endpoints - let react-query-auth handle it
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/me')) {
      // Check if we are NOT already on the login page
      if (window.location.pathname !== paths.auth.login.path) {
        const searchParams = new URLSearchParams();
        const redirectTo =
          searchParams.get('redirectTo') || window.location.pathname;
        window.location.href = paths.auth.login.getHref(redirectTo);
      }
    }

    return Promise.reject(error);
  },
);