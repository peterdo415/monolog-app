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
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-8">
      <button
        onClick={open}
        className="mb-8 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition font-semibold text-lg"
      >
        ＋ ユーザー追加
      </button>
      {isOpen && (
        <UserModal
          onSubmit={dto => mutation.mutate(dto)}
          onClose={close}
        />
      )}
      {mutation.isPending && <p className="mb-4 text-blue-600">ユーザーを追加中...</p>}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">ユーザー一覧</h2>
        <ul className="space-y-2">
          {users.map(user => (
            <li
              key={user.id}
              className="px-4 py-2 rounded-md bg-gray-50 hover:bg-blue-50 transition border border-gray-100 text-gray-800"
            >
              {user.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
