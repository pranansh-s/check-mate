'use client';

import Button from '@/components/common/Button';

import { logOut } from '@/lib/utils/user';

export default function ProfilePage() {
  const handleLogout = async () => {
    await logOut();
  };
  return (
    <div>
      <Button onClick={handleLogout}>logout</Button>
    </div>
  );
}
