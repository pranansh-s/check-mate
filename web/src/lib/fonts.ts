import { Limelight, Merriweather_Sans } from 'next/font/google';

export const limelight = Limelight({
  subsets: ['latin'],
  variable: '--font-limelight',
  weight: ['400'],
});

export const merriweatherSans = Merriweather_Sans({
  subsets: ['latin'],
  variable: '--font-merriweather-sans',
  weight: ['400'],
});
