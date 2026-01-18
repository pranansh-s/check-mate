import { z } from 'zod';

export const ProfileSchema = z.object({
  displayName: z.string().min(8, "Display name should be atleast 8 characters"),
	email: z.email(),
	createdAt: z.number(),
});

export type Profile = z.infer<typeof ProfileSchema>;