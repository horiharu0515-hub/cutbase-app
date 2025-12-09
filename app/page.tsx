"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link"; 
import { supabase } from "../lib/supabase"; 
import { Home, User, MessageSquare, PlusCircle, Heart, Share2, Search, ChevronDown, Send, Scissors, X, Hash, Trash2 } from "lucide-react";

// 日時を「〇〇前」に変換する関数
function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "年前";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "ヶ月前";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "日前";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "時間前";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "分前";
  return "たった今";
}

export default function CutBaseHome() {
  const [inputText, setInputText] = useState("");
  const [selectedSoft, setSelectedSoft] = useState("Premiere Pro");
  const [posts, setPosts] = useState<any[]>([]);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [isSearching, setIsSearching] = useState(false); 
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null); // 自分のID

  useEffect(() => {
    fetchPosts();
    checkUser();
  }, [filterTag]); 

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setCurrentUserId(user.id);
  };

  const fetchPosts = async (manualSearchTerm?: string) => {
    const term = manualSearchTerm !== undefined ? manualSearchTerm : searchQuery;

    // プロフィール情報も一緒に取得
    let query = supabase
      .from('posts')
      .select(`
        *,
        profiles (
          name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (filterTag) {
      if (filterTag === "Other") {
         query = query.ilike('tag', 'Other');
      } else {
         query = query.ilike('tag', `%${filterTag}%`);
      }
    }

    if (term) {
      query = query.ilike('content', `%${term}%`);
    }

    const { data, error } = await query;

    if (error) console.error('読み込みエラー:', error);
    else setPosts(data || []);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
        setIsSearching(false);
        fetchPosts(""); 
        return;
    }
    setIsSearching(true);
    fetchPosts();
  };

  const clearSearch = () => {
      setSearchQuery("");
      setIsSearching(false);
      fetchPosts("");
  };

  const handlePost = async () => {
    if (inputText.trim() === "") return;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        alert("投稿するにはログインが必要です");
        return;
    }

    const { error } = await supabase
      .from('posts')
      .insert([{ 
        content: inputText, 
        tag: selectedSoft, 
        likes: 0,
        user_id: user.id
      }]);

    if (error) {
      alert("投稿に失敗しました...");
      console.error(error);
    } else {
      setInputText(""); 
      fetchPosts(); 
    }
  };

  // 投稿削除機能
  const handleDelete = async (postId: number) => {
      if(!confirm("本当にこの投稿を削除しますか？")) return;
      
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      
      if(error) {
          alert("削除に失敗しました: " + error.message);
      } else {
          fetchPosts(); // リストを更新
      }
  };

  const handleFocusInput = () => {
    inputRef.current?.focus();
    inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="flex min-h-screen bg-background text-text-main font-sans">
      
      {/* 左サイドバー */}
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
            <NavItem icon={<Home size={20} />} label="Feed" active={!filterTag && !isSearching} />
          </Link>
          <Link href="/match">
            <NavItem icon={<MessageSquare size={20} />} label="Match" />
          </Link>
          <Link href="/profile">
            <NavItem icon={<User size={20} />} label="Profile" />
          </Link>
        </nav>
        <button 
          onClick={handleFocusInput}
          className="w-full bg-primary hover:bg-accent text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 glow-button"
        >
          <PlusCircle size={20} />
          <span>投稿する</span>
        </button>
      </aside>

      {/* メインエリア */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 max-w-2xl mx-auto w-full pb-24">
        
        <div className="md:hidden flex items-center justify-center mb-6">
           <Link href="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-lg">
                  <Scissors size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">CutBase</h1>
           </Link>
        </div>

        <div className="flex flex-col gap-4 mb-6">
            <div className="relative group">
                <Search className="absolute left-3 top-3 text-gray-500 group-focus-within:text-primary transition" size={20} />
                <input 
                    type="text" 
                    placeholder="キーワードで検索..." 
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-white focus:border-primary outline-none transition shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                {searchQuery && (
                    <button onClick={clearSearch} className="absolute right-3 top-3 text-gray-500 hover:text-white">
                        <X size={20} />
                    </button>
                )}
            </div>

            {(filterTag || isSearching) && (
            <div className="flex flex-wrap gap-2 items-center bg-primary/10 p-3 rounded-lg border border-primary/20 animate-fade-in">
                <span className="text-xs font-bold text-primary mr-2">絞り込み中:</span>
                {filterTag && (
                    <span className="text-white bg-primary/20 px-2 py-1 rounded text-xs flex items-center gap-1 border border-primary/20">
                        <Hash size={12}/> {filterTag === 'Other' ? 'その他' : filterTag}
                        <button onClick={() => setFilterTag(null)}><X size={12}/></button>
                    </span>
                )}
                {isSearching && searchQuery && (
                    <span className="text-white bg-primary/20 px-2 py-1 rounded text-xs flex items-center gap-1 border border-primary/20">
                        <Search size={12}/> {searchQuery}
                        <button onClick={clearSearch}><X size={12}/></button>
                    </span>
                )}
            </div>
            )}
        </div>
        
        {/* 新規投稿エリア */}
        <div className="glass rounded-xl p-4 mb-8 shadow-xl">
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex-shrink-0 shadow-lg hidden sm:block"></div>
                <div className="flex-1">
                    <input 
                      ref={inputRef}
                      type="text" 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="動画編集の悩みを共有しよう..." 
                      className="w-full bg-transparent border-none outline-none text-base md:text-lg text-white placeholder-gray-400 mb-4 focus:ring-0" 
                    />
                    
                    <div className="flex flex-wrap gap-3 justify-between items-center pt-2 border-t border-white/10">
                        <div className="flex gap-2 items-center">
                            <div className="relative">
                              <select 
                                value={selectedSoft}
                                onChange={(e) => setSelectedSoft(e.target.value)}
                                className="appearance-none bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 py-2 pl-3 pr-8 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary border border-white/5 transition-colors"
                              >
                                <option value="Premiere Pro">Premiere Pro</option>
                                <option value="Final Cut Pro">Final Cut Pro</option>
                                <option value="DaVinci Resolve">DaVinci Resolve</option>
                                <option value="After Effects">After Effects</option>
                                <option value="Other">その他</option>
                              </select>
                              <ChevronDown size={14} className="absolute right-2 top-2.5 text-gray-500 pointer-events-none" />
                            </div>
                        </div>
                        <button 
                          onClick={handlePost} 
                          className="bg-primary hover:bg-accent text-sm font-bold py-2 px-6 rounded-full text-white transition disabled:opacity-50 shadow-lg shadow-primary/20"
                          disabled={!inputText}
                        >
                          Post
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* タイムライン */}
        <div className="space-y-6">
            {posts.length === 0 && (
                <div className="text-center py-10 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-gray-400 mb-2">投稿が見つかりません</p>
                    {(filterTag || isSearching) && (
                        <button 
                            onClick={() => { setFilterTag(null); clearSearch(); }}
                            className="text-primary text-sm hover:underline"
                        >
                            フィルターを解除する
                        </button>
                    )}
                </div>
            )}
            
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                postId={post.id} 
                user={post.profiles?.name || "Guest User"}
                userId={post.user_id} // 投稿者ID
                currentUserId={currentUserId} // 自分のID
                avatarUrl={post.profiles?.avatar_url}
                time={timeAgo(post.created_at || new Date().toISOString())}
                tag={post.tag} 
                content={post.content}
                initialLikes={post.likes || 0}
                onDelete={() => handleDelete(post.id)} // 削除処理を渡す
              />
            ))}
        </div>
      </main>

      {/* 右サイドバー */}
      <aside className="w-80 fixed right-0 top-0 h-full border-l border-white/5 p-6 hidden xl:block bg-background/50 backdrop-blur-md">
        <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider text-gray-500">Trending Tags</h3>
        <div className="flex flex-wrap gap-2 mb-8">
            {["Premiere Pro", "After Effects", "DaVinci Resolve", "案件", "テロップ", "Other"].map(tag => (
              <button 
                key={tag} 
                onClick={() => setFilterTag(tag)}
                className={`px-3 py-1 rounded-full text-xs transition border ${filterTag === tag ? 'bg-primary text-white border-primary' : 'bg-surface text-gray-300 border-white/5 hover:bg-primary/20 hover:text-primary'}`}
              >
                #{tag === 'Other' ? 'その他' : tag}
              </button>
            ))}
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-background/90 backdrop-blur-xl border-t border-white/10 flex justify-around p-4 z-50 pb-safe">
          <Link href="/" className="flex flex-col items-center gap-1 text-primary">
            <Home size={24} />
            <span className="text-[10px] font-bold">Feed</span>
          </Link>
          <Link href="/match" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white">
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

// 投稿カード（削除ボタン付き）
function PostCard({ postId, user, userId, currentUserId, avatarUrl, time, tag, content, initialLikes, onDelete }: any) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);

  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
    if (likedPosts.includes(postId)) {
      setIsLiked(true);
    }
  }, [postId]);

  const handleLike = async () => {
    if (isLikeProcessing) return;
    setIsLikeProcessing(true);

    const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
    let newLikes = likes;

    // 最新のいいね数を取得
    const { data: currentPost } = await supabase
      .from('posts')
      .select('likes')
      .eq('id', postId)
      .single();
    
    if (currentPost) {
        newLikes = currentPost.likes;
    }

    if (likedPosts.includes(postId)) {
      // いいね解除
      newLikes = Math.max(0, newLikes - 1);
      setLikes(newLikes);
      setIsLiked(false);
      const newLikedPosts = likedPosts.filter((id: number) => id !== postId);
      localStorage.setItem('liked_posts', JSON.stringify(newLikedPosts));
      await supabase.from('posts').update({ likes: newLikes }).eq('id', postId);
    } else {
      // いいね追加
      newLikes = newLikes + 1;
      setLikes(newLikes);
      setIsLiked(true);
      likedPosts.push(postId);
      localStorage.setItem('liked_posts', JSON.stringify(likedPosts));
      await supabase.from('posts').update({ likes: newLikes }).eq('id', postId);
    }

    setIsLikeProcessing(false);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert("URLをコピーしました！");
    });
  };

  useEffect(() => {
    if (showComments) fetchComments();
  }, [showComments]);

  const fetchComments = async () => {
    const { data } = await supabase.from('comments').select('*').eq('post_id', postId).order('created_at', { ascending: true });
    setComments(data || []);
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    let userName = "Guest User";
    
    if (currentUser) {
       const { data: profile } = await supabase.from('profiles').select('name').eq('id', currentUser.id).single();
       if (profile) userName = profile.name;
    }

    const { error } = await supabase.from('comments').insert([{ 
        post_id: postId, 
        content: commentText, 
        user_name: userName 
    }]);

    if (!error) {
      setCommentText("");
      fetchComments();
    }
  };

  const getTagColor = (softName: string) => {
    switch (softName) {
      case "Premiere Pro": return "text-blue-400 border-blue-500/20 bg-blue-500/10";
      case "Final Cut Pro": return "text-yellow-400 border-yellow-500/20 bg-yellow-500/10";
      case "DaVinci Resolve": return "text-pink-400 border-pink-500/20 bg-pink-500/10";
      case "After Effects": return "text-purple-400 border-purple-500/20 bg-purple-500/10";
      case "Other": return "text-gray-300 border-gray-500/20 bg-gray-500/20";
      default: return "text-gray-400 border-gray-500/20 bg-gray-500/10";
    }
  };

  return (
    <article className="glass rounded-xl p-5 mb-4 hover:border-primary/30 transition-all cursor-pointer group shadow-lg animate-fade-in relative">
        
        {/* 削除ボタン: 自分の投稿のみ表示 */}
        {currentUserId === userId && (
            <button 
                onClick={(e) => { e.stopPropagation(); onDelete(); }} 
                className="absolute top-4 right-4 text-gray-600 hover:text-red-400 transition bg-black/20 p-2 rounded-full"
                title="削除する"
            >
                <Trash2 size={16} />
            </button>
        )}

        <div className="flex justify-between items-start mb-3">
            <Link href={`/profile?id=${userId}`} className="flex gap-3 items-center group/user">
                <div 
                    className="w-10 h-10 rounded-full bg-gray-700 border border-white/10 flex items-center justify-center text-xs text-white/50 overflow-hidden bg-cover bg-center"
                    style={{ backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'none' }}
                >
                    {!avatarUrl && user.charAt(0)}
                </div>
                <div>
                    <h3 className="font-bold text-sm text-white group-hover/user:text-primary transition">{user}</h3>
                    <p className="text-xs text-gray-500">{time}</p>
                </div>
            </Link>
            <span className={`text-xs px-2 py-1 rounded border ${getTagColor(tag)} mr-8`}>{tag === 'Other' ? 'その他' : tag}</span>
        </div>
        
        <h2 className="text-white text-base leading-relaxed mb-4 whitespace-pre-wrap">{content}</h2>

        <div className="flex items-center justify-between text-gray-500 text-sm border-t border-white/10 pt-3">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition ${isLiked ? 'text-pink-500' : 'hover:text-pink-500'}`}
            >
              <Heart size={18} className={isLiked ? "fill-pink-500" : ""} /> 
              {likes}
            </button>
            
            <button 
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-1.5 transition ${showComments ? 'text-primary' : 'hover:text-primary'}`}
            >
              <MessageSquare size={18} /> {showComments ? '閉じる' : 'コメント'}
            </button>
            
            <button onClick={handleShare} className="flex items-center gap-1.5 hover:text-white transition">
              <Share2 size={18} />
            </button>
        </div>

        {showComments && (
          <div className="mt-4 pt-4 border-t border-white/10 animate-slide-up relative">
            <button onClick={() => setShowComments(false)} className="absolute top-2 right-0 text-xs text-gray-500 hover:text-white">
               ✕ 閉じる
            </button>

            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
               {comments.length === 0 && <p className="text-xs text-gray-500 mt-4">まだコメントはありません。</p>}
               {comments.map((comment) => (
                 <div key={comment.id} className="bg-black/30 p-3 rounded-lg backdrop-blur-sm">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span className="font-bold">{comment.user_name}</span>
                      <span>{new Date(comment.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-white">{comment.content}</p>
                 </div>
               ))}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="コメントを入力..." 
                className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button onClick={handleSendComment} className="bg-primary/20 text-primary hover:bg-primary hover:text-white p-2 rounded-lg transition">
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
    </article>
  );
}