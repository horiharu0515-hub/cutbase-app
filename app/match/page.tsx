"use client";

import { useState, useEffect } from "react";
import { Home, User, MessageSquare, PlusCircle, Briefcase, DollarSign, Clock, X, Scissors } from "lucide-react";
import Link from "next/link"; 
import { supabase } from "../../lib/supabase"; 

export default function MatchPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false); 

  const [newJob, setNewJob] = useState({
    title: "",
    budget: "",
    soft: "Premiere Pro",
    deadline: "",
    description: ""
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('エラー:', error);
    else setJobs(data || []);
  };

  const handleCreateJob = async () => {
    if (!newJob.title || !newJob.description) return alert("タイトルと詳細は必須です！");

    const { error } = await supabase
      .from('jobs')
      .insert([{
        title: newJob.title,
        budget: newJob.budget || "相談",
        soft: newJob.soft,
        deadline: newJob.deadline || "未定",
        description: newJob.description,
        client: "Guest User"
      }]);

    if (error) {
      alert("投稿に失敗しました...");
      console.error(error);
    } else {
      setShowForm(false);
      setNewJob({ title: "", budget: "", soft: "Premiere Pro", deadline: "", description: "" }); 
      fetchJobs(); 
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-text-main font-sans">
      
      {/* 左サイドバー (PC) */}
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
          <Link href="/">
            <NavItem icon={<Home size={20} />} label="Feed" />
          </Link>
          <Link href="/match">
            <NavItem icon={<MessageSquare size={20} />} label="Match" active />
          </Link>
          <Link href="/profile">
             <NavItem icon={<User size={20} />} label="Profile" />
          </Link>
        </nav>
        <button 
          onClick={() => setShowForm(true)}
          className="w-full bg-primary hover:bg-accent text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 glow-button"
        >
          <PlusCircle size={20} />
          <span>募集する</span>
        </button>
      </aside>

      {/* メインエリア */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 max-w-4xl mx-auto w-full relative pb-24">

        {/* スマホ用ヘッダー */}
        <div className="md:hidden flex items-center justify-center mb-6">
           <Link href="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-lg">
                  <Scissors size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">CutBase</h1>
           </Link>
        </div>
        
        {/* 投稿フォーム (モーダル) */}
        {showForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface p-6 rounded-xl w-full max-w-md border border-white/10 shadow-2xl glass animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">案件を募集する</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
              </div>
              
              <div className="space-y-3">
                <input 
                  type="text" placeholder="案件タイトル（例：YouTube編集募集）" 
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
                  value={newJob.title} onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                />
                <div className="flex gap-2">
                  <select 
                    className="bg-black/30 border border-white/10 rounded-lg p-3 text-white outline-none flex-1"
                    value={newJob.soft} onChange={(e) => setNewJob({...newJob, soft: e.target.value})}
                  >
                    <option>Premiere Pro</option>
                    <option>After Effects</option>
                    <option>DaVinci Resolve</option>
                    <option>Final Cut Pro</option>
                  </select>
                  <input 
                    type="text" placeholder="予算（例：1万円）" 
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none flex-1"
                    value={newJob.budget} onChange={(e) => setNewJob({...newJob, budget: e.target.value})}
                  />
                </div>
                <input 
                    type="text" placeholder="納期（例：3日後）" 
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
                    value={newJob.deadline} onChange={(e) => setNewJob({...newJob, deadline: e.target.value})}
                  />
                <textarea 
                  placeholder="詳細（例：素材の長さは10分です。テロップとBGMをお願いします。）" 
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none h-32"
                  value={newJob.description} onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                ></textarea>
                
                <button onClick={handleCreateJob} className="w-full bg-primary hover:bg-accent text-white font-bold py-3 rounded-lg mt-2 transition shadow-lg shadow-primary/20">
                  公開する
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 flex items-end justify-between">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Matching</h2>
                <p className="text-gray-400 text-sm">編集案件やコラボ相手を探そう</p>
            </div>
            {/* スマホ用募集ボタン */}
            <button 
              onClick={() => setShowForm(true)}
              className="md:hidden bg-primary hover:bg-accent text-white text-sm font-bold py-2 px-4 rounded-lg flex items-center gap-2"
            >
              <PlusCircle size={16} /> 募集
            </button>
        </div>

        {/* 案件リスト */}
        <div className="grid gap-4">
            {jobs.length === 0 && <p className="text-gray-500 text-center py-10">現在募集中の案件はありません。募集してみましょう！</p>}

            {jobs.map((job) => (
                <div key={job.id} className="glass rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer group shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{job.title}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    by {job.client}
                                </p>
                            </div>
                        </div>
                        <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/20">
                            {job.soft}
                        </span>
                    </div>

                    <p className="text-gray-300 text-sm mb-6 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5 whitespace-pre-wrap">
                        {job.description}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <DollarSign size={16} className="text-green-400" />
                            <span className="text-white font-bold">{job.budget}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-orange-400" />
                            <span>{job.deadline}</span>
                        </div>
                        <button className="ml-auto bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-bold transition">
                            詳細を見る
                        </button>
                    </div>
                </div>
            ))}
        </div>

      </main>

      {/* 📱 スマホ用ボトムナビ */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-background/90 backdrop-blur-xl border-t border-white/10 flex justify-around p-4 z-50 pb-safe">
          <Link href="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white">
            <Home size={24} />
            <span className="text-[10px] font-bold">Feed</span>
          </Link>
          <Link href="/match" className="flex flex-col items-center gap-1 text-primary">
            <MessageSquare size={24} />
            <span className="text-[10px] font-bold">Match</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white">
            <User size={24} />
            <span className="text-[10px] font-bold">Profile</span>
          </Link>
      </nav>

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