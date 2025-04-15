
import { useEffect } from 'react';
import { useUserState } from './user/useUserState';
import { useUserAPI } from './user/useUserAPI';
import { InviteFormValues } from '@/components/user/invite-form/UserInviteSchema';

export const useUserManagement = () => {
  const {
    users,
    setUsers,
    loading,
    setLoading,
    selectedUserId,
    setSelectedUserId,
  } = useUserState();

  const { fetchUsers: apiFetchUsers, inviteUser, resendInvitation } = useUserAPI();

  const fetchUsers = async () => {
    setLoading(true);
    const fetchedUsers = await apiFetchUsers();
    setUsers(fetchedUsers);
    setLoading(false);
  };

  const handleInviteSubmit = async (values: InviteFormValues) => {
    const success = await inviteUser(values);
    if (success) {
      await fetchUsers();
    }
    return success;
  };

  const handleResendInvitation = async (email: string) => {
    await resendInvitation(email);
  };

  return {
    users,
    loading,
    selectedUserId,
    setSelectedUserId,
    fetchUsers,
    handleInviteSubmit,
    handleResendInvitation,
  };
};
