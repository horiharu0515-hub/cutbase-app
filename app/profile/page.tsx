"use client";

import { useState, useEffect } from "react";
// Scissors（ハサミ）アイコンを追加しました
import { Home, User, MessageSquare, PlusCircle, Edit3, MapPin, Link as LinkIcon, Save, X, Film, Scissors } from "lucide-react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    id: 0,
    name: "Loading...",
    bio: "",
    soft: "Premiere Pro",
    level: "Beginner",
    portfolio_url: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('my_profile')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.log('プロフィール未設定、または読込エラー:', error);
      setProfile({
        id: 0,
        name: "Guest User",
        bio: "プロフィールを編集して、自己紹介を入力しましょう！",
        soft: "Premiere Pro",
        level: "Beginner",
        portfolio_url: ""
      });
      setLoading(false);
    } else {
      setProfile(data);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (profile.id === 0) {
       const { error } = await supabase
        .from('my_profile')
        .insert([{
            name: profile.name,
            bio: profile.bio,
            soft: profile.soft,
            level: profile.level,
            portfolio_url: profile.portfolio_url
        }]);
       if (!error) alert("プロフィールを作成しました！");
    } else {
       const { error } = await supabase
        .from('my_profile')
        .update({
            name: profile.name,
            bio: profile.bio,
            soft: profile.soft,
            level: profile.level,
            portfolio_url: profile.portfolio_url
        })
        .eq('id', profile.id);
       if (!error) alert("プロフィールを更新しました！");
    }
    setIsEditing(false); 
    fetchProfile(); 
  };

  return (
    <div className="flex min-h-screen bg-background text-text-main font-sans">
      
      {/* 左サイドバー（デザイン更新） */}
      <aside className="w-64 border-r border-white/5 p-6 hidden md:flex flex-col fixed h-full bg-background/50 backdrop-blur-xl z-10">
        
        {/* ✨ 新しいブランドロゴ ✨ */}
        <div className="mb-10 flex items-center gap-3 select-none group cursor-pointer">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <Scissors size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                CutBase
            </h1>
        </div>

        <nav className="space-y-4 flex-1">
          <Link href="/">
            <NavItem icon={<Home size={20} />} label="Feed" />
          </Link>
          <Link href="/match">
            <NavItem icon={<MessageSquare size={20} />} label="Match" />
          </Link>
          <Link href="/profile">
             <NavItem icon={<User size={20} />} label="Profile" active />
          </Link>
        </nav>
        <button className="w-full bg-primary hover:bg-accent text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 glow-button">
          <PlusCircle size={20} />
          <span>投稿する</span>
        </button>
      </aside>

      {/* メインエリア */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 max-w-4xl mx-auto w-full">
        
        {/* プロフィールヘッダー（すりガラス化） */}
        <div className="glass rounded-2xl p-8 border border-white/10 relative overflow-hidden mb-8 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-900 to-slate-900 opacity-50"></div>
            
            <div className="relative pt-10 flex flex-col md:flex-row items-end md:items-center gap-6">
                {/* アイコン */}
                <div className="w-32 h-32 rounded-full border-4 border-surface bg-gradient-to-br from-gray-700 to-gray-500 shadow-xl flex-shrink-0"></div>
                
                <div className="flex-1 w-full">
                    {isEditing ? (
                        <div className="space-y-3 bg-black/20 p-4 rounded-xl border border-white/10">
                            <input 
                              className="w-full bg-black/30 border border-white/20 rounded p-2 text-white font-bold text-2xl"
                              value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})}
                              placeholder="名前を入力"
                            />
                             <div className="flex gap-2">
                                <select 
                                    className="bg-black/30 border border-white/20 rounded p-2 text-sm"
                                    value={profile.soft} onChange={(e) => setProfile({...profile, soft: e.target.value})}
                                >
                                    <option>Premiere Pro</option>
                                    <option>After Effects</option>
                                    <option>DaVinci Resolve</option>
                                    <option>Final Cut Pro</option>
                                </select>
                                <select 
                                    className="bg-black/30 border border-white/20 rounded p-2 text-sm"
                                    value={profile.level} onChange={(e) => setProfile({...profile, level: e.target.value})}
                                >
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                </select>
                             </div>
                             <textarea 
                                className="w-full bg-black/30 border border-white/20 rounded p-2 text-sm h-20"
                                value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})}
                                placeholder="自己紹介を入力してください"
                             />
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">{profile.name}</h2>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/20">
                                    {profile.soft}
                                </span>
                                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
                                    {profile.level}
                                </span>
                            </div>
                            <p className="text-gray-300 max-w-xl leading-relaxed">
                                {profile.bio || "自己紹介がまだありません。"}
                            </p>
                        </div>
                    )}
                </div>

                <div className="self-start md:self-auto mt-4 md:mt-0">
                    {isEditing ? (
                        <div className="flex gap-2">
                            <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold transition flex items-center gap-2">
                                <X size={18} /> キャンセル
                            </button>
                            <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-primary hover:bg-accent text-white font-bold transition flex items-center gap-2 shadow-lg shadow-primary/20">
                                <Save size={18} /> 保存
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition flex items-center gap-2 border border-white/5">
                            <Edit3 size={18} /> プロフィール編集
                        </button>
                    )}
                </div>
            </div>
        </div>

        {/* 統計データ（すりガラス化） */}
        <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard label="Posts" value="12" />
            <StatCard label="Followers" value="2,405" />
            <StatCard label="Following" value="180" />
        </div>

        {/* ポートフォリオ */}
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Film size={20} className="text-primary" /> Portfolio
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {[1, 2, 3].map((i) => (
                 <div key={i} className="glass aspect-video rounded-xl border border-white/5 flex items-center justify-center text-gray-600 hover:border-primary/50 transition cursor-pointer group relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                         <span className="text-white font-bold">Project 0{i}</span>
                     </div>
                     <Film size={32} />
                 </div>
             ))}
        </div>

      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string, value: string }) {
    return (
        <div className="glass p-4 rounded-xl border border-white/5 text-center">
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
        </div>
    );
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${active ? 'bg-primary/10 text-primary translate-x-2' : 'hover:bg-white/5 text-gray-400 hover:text-white hover:translate-x-1'}`}>
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  );
}