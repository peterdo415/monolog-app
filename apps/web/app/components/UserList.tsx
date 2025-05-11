'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useModal } from '../hooks/useModal';
import { UserModal } from './UserModal';
import type { User } from '@monolog/db/types';

const fetchUsers = () => fetch('/api/users').then(r => r.json() as Promise<User[]>);
const createUser = (dto: { name: string; email: string; password: string }) =>
  fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  }).then(r => r.json() as Promise<User>);

export function UserList() {
  const queryClient = useQueryClient();
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
  const { isOpen, open, close } = useModal();

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: newUser => {
      queryClient.setQueryData(['users'], (old: User[] = []) => [...old, newUser]);
      close();
    },
  });

  return (
    <div>
      <button onClick={open}>ユーザー追加</button>
      {isOpen && (
        <UserModal
          onSubmit={dto => mutation.mutate(dto)}
          onClose={close}
        />
      )}
      {mutation.isPending && <p>ユーザーを追加中...</p>}
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
