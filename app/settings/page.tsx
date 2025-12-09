"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { ArrowLeft, LogOut, Trash2, Lock, HelpCircle, FileText, X } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm("本当にアカウントを削除しますか？\nこの操作は取り消せません。");
    if (!confirmed) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { error } = await supabase.from('profiles').delete().eq('id', user.id);
        if (error) {
            alert("削除に失敗しました: " + error.message);
        } else {
            // ※注: Supabase Auth上のユーザー削除は管理者権限が必要なため、
            // 今回はプロフィール削除とログアウトのみ行います。
            await supabase.auth.signOut();
            alert("アカウント情報を削除しました。");
            router.push("/login");
        }
    }
  };

  // パスワード変更処理
  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
        setMessage("パスワードは6文字以上にしてください");
        return;
    }
    if (newPassword !== confirmPassword) {
        setMessage("パスワードが一致しません");
        return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
        setMessage("エラー: " + error.message);
    } else {
        alert("パスワードを変更しました！");
        setShowPasswordModal(false);
        setNewPassword("");
        setConfirmPassword("");
        setMessage("");
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
            
            {/* アカウント設定 */}
            <section className="space-y-2">
                <h2 className="text-sm text-gray-500 font-bold ml-1">アカウント</h2>
                <div className="glass rounded-xl overflow-hidden">
                    <button 
                        onClick={() => setShowPasswordModal(true)}
                        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition text-left border-b border-white/5"
                    >
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

            {/* サポート情報（リンク先を追加しました） */}
            <section className="space-y-2">
                <h2 className="text-sm text-gray-500 font-bold ml-1">サポート・情報</h2>
                <div className="glass rounded-xl overflow-hidden">
                    <Link href="/settings/help">
                        <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition text-left border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <HelpCircle size={20} className="text-gray-400" />
                                <span>ヘルプ・お問い合わせ</span>
                            </div>
                        </button>
                    </Link>
                    <Link href="/settings/terms">
                        <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition text-left">
                            <div className="flex items-center gap-3">
                                <FileText size={20} className="text-gray-400" />
                                <span>利用規約・プライバシーポリシー</span>
                            </div>
                        </button>
                    </Link>
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

      {/* パスワード変更モーダル */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface p-6 rounded-xl w-full max-w-sm border border-white/10 shadow-2xl glass">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-white">パスワード変更</h3>
                    <button onClick={() => setShowPasswordModal(false)}><X size={20} className="text-gray-400" /></button>
                </div>
                
                <div className="space-y-4">
                    <input 
                        type="password" 
                        placeholder="新しいパスワード（6文字以上）"
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="確認のため再入力"
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {message && <p className="text-red-400 text-sm">{message}</p>}
                    
                    <button 
                        onClick={handleChangePassword}
                        className="w-full bg-primary hover:bg-accent text-white font-bold py-3 rounded-lg mt-2 transition"
                    >
                        変更する
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}