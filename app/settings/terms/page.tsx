"use client";

import { ArrowLeft, FileText, Shield } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-text-main font-sans p-4 pb-24 md:p-8">
      <div className="max-w-2xl mx-auto">
        
        <header className="flex items-center gap-4 mb-8">
            <Link href="/settings">
                <button className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
                    <ArrowLeft size={24} />
                </button>
            </Link>
            <h1 className="text-2xl font-bold">規約・ポリシー</h1>
        </header>

        <div className="space-y-8">
            
            <section className="glass p-6 rounded-xl border border-white/5">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                    <FileText size={20} className="text-primary" /> 利用規約
                </h2>
                <div className="text-sm text-gray-400 space-y-4 h-64 overflow-y-auto pr-2">
                    <p>この利用規約（以下，「本規約」といいます。）は，CutBase（以下，「当サービス」といいます。）の利用条件を定めるものです。</p>
                    
                    <h3 className="font-bold text-white mt-4">第1条（適用）</h3>
                    <p>本規約は，ユーザーと当サービスとの間の本サービスの利用に関わる一切の関係に適用されるものとします。</p>

                    <h3 className="font-bold text-white mt-4">第2条（禁止事項）</h3>
                    <p>ユーザーは，本サービスの利用にあたり，以下の行為をしてはなりません。</p>
                    <ul className="list-disc list-inside ml-2 space-y-1">
                        <li>法令または公序良俗に違反する行為</li>
                        <li>犯罪行為に関連する行為</li>
                        <li>他のユーザーに対する嫌がらせや誹謗中傷</li>
                    </ul>
                </div>
            </section>

            <section className="glass p-6 rounded-xl border border-white/5">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                    <Shield size={20} className="text-green-400" /> プライバシーポリシー
                </h2>
                <div className="text-sm text-gray-400 space-y-4">
                    <p>CutBase（以下，「当サービス」といいます。）は，本ウェブサイト上で提供するサービスにおける，ユーザーの個人情報の取扱いについて，以下のとおりプライバシーポリシーを定めます。</p>
                </div>
            </section>

        </div>
      </div>
    </div>
  );
}