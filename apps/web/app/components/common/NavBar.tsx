import Link from 'next/link';

export function NavBar({ user }: { user: any }) {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between h-16 px-6 border-b bg-white">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-lg">Monolog App</Link>
        <Link href="/household" className="text-gray-700 hover:text-black">日用品管理</Link>
        <Link href="/dashboard" className="text-gray-700 hover:text-black">ダッシュボード</Link>
        <Link href="/settings" className="text-gray-700 hover:text-black">設定</Link>
      </div>
      <div className="flex items-center gap-4">
        {user && user.email ? (
          <>
            <span className="text-gray-700">{user.email}でログイン中</span>
            <Link href="/logout" className="text-blue-600 hover:underline">ログアウト</Link>
          </>
        ) : (
          <Link href="/login" className="text-blue-600 hover:underline">ログイン</Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar; 