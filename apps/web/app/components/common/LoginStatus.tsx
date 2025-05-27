'use client';

import { useEffect, useState } from 'react';

export function LoginStatus() {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setUser(data?.user ?? null);
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  return user
    ? <p className="text-green-600 font-semibold">hello {user.name ?? user.email} !</p>
    : <p className="text-gray-500">未ログイン</p>;
} 