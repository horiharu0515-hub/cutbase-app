"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { Scissors } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // 今いる場所が「ログインページ」なら何もしない（無限ループ防止）
      if (pathname === "/login") {
        setLoading(false);
        return;
      }

      // ログインしているかチェック
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // してなければログイン画面へ飛ばす
        router.replace("/login");
      } else {
        // していれば通す
        setLoading(false);
      }
    };

    checkAuth();

    // ログアウトなどの変化を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        if (pathname !== "/login") router.replace('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  // チェック中はローディング画面を表示
  if (loading && pathname !== "/login") {
    return (
      <div className="min-h-screen bg-[#0B1016] flex flex-col items-center justify-center text-white gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-4 rounded-2xl shadow-xl shadow-blue-500/30 animate-pulse">
            <Scissors size={40} className="text-white" />
        </div>
        <p className="text-sm text-gray-400 font-bold tracking-wider">LOADING...</p>
      </div>
    );
  }

  // チェックOKなら中身を表示
  return <>{children}</>;
}