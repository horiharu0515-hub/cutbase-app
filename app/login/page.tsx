"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { Scissors, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        if (data.user) {
            const { error: profileError } = await supabase.from('profiles').insert([
                { 
                  id: data.user.id,
                  name: 'New User', 
                  bio: 'よろしくお願いします！' 
                }
            ]);
            if (profileError) console.error("プロフィール作成エラー", profileError);
        }
        setMessage("登録完了！自動的にログインします...");
        router.push("/");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        setMessage("ログイン成功！");
        router.push("/");
      }
    } catch (error: any) {
      setMessage("エラー: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-main font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="mb-8 flex flex-col items-center gap-4 animate-fade-in">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-4 rounded-2xl shadow-xl shadow-blue-500/30">
            <Scissors size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            CutBase
        </h1>
      </div>

      <div className="w-full max-w-md glass p-8 rounded-2xl border border-white/10 shadow-2xl animate-slide-up">
        <h2 className="text-xl font-bold text-white mb-6 text-center">
          {isSignUp ? "アカウントを作成" : "ログイン"}
        </h2>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1 ml-1">メールアドレス</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
              <input 
                type="email" 
                required
                className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary outline-none transition"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1 ml-1">パスワード</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                minLength={6}
                className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-12 text-white focus:border-primary outline-none transition"
                placeholder="6文字以上"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {message && (
            <p className={`text-sm text-center ${message.includes("エラー") ? "text-red-400" : "text-green-400"}`}>
              {message}
            </p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-accent text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  {isSignUp ? "登録して始める" : "ログインする"}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            {isSignUp ? "すでにアカウントをお持ちですか？" : "アカウントをお持ちでないですか？"}
          </p>
          <button 
            onClick={() => { setIsSignUp(!isSignUp); setMessage(""); }}
            className="text-primary hover:text-white text-sm font-bold mt-2 transition"
          >
            {isSignUp ? "ログインはこちら" : "新規登録はこちら"}
          </button>
        </div>
      </div>
    </div>
  );
}