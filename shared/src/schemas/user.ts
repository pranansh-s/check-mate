import { z } from 'zod';

export const UserLoginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z
    .string()
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .max(16, 'Password must be at most 16 characters long')
    .min(8, 'Password must be at least 8 characters long'),
});

export const UserRegisterSchema = UserLoginSchema.extend({
  displayName: z.string().min(1, 'Display name is required'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type UserLogin = z.infer<typeof UserLoginSchema>;
export type UserRegister = z.infer<typeof UserRegisterSchema>;
