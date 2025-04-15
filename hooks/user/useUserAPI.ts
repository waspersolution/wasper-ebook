
import { useUserFetch } from './api/useUserFetch';
import { useUserInvite } from './api/useUserInvite';
import { useUserResendInvite } from './api/useUserResendInvite';
import { useUserDelete } from './api/useUserDelete';

export const useUserAPI = () => {
  const { fetchUsers } = useUserFetch();
  const { inviteUser } = useUserInvite();
  const { resendInvitation } = useUserResendInvite();
  const { deleteUser } = useUserDelete();

  return {
    fetchUsers,
    inviteUser,
    resendInvitation,
    deleteUser,
  };
};
