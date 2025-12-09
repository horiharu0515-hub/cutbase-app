"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { ArrowLeft, LogOut, Trash2, Lock, HelpCircle, FileText } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm("本当にアカウントを削除しますか？\nこの操作は取り消せません。");
    if (!confirmed) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        // プロフィールを削除（これで紐づくデータも消える想定）
        const { error } = await supabase.from('profiles').delete().eq('id', user.id);
        if (error) {
            alert("削除に失敗しました: " + error.message);
        } else {
            await supabase.auth.signOut();
            alert("アカウントを削除しました。ご利用ありがとうございました。");
            router.push("/login");
        }
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-main font-sans p-4 pb-24 md:p-8">
      
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
            <Link href="/profile">
                <button className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
                    <ArrowLeft size={24} />
                </button>
            </Link>
            <h1 className="text-2xl font-bold">設定</h1>
        </header>

        <div className="space-y-6">
            
            <section className="space-y-2">
                <h2 className="text-sm text-gray-500 font-bold ml-1">アカウント</h2>
                <div className="glass rounded-xl overflow-hidden">
                    <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition text-left border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <Lock size={20} className="text-gray-400" />
                            <span>パスワード変更</span>
                        </div>
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition text-left text-red-400">
                        <div className="flex items-center gap-3">
                            <LogOut size={20} />
                            <span>ログアウト</span>
                        </div>
                    </button>
                </div>
            </section>

            <section className="space-y-2">
                <h2 className="text-sm text-gray-500 font-bold ml-1">サポート・情報</h2>
                <div className="glass rounded-xl overflow-hidden">
                    <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition text-left border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <HelpCircle size={20} className="text-gray-400" />
                            <span>ヘルプ・お問い合わせ</span>
                        </div>
                    </button>
                    <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition text-left">
                        <div className="flex items-center gap-3">
                            <FileText size={20} className="text-gray-400" />
                            <span>利用規約・プライバシーポリシー</span>
                        </div>
                    </button>
                </div>
            </section>

            <section className="space-y-2 pt-8">
                <button 
                    onClick={handleDeleteAccount}
                    className="w-full flex items-center justify-center gap-2 p-4 text-red-500 hover:bg-red-500/10 rounded-xl transition border border-red-500/20"
                >
                    <Trash2 size={18} />
                    <span>アカウントを削除する</span>
                </button>
            </section>

        </div>
      </div>
    </div>
  );
}