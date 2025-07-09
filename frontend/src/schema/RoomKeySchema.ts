import { z } from 'zod';

import { strings } from '@/constants/strings';

export const RoomKeySchema = z.object({
  roomKey: z.string().regex(/^[a-z0-9]{4}-[a-z0-9]{4}$/i, strings.room.errors.regex),
});
