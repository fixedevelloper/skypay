'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BottomNav from "@/app/components/BottomNav";
import Header from "@/app/components/Header";
import mtn from "@/public/icons/momo_mtnb.png";
import orange from "@/public/icons/orange.png";
import axiosServices from "../lib/axios";

export default function CheckoutList() {
  const router = useRouter();
  const { data: session } = useSession();

  const [platform, setPlatform] = useState<"MTN" | "ORANGE">("MTN");
  const [phone, setPhone] = useState(session?.user?.phone || "");
  const [products, setProducts] = useState<any[]>([]);
  const [amount, setAmount] = useState(0.0);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("selectedPhones");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setProducts(parsed);
        const total = parsed.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
        setAmount(total);
      } catch (err) {
        console.error("Erreur parsing JSON:", err);
      }
    }
  }, []);


  // 🔹 Calcul du montant total
  const totalAmount = products.reduce(
      (sum, p) => sum + (p.amount || 0),
      0
  );

  // 🔹 Envoi du paiement
  const handleValidate = async () => {
    if (!phone || phone.length < 9) {
      setError("Veuillez entrer un numéro de téléphone valide.");
      return;
    }

    if (products.length === 0) {
      setError("Aucun produit sélectionné.");
      return;
    }

    setLoading(true);
    setError(null);
    setStatus("PENDING");

    try {
      const response = await axiosServices.post("/api/orders", {
        user_id: session?.user?.id,
        operator: platform,
        items: products.map(p => ({
          product_id: p.product_id,
          quantity: p.quantity ?? 1,
        })),
        meta: { phone } // plus clair et extensible
      });


      const data = response.data.order; // backend renvoie { order: {...} }

      if (data?.id) {
        // Stocke la référence de commande
        localStorage.setItem("referenceId", data.reference_id.toString());
        router.push("/checkout/waiting-pay");
      } else {
        throw new Error("Aucune référence de commande reçue.");
      }
    } catch (err: any) {
      console.error("Erreur de paiement:", err.response?.data || err.message);
      setError(err.response?.data?.message || err.message || "Erreur inattendue.");
      setStatus("FAILED");
    } finally {
      setLoading(false);
    }
  };


  return (
      <div className="min-h-screen bg-gray-100 pb-24 flex flex-col">
        <Header />
        <div className="bg-[#014d74] h-24" />

        <main className="flex-1 -mt-20 px-4 sm:px-6 md:px-8 flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">
              💳 Paiement du téléphone
            </h2>

            {/* Choix de la plateforme */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { name: "MTN", img: mtn },
                { name: "ORANGE", img: orange },
              ].map(({ name, img }) => (
                  <button
                      key={name}
                      onClick={() => setPlatform(name as "MTN" | "ORANGE")}
                      className={`flex flex-col items-center justify-center rounded-xl border-2 bg-white p-3 transition-all ${
                          platform === name
                              ? "border-[#014d74] shadow-lg scale-105"
                              : "border-gray-300 hover:border-[#014d74]/50"
                      }`}
                  >
                    <Image
                        src={img}
                        alt={`${name} Money`}
                        width={70}
                        height={70}
                        className="object-contain"
                    />
                    <span
                        className={`mt-2 text-sm font-semibold ${
                            platform === name ? "text-[#014d74]" : "text-gray-600"
                        }`}
                    >
                  {name} Money
                </span>
                  </button>
              ))}
            </div>

            {/* Liste des produits */}
            {products.length === 0 ? (
                <p className="text-center text-gray-500 mb-5">
                  Aucun produit sélectionné
                </p>
            ) : (
                products.map((p, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg shadow-sm mb-4"
                    >
                      <div className="bg-[#014d74]/10 p-2 rounded-full text-lg">🛍️</div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Article sélectionné</p>
                        <h3 className="font-bold text-gray-800 text-lg">{p.phone}</h3>
                        <p className="text-blue-600 font-semibold">{p.amount?.toLocaleString()} FCFA</p>
                      </div>
                    </div>
                ))
            )}

            {/* Téléphone */}
            <div className="mb-5">
              <label htmlFor="phone" className="block font-medium text-gray-700">
                Numéro de paiement :
              </label>
              <input
                  id="phone"
                  type="text"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:ring-2 focus:ring-[#014d74] focus:outline-none"
                  placeholder="+2376XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Montant total */}
            <div className="mb-6 text-center">
              <label className="font-medium text-gray-700 block">
                Montant à payer :
              </label>
              <div className="mt-2 text-3xl font-bold text-[#014d74]">
                {totalAmount.toLocaleString()} <span className="text-sm">FCFA</span>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full rounded-xl bg-gray-400 py-2 font-semibold text-white hover:bg-gray-500 transition"
              >
                Annuler
              </button>
              <button
                  type="button"
                  onClick={handleValidate}
                  disabled={loading || products.length === 0}
                  className={`w-full rounded-xl py-2 font-semibold text-white transition-colors ${
                      loading || products.length === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#014d74] hover:bg-[#01385a]"
                  }`}
              >
                {loading ? "Traitement..." : "Valider le paiement"}
              </button>
            </div>

            {/* Statut du paiement */}
            <div className="mt-6 text-center">
              {status === "PENDING" && (
                  <div className="text-yellow-600 font-medium animate-pulse">
                    ⏳ Paiement en cours...
                  </div>
              )}
              {status === "FAILED" && (
                  <div className="text-red-600 font-medium">
                    ❌ Paiement échoué : {error}
                  </div>
              )}
              {error && status !== "FAILED" && (
                  <div className="text-red-600 font-medium">⚠️ {error}</div>
              )}
            </div>
          </div>
        </main>

        <BottomNav />
      </div>
  );
}

