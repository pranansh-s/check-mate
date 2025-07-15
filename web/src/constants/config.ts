import { AxiosRequestConfig } from 'axios';
import { ToastOptions } from 'react-toastify';

import { Duration } from '.';

export const toastConfig: ToastOptions = {
  type: 'error',
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: true,
  closeButton: false,
};

export const axiosConfig: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000',
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: Duration.apiTimeout,
};
