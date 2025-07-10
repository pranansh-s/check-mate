import { AxiosRequestConfig } from 'axios';
import { ToastOptions } from 'react-toastify';

import { Duration } from '.';

export const toastConfig = {
  type: 'error',
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: true,
  closeButton: false,
} as ToastOptions;

export const axiosConfig = {
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000',
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: Duration.apiTimeout,
} as AxiosRequestConfig;
