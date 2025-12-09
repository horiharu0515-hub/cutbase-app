"use client";

import { ArrowLeft, Mail, MessageCircle, FileQuestion } from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  const faqs = [
    {
      q: "CutBaseとは何ですか？",
      a: "動画編集者がつながり、案件を探したり悩みを共有したりできるSNSコミュニティです。"
    },
    {
      q: "利用料はかかりますか？",
      a: "現在はすべての機能を無料でご利用いただけます。"
    },
    {
      q: "退会したいのですが",
      a: "設定ページの一番下にある「アカウントを削除する」ボタンから手続きを行ってください。"
    },
    {
      q: "不適切な投稿を見つけました",
      a: "お問い合わせフォームより、該当の投稿URLと詳細をご連絡ください。"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-text-main font-sans p-4 pb-24 md:p-8">
      <div className="max-w-2xl mx-auto">
        
        <header className="flex items-center gap-4 mb-8">
            <Link href="/settings">
                <button className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
                    <ArrowLeft size={24} />
                </button>
            </Link>
            <h1 className="text-2xl font-bold">ヘルプ・お問い合わせ</h1>
        </header>

        <div className="space-y-8">
            
            <section>
                <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                    <FileQuestion size={20} /> よくある質問
                </h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="glass p-5 rounded-xl border border-white/5">
                            <h3 className="font-bold text-white mb-2">Q. {faq.q}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                    <Mail size={20} /> お問い合わせ
                </h2>
                <div className="glass p-6 rounded-xl border border-white/5 text-center">
                    <p className="text-gray-300 mb-6 text-sm">
                        不具合の報告やご要望、その他のお問い合わせは<br />以下のボタンからメールでご連絡ください。
                    </p>
                    <a 
                        href="mailto:support@cutbase.example.com?subject=CutBaseお問い合わせ"
                        className="inline-flex items-center gap-2 bg-primary hover:bg-accent text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-primary/20"
                    >
                        <MessageCircle size={20} />
                        サポートへメールを送る
                    </a>
                </div>
            </section>

        </div>
      </div>
    </div>
  );
}