import { z } from 'zod';

export const MessageSchema = z.object({
  content: z
    .string()
    .min(1, 'message cannot be empty')
    .max(120, 'message too long (max 120 characters)')
    .refine(val => val.trim().length > 0, {
      message: 'message cannot contain only whitespaces',
    }),
});
