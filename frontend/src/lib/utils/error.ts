import { IInputValue } from '@/types';
import { isAxiosError } from 'axios';
import { FirebaseError } from 'firebase/app';
import { z } from 'zod';

import { showErrorToast } from '@/components/common/ErrorToast';

import { strings } from '@/constants/strings';

import { mapAPIStatusCodeToMessage, mapAxiosCodeToMessage, mapFirebaseErrorToMessage } from './maps';

const handleZodErrors = (
  err: z.ZodError,
  setFormState: React.Dispatch<React.SetStateAction<{ [key: string]: IInputValue }>>
) => {
  err.errors.forEach(error => {
    const field = error.path[0];
    const message = error.message;
    setFormState(prev => ({
      ...prev,
      [field]: { ...prev[field], error: message },
    }));
  });
};

const handleFirebaseError = (err: FirebaseError, title: string) => {
  const message = mapFirebaseErrorToMessage(err.code);
  showErrorToast(title, message);
};

export const handleErrors = (
  err: unknown,
  title: string,
  setFormState?: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
) => {
  if (err instanceof z.ZodError) {
    if (!setFormState) return;
    handleZodErrors(err, setFormState);
  } else if (err instanceof FirebaseError) {
    handleFirebaseError(err, title);
  } else if (err instanceof Error) {
    showErrorToast(title, err.message);
  } else {
    console.log(strings.apiError.genericMessage, err);
  }
};

export const handleAPIErrors = (error: Error) => {
  if (!isAxiosError(error)) {
    console.error('[API_ERROR]', error.name, error.message);
    return;
  }
  console.error('[API_ERROR]', error.code, error.response?.status, error.response?.data.error);

  if (typeof window === 'undefined') {
    return;
  }

  const response = error.response;
  if (!response) {
    showErrorToast(strings.apiError.requestError, mapAxiosCodeToMessage(error.code));
    return;
  }

  showErrorToast(strings.apiError.requestFailError, mapAPIStatusCodeToMessage(response.status, response.data.error));
};
