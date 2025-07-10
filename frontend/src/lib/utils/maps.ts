import { AxiosError } from 'axios';

import { strings } from '@/constants/strings';

export const mapFirebaseErrorToMessage = (code: string): string => {
  switch (code) {
    case 'auth/invalid-email':
      return 'please enter a valid email address';
    case 'auth/user-disabled':
      return 'this account has been disabled';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'incorrect email or password';
    case 'auth/email-already-in-use':
      return 'email address is already registered';
    case 'auth/too-many-requests':
      return 'too many attempts. please try again later';
    default:
      return strings.apiError.genericMessage;
  }
};

export const mapAxiosCodeToMessage = (code?: string): string => {
  switch (code) {
    case AxiosError.ECONNABORTED:
    case AxiosError.ETIMEDOUT:
      return strings.apiError.timeoutMessage;
    case AxiosError.ERR_NETWORK:
      return strings.apiError.networkMessage;
    default:
      return strings.apiError.unknownMessage;
  }
};

export const mapAPIStatusCodeToMessage = (status: number, error: string): string => {
  switch (status) {
    case 400:
      return error;
    case 401:
      return strings.apiError.noAuthMessage;
    case 403:
      return strings.apiError.wrongAuthMessage;
    case 429:
      return strings.apiError.rateLimitMessage;
    case 500:
    default:
      return strings.apiError.unknownMessage;
  }
};
