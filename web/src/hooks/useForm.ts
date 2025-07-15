import { useState } from 'react';

import { IInputValue } from '@/types';
import { z } from 'zod';

export const useForm = () => {
  const [formState, setFormState] = useState<{ [key: string]: IInputValue }>({});
  const hasErrors = Object.values(formState).some(input => input?.error);

  const handleInputChange = (schema: z.ZodType) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    try {
      schema.parse(value);
      setFormState(prev => ({
        ...prev,
        [e.target.name]: { value, error: undefined },
      }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFormState(prev => ({
          ...prev,
          [e.target.name]: { value, error: error.errors[0]?.message },
        }));
      }
    }
  };
  return { formState, setFormState, handleInputChange, hasErrors };
};
