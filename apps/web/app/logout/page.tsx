"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/signout", { method: "POST" })
      .finally(() => router.replace("/"));
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p>ログアウト中...</p>
    </div>
  );
} 