'use client';

import ReactDOM from 'react-dom';
import { FormEvent, useState } from 'react';

type Props = {
  onSubmit: (data: { name: string; email: string; password: string }) => void;
  onClose: () => void;
};

export function UserModal({ onSubmit, onClose }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handle = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, password });
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl mb-4">ユーザー追加</h2>
        <form onSubmit={handle}>
          <input className="block mb-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
          <input className="block mb-2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="block mb-4" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="mr-2">追加</button>
          <button type="button" onClick={onClose}>キャンセル</button>
        </form>
      </div>
    </div>,
    document.body
  );
}
