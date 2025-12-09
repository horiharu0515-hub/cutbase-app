"use client";

import { useState, useEffect } from "react";
import { Home, User, MessageSquare, PlusCircle, Edit3, Save, X, Film, Scissors, LogOut, Camera, Users, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [profile, setProfile] = useState({
    id: "",
    name: "",
    bio: "",
    soft: "Premiere Pro",
    level: "Beginner",
    avatar_url: "",
    header_url: ""
  });

  const [stats, setStats] = useState({
    posts: 0,
    followers: 0,
    following: 0
  });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        router.push('/login');
        return;
    }
    setCurrentUser(user);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setProfile(data);
    } else {
        if (error && error.code !== 'PGRST116') {
            console.error("プロフィール取得エラー:", error);
        } else {
            const newProfile = { 
                id: user.id, 
                name: user.email?.split('@')[0] || 'No Name', 
                bio: 'よろしくお願いします！',
                soft: 'Premiere Pro',
                level: 'Beginner'
            };
            setProfile(newProfile as any);
            await supabase.from('profiles').insert([newProfile]);
        }
    }
    setLoading(false);
  };

  const uploadImage = async (event: any, type: 'avatar' | 'header') => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${type}s/${currentUser.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) {
      alert("アップロード失敗: " + uploadError.message);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    const updateData = type === 'avatar' ? { avatar_url: publicUrl } : { header_url: publicUrl };
    const newProfile = { ...profile, ...updateData };
    
    setProfile(newProfile);
    
    await supabase.from('profiles').upsert({
        ...newProfile,
        id: currentUser.id
    });
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: currentUser.id,
        name: profile.name,
        bio: profile.bio,
        soft: profile.soft,
        level: profile.level,
        avatar_url: profile.avatar_url,
        header_url: profile.header_url
      });

    if (!error) {
        alert("プロフィールを更新しました！");
        setIsEditing(false);
    } else {
        alert("保存エラー: " + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-background text-text-main font-sans">
      
      {/* サイドバー */}
      <aside className="w-64 border-r border-white/5 p-6 hidden md:flex flex-col fixed h-full bg-background/50 backdrop-blur-xl z-10 top-0 left-0">
        <Link href="/">
          <div className="mb-10 flex items-center gap-3 select-none group cursor-pointer">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Scissors size={22} className="text-white" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  CutBase
              </h1>
          </div>
        </Link>
        <nav className="space-y-4 flex-1">
          <Link href="/"> <NavItem icon={<Home size={20} />} label="Feed" /> </Link>
          <Link href="/match"> <NavItem icon={<MessageSquare size={20} />} label="Match" /> </Link>
          <Link href="/profile"> <NavItem icon={<User size={20} />} label="Profile" active /> </Link>
        </nav>
        <Link href="/">
            <button className="w-full bg-primary hover:bg-accent text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 glow-button">
            <PlusCircle size={20} /> <span>投稿する</span>
            </button>
        </Link>
      </aside>

      {/* メインエリア */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 max-w-4xl mx-auto w-full pb-24">
        
        <div className="md:hidden flex items-center justify-center mb-6">
           <Link href="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-lg">
                  <Scissors size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">CutBase</h1>
           </Link>
        </div>
        
        {/* プロフィールヘッダー */}
        <div className="glass rounded-2xl border border-white/10 relative overflow-hidden mb-8 shadow-2xl animate-fade-in group">
            
            <div 
                className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-blue-900 to-slate-900 bg-cover bg-center"
                style={{ backgroundImage: profile.header_url ? `url(${profile.header_url})` : undefined }}
            >
                <label className="absolute right-4 bottom-4 bg-black/40 backdrop-blur-sm text-white p-2 rounded-full cursor-pointer hover:bg-black/70 transition border border-white/10">
                    <Camera size={20} />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => uploadImage(e, 'header')} />
                </label>
            </div>
            
            <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Link href="/settings">
                    <button className="bg-black/30 hover:bg-white/20 text-white p-2 rounded-lg transition flex items-center gap-2 text-xs font-bold border border-white/10 backdrop-blur-md">
                        <Settings size={16} /> 設定
                    </button>
                </Link>
            </div>
            
            <div className="relative pt-20 px-8 pb-8 flex flex-col md:flex-row items-end md:items-center gap-6 mt-10">
                <div className="relative">
                    <div 
                        className="w-32 h-32 rounded-full border-4 border-surface bg-gray-700 shadow-xl flex-shrink-0 bg-cover bg-center"
                        style={{ backgroundImage: profile.avatar_url ? `url(${profile.avatar_url})` : undefined }}
                    ></div>
                    <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-accent transition border-2 border-surface shadow-lg">
                        <Camera size={16} />
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => uploadImage(e, 'avatar')} />
                    </label>
                </div>
                
                <div className="flex-1 w-full">
                    {isEditing ? (
                        <div className="space-y-3 bg-black/20 p-4 rounded-xl border border-white/10">
                            <input 
                              className="w-full bg-black/30 border border-white/20 rounded p-2 text-white font-bold text-2xl"
                              value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})}
                            />
                             <div className="flex gap-2">
                                <select className="bg-black/30 border border-white/20 rounded p-2 text-sm"
                                    value={profile.soft} onChange={(e) => setProfile({...profile, soft: e.target.value})}>
                                    <option>Premiere Pro</option>
                                    <option>After Effects</option>
                                    <option>DaVinci Resolve</option>
                                    <option>Final Cut Pro</option>
                                    <option value="Other">その他</option>
                                </select>
                                <select className="bg-black/30 border border-white/20 rounded p-2 text-sm"
                                    value={profile.level} onChange={(e) => setProfile({...profile, level: e.target.value})}>
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                </select>
                             </div>
                             <textarea className="w-full bg-black/30 border border-white/20 rounded p-2 text-sm h-20"
                                value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} />
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">{profile.name}</h2>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/20">{profile.soft === 'Other' ? 'その他' : profile.soft}</span>
                                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">{profile.level}</span>
                            </div>
                            <p className="text-gray-300 max-w-xl leading-relaxed">{profile.bio || "自己紹介未設定"}</p>
                        </div>
                    )}
                </div>

                <div className="self-start md:self-auto mt-4 md:mt-0">
                    {isEditing ? (
                        <div className="flex gap-2">
                            <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold transition flex items-center gap-2"><X size={18} /> キャンセル</button>
                            <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-primary hover:bg-accent text-white font-bold transition flex items-center gap-2 shadow-lg"><Save size={18} /> 保存</button>
                        </div>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition flex items-center gap-2 border border-white/5"><Edit3 size={18} /> プロフィール編集</button>
                    )}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard label="Posts" value={String(stats.posts)} />
            <StatCard label="Followers" value={String(stats.followers)} />
            <StatCard label="Following" value={String(stats.following)} />
        </div>

        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Film size={20} className="text-primary" /> Portfolio
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {[1, 2, 3].map((i) => (
                 <div key={i} className="glass aspect-video rounded-xl border border-white/5 flex items-center justify-center text-gray-600 hover:border-primary/50 transition cursor-pointer group relative overflow-hidden">
                     <Film size={32} />
                 </div>
             ))}
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-background/90 backdrop-blur-xl border-t border-white/10 flex justify-around p-4 z-50 pb-safe">
          <Link href="/"><Home size={24} className="text-gray-400" /></Link>
          <Link href="/match"><MessageSquare size={24} className="text-gray-400" /></Link>
          <Link href="/profile"><User size={24} className="text-primary" /></Link>
      </nav>
    </div>
  );
}

function StatCard({ label, value }: { label: string, value: string }) {
    return (
        <div className="glass p-4 rounded-xl border border-white/5 text-center flex flex-col items-center justify-center hover:bg-white/5 transition">
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
                {label === 'Followers' && <Users size={12} />}
                {label}
            </div>
        </div>
    );
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${active ? 'bg-primary/10 text-primary translate-x-2' : 'hover:bg-white/5 text-gray-400 hover:text-white hover:translate-x-1'}`}>
      {icon} <span className="font-medium">{label}</span>
    </div>
  );
}