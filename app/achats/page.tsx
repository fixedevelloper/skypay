
"use client";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import axiosServices from "../lib/axios";

interface Customer {
  id: number;
  name: string;
}

interface Purchase {
  id: number;
  reference: string;
   product: string;
    pay_type: string;
  total: number;
  rest_pay:number;
  status: string;
  customer: Customer;
  created_at: string;
}

export default function Achats() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axiosServices.get("/api/purchases"); // 🔹 ton endpoint Laravel
        setPurchases(res.data);
      } catch (err: any) {
        setError("Impossible de charger les achats");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Header />
      <div className="bg-[#014d74] h-24"></div>

      <div className="max-w-4xl mx-auto mt-4 px-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-500">Liste des achats</h2>

        {loading && <p className="text-center text-gray-500">Chargement...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && purchases.length === 0 && (
          <p className="text-center text-gray-500">Aucun achat trouvé.</p>
        )}

        <div className="grid gap-3">
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="bg-white shadow-sm rounded-lg p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">
                    Product : {purchase.product}
                  </p>
                  <p className="text-sm text-gray-600">
                    Client : {purchase.customer?.name || "Inconnu"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Reste a payer : {purchase.rest_pay}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-blue-600 font-semibold">
                    {purchase.total.toLocaleString()} FCFA
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      purchase.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {purchase.status}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(purchase.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
