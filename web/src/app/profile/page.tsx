'use client';

import UserService from '@/services/user.service';

import Button from '@/components/common/Button';

export default function ProfilePage() {
  const handleLogout = async () => {
    await UserService.logOut();
  };

  return (
    <div>
      <Button onClick={handleLogout}>logout</Button>
    </div>
  );
}
