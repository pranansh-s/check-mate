import { z } from 'zod';

import { strings } from '@/constants/strings';

export const UserLoginSchema = z.object({
  email: z.string().email(strings.auth.errors.invalidEmail),
  password: z
    .string()
    .regex(/[a-z]/, strings.auth.errors.invalidPassword.lowerCaseCharacter)
    .regex(/[A-Z]/, strings.auth.errors.invalidPassword.upperCaseCharacter)
    .regex(/\d/, strings.auth.errors.invalidPassword.number)
    .max(16, strings.auth.errors.invalidPassword.maxLength)
    .min(8, strings.auth.errors.invalidPassword.minLength),
});

export const UserRegisterSchema = UserLoginSchema.extend({
  displayName: z.string().min(1, strings.auth.errors.invalidDisplayName),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: strings.auth.errors.nonMatchingPassword,
  path: ['confirmPassword'],
});
