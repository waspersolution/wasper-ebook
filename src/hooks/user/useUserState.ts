
import { useState } from 'react';
import { User } from '@/types/user';

export const useUserState = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return {
    users,
    setUsers,
    loading,
    setLoading,
    selectedUserId,
    setSelectedUserId,
  };
};
