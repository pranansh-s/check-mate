import { z } from 'zod';

export const MessageSchema = z
	.string()
	.max(120, 'Message too long (max 120 characters)')
	.refine(val => val.trim().length > 0, {
		message: 'Message cannot be empty',
});

export type Message = z.infer<typeof MessageSchema>;