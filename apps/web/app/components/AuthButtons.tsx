'use client';

import { useState, useEffect } from 'react';

export function AuthButtons() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data?.user ?? null));
  }, []);

  const handleSignIn = async () => {
    if (!input) return;
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: input }),
    });
    if (res.ok) location.reload();
  };

  const handleSignOut = async () => {
    const res = await fetch('/api/auth/signout', { method: 'POST' });
    if (res.ok) location.reload();
  };

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <span>ようこそ, {user.name} さん</span>
          <button onClick={handleSignOut} className="text-blue-600 hover:underline">サインアウト</button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="ユーザー名"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <button onClick={handleSignIn} className="text-blue-600 hover:underline">サインイン</button>
        </>
      )}
    </div>
  );
} 