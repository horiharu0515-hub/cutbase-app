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
                    <p>この利用規約（以下，「本規約」といいます。）は，CutBase（以下，「当サービス」といいます。）の利用条件を定めるものです。登録ユーザーの皆さま（以下，「ユーザー」といいます。）には，本規約に従って，本サービスをご利用いただきます。</p>
                    
                    <h3 className="font-bold text-white mt-4">第1条（適用）</h3>
                    <p>本規約は，ユーザーと当サービスとの間の本サービスの利用に関わる一切の関係に適用されるものとします。</p>

                    <h3 className="font-bold text-white mt-4">第2条（禁止事項）</h3>
                    <p>ユーザーは，本サービスの利用にあたり，以下の行為をしてはなりません。</p>
                    <ul className="list-disc list-inside ml-2 space-y-1">
                        <li>法令または公序良俗に違反する行為</li>
                        <li>犯罪行為に関連する行為</li>
                        <li>当サービスのサーバーまたはネットワークの機能を破壊したり，妨害したりする行為</li>
                        <li>他のユーザーに対する嫌がらせや誹謗中傷</li>
                    </ul>

                    <h3 className="font-bold text-white mt-4">第3条（免責事項）</h3>
                    <p>当サービスは，本サービスに事実上または法律上の瑕疵（安全性，信頼性，正確性，完全性，有効性，特定の目的への適合性，セキュリティなどに関する欠陥，エラーやバグ，権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。</p>
                </div>
            </section>

            <section className="glass p-6 rounded-xl border border-white/5">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                    <Shield size={20} className="text-green-400" /> プライバシーポリシー
                </h2>
                <div className="text-sm text-gray-400 space-y-4">
                    <p>CutBase（以下，「当サービス」といいます。）は，本ウェブサイト上で提供するサービスにおける，ユーザーの個人情報の取扱いについて，以下のとおりプライバシーポリシー（以下，「本ポリシー」といいます。）を定めます。</p>
                    <p>当サービスは、ユーザーから取得したメールアドレス等の個人情報を、本サービスの提供・運営のためにのみ利用し、第三者に提供することはありません。</p>
                </div>
            </section>

        </div>
      </div>
    </div>
  );
}