import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '../services/api';
import type { User } from '../types';

const authKey = ['auth', 'me'] as const;

export function useAuth() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: authKey,
    queryFn: async () => (await api.me()).user,
    retry: (count, error) => !(error instanceof ApiError && error.status === 401) && count < 1,
    staleTime: 60_000,
  });
  return {
    user: query.data,
    isLoading: query.isPending,
    isError: query.isError && !(query.error instanceof ApiError && query.error.status === 401),
    setUser(user: User) { queryClient.setQueryData(authKey, user); },
    clearUser() { queryClient.setQueryData(authKey, null); queryClient.removeQueries({ queryKey: ['notes'] }); },
  };
}
