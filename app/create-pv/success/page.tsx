"use client";

import BottomNav from "@/app/components/BottomNav";
import Header from "@/app/components/Header";
import { CheckCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuccessPaiement() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-20">
      {/* ✅ Bandeau supérieur */}
      <Header />
      <div className="bg-[#014d74] h-24" />

      {/* ✅ Contenu principal */}
      <div className="flex flex-col items-center justify-center flex-grow bg-green-50 px-5 animate-fadeIn">
        <CheckCircleIcon className="h-20 w-20 text-green-500 animate-bounce" />
        <h2 className="mt-6 text-2xl font-semibold text-green-700">
          Paiement réussi 🎉
        </h2>
        <p className="mt-2 text-gray-600 text-center max-w-md">
          Votre paiement a été confirmé avec succès. Merci pour votre confiance !
        </p>

        <button
          onClick={() => router.push("/")}
          className="mt-8 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Retour à l'accueil
        </button>
      </div>

      {/* ✅ Barre de navigation inférieure */}
      <BottomNav />
    </div>
  );
}
