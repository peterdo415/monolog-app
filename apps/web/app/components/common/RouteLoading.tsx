"use client";

import { usePathname } from "next/navigation";

// 仮Spinner（shadcn/uiのSpinnerがあればそちらに差し替え可）
function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg className={`animate-spin h-8 w-8 text-gray-400 ${className}`} viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

const loadingMessages: { [key: string]: string } = {
  "/login": "ログイン中です…",
  "/logout": "ログアウト中です…",
  "/signup": "サインアップ処理中です…",
  "/household": "家計簿データを読み込み中です…",
  // 必要に応じて他のパスも追加
};

export default function RouteLoading() {
  const pathname = usePathname();
  // パスに完全一致しない場合は部分一致で判定
  const message =
    loadingMessages[pathname] ||
    Object.entries(loadingMessages).find(([key]) => pathname.startsWith(key))?.[1] ||
    "ページを読み込み中です…";

  return (
    <div className="flex flex-col items-center justify-center h-full py-16">
      <Spinner className="mb-4" />
      <p className="text-muted-foreground" aria-live="polite">
        {message}
      </p>
    </div>
  );
} 