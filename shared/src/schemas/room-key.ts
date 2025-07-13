import { z } from "zod";

export const RoomKeySchema = z.string().regex(/^[a-z0-9]{4}-[a-z0-9]{4}$/i, 'Must follow XXXX-XXXX format');

export type RoomKey = z.infer<typeof RoomKeySchema>;