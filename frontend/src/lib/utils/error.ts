import { mapFirebaseErrorToMessage } from '@/constants';
import { IInputValue } from '@/types';
import { FirebaseError } from 'firebase/app';
import { z } from 'zod';

import { showErrorToast } from '@/components/common/ErrorToast';

import { strings } from '@/constants/strings';
import { AxiosError } from 'axios';

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
		console.log(strings.errors.genericError, err);
	}
};

export const handleAPIErrors = (error: AxiosError) => {
	console.error("[API_ERROR]", error.name, error.message);

	if(typeof window === 'undefined') {
		return;
	}

	if(!error.response) {
		
	}

	if(status === 400) {
		showErrorToast(title, err);
	} else if (status === 401) {
		console.warn(err);
		showErrorToast(title, strings.errors.notAuth);
	} else if (status === 500) {
		console.error(err);
		showErrorToast(title, strings.errors.serverError);
	}
}
