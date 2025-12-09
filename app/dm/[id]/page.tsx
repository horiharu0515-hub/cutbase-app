"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { ArrowLeft, Send, User } from "lucide-react";
import Link from "next/link";

export default function DMChatPage() {
  const params = useParams();
  const router = useRouter();
  const partnerId = params.id as string; // チャット相手のID

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [partnerProfile, setPartnerProfile] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initChat();
    
    // リアルタイム更新（簡易ポーリング：3秒ごとに取得）
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  // 最新のメッセージまでスクロール
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const initChat = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        router.push('/login');
        return;
    }
    setCurrentUser(user);

    // 相手のプロフィール取得
    const { data: partner } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', partnerId)
      .single();
    
    setPartnerProfile(partner);
    fetchMessages();
  };

  const fetchMessages = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 自分⇔相手 のメッセージを全て取得
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true });

    setMessages(data || []);
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const { error } = await supabase
      .from('messages')
      .insert([{
        sender_id: currentUser.id,
        receiver_id: partnerId,
        content: newMessage
      }]);

    if (!error) {
      setNewMessage("");
      fetchMessages();
    }
  };

  if (!partnerProfile) return <div className="min-h-screen bg-background text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-background text-text-main font-sans">
      
      {/* ヘッダー */}
      <header className="flex items-center gap-4 p-4 border-b border-white/10 bg-surface/50 backdrop-blur-md sticky top-0 z-10">
        <Link href="/profile">
            <button className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
                <ArrowLeft size={20} />
            </button>
        </Link>
        <div className="flex items-center gap-3">
            <div 
                className="w-10 h-10 rounded-full bg-gray-700 border border-white/10 bg-cover bg-center"
                style={{ backgroundImage: `url(${partnerProfile.avatar_url})` }}
            >
                {!partnerProfile.avatar_url && <User className="m-2 text-gray-400" />}
            </div>
            <h1 className="font-bold text-lg">{partnerProfile.name}</h1>
        </div>
      </header>

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.length === 0 && (
            <p className="text-center text-gray-500 mt-10">メッセージを送って会話を始めましょう！</p>
        )}
        {messages.map((msg) => {
            const isMe = msg.sender_id === currentUser.id;
            return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-surface border border-white/10 text-gray-200 rounded-tl-none'}`}>
                        {msg.content}
                    </div>
                </div>
            );
        })}
      </div>

      {/* 入力エリア */}
      <div className="p-4 bg-surface/50 backdrop-blur-md border-t border-white/10 pb-safe">
        <div className="flex gap-2">
            <input 
                type="text" 
                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition"
                placeholder="メッセージを入力..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && handleSend()}
            />
            <button 
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="bg-primary hover:bg-accent text-white p-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Send size={20} />
            </button>
        </div>
      </div>
    </div>
  );
}