import Image from "next/image";

export function NavBar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between w-full px-6 py-3">
        <div className="flex items-center gap-2">
          <Image src="/turborepo-dark.svg" alt="Logo" width={32} height={32} />
          <span className="font-bold text-lg tracking-tight text-gray-800">Monolog App</span>
        </div>
        <div className="flex items-center gap-6 ml-auto">
          <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition">ダッシュボード</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition">設定</a>
        </div>
      </div>
    </nav>
  );
}
