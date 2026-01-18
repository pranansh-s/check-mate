'use server';

import { cookies } from 'next/headers';

export const getAccessToken = async () => {
  const nextCookies = await cookies();
  return nextCookies.get('token')?.value ?? null;
};

export const setAccessToken = async (value: string | null) => {
  const nextCookies = await cookies();
  if (value) {
    nextCookies.set('token', value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });
  } else {
    nextCookies.delete('token');
  }
};