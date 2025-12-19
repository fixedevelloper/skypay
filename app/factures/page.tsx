'use client';
import { useEffect, useState } from "react";
import BottomNav from "@/app/components/BottomNav";
import Header from "@/app/components/Header";
import axiosServices from "../utils/axiosServices";
import { useRouter } from "next/navigation";

export default function Factures() {
  const [amount, setAmount] = useState("");
  const [purchase, setPurchase] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
 const router = useRouter();
  // 🔹 Charger la facture actuelle
  useEffect(() => {
    const fetchCurrentPurchase = async () => {
      try {
        const res = await axiosServices.get("/api/purchases/current");
        setPurchase(res.data || null);
      } catch (err) {
        console.warn("Erreur API:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentPurchase();
  }, []);

  // 🔹 Soumettre le paiement
  const handleSubmit = async () => {
    setError(null);
    setMessage(null);

    if (!amount || parseFloat(amount) <= 0) {
      setError("Veuillez entrer un montant valide.");
      return;
    }

    if (!purchase.purchase?.id) {
      setError("Aucun achat actif trouvé.");
      return;
    }

    setSubmitting(true);
    const paymentData = {
      purchase_id: purchase.purchase.id ,
      amount: amount,
    };
    sessionStorage.setItem('facture',JSON.stringify(paymentData))
     router.push('/factures/make-pay')
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <Header />
      <div className="bg-[#014d74] h-24"></div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* 🧾 Carte du produit */}
        <div className="bg-white rounded-xl shadow-md p-5">
          {loading ? (
            <p className="text-center text-gray-500">Chargement...</p>
          ) : purchase ? (
            <>
              <p className="text-sm text-gray-700">Produit</p>
              <div className="mt-2 text-xl font-bold text-[#014d74]">
                {purchase.purchase.product_name}
              </div>

              <p className="text-sm mt-3 text-gray-700">Reste à payer</p>
              <div className="mt-2 text-2xl font-bold text-green-600">
                {purchase.purchase.rest_pay} FCFA
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">
              Aucun paiement en attente.
            </p>
          )}
        </div>

        {/* 💸 Formulaire de paiement */}
        {purchase && (
          <div className="bg-white rounded-xl shadow-md p-5 space-y-4">
            <div>
              <label className="font-medium text-gray-700">
                Montant à payer
              </label>
              <input
                type="number"
                className="mt-2 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#014d74] text-gray-600"
                placeholder="Ex: 5000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
            {message && (
              <p className="text-green-600 text-sm text-center">{message}</p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className={`w-full py-2 rounded-lg font-semibold text-white transition-colors ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#014d74] hover:bg-sky-700"
              }`}
            >
              {submitting ? "Traitement..." : "Valider le paiement"}
            </button>
          </div>
        )}

        {/* 🧮 Historique des paiements */}
        {purchase?.paiements?.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-5">
            <h3 className="font-bold text-gray-800 mb-3">
              Historique des paiements
            </h3>
            <ul className="space-y-2">
              {purchase.paiements.map((p: any, index: number) => (
                <li
                  key={index}
                  className="flex justify-between border-b pb-1 text-sm text-gray-700"
                >
                  <span>{p.confirmed_at || "Date inconnue"}</span>
                  <span className="font-semibold text-green-600">
                    {p.amount} FCFA
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
