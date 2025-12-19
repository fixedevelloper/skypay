"use client";
import { XCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EchecPaiement() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const err = localStorage.getItem("error");
      setError(err);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 px-5">
      <XCircleIcon className="h-20 w-20 text-red-500" />
      <h2 className="mt-6 text-2xl font-semibold text-red-700">
        Paiement échoué ❌
      </h2>
      <p className="mt-2 text-gray-600 text-center max-w-md">
        {error || "Le paiement n’a pas pu être validé. Veuillez réessayer."}
      </p>

      <div className="mt-8 flex flex-row gap-4">
        <button
          onClick={() => router.back()}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Réessayer
        </button>

        <button
          onClick={() => router.push("/")}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
