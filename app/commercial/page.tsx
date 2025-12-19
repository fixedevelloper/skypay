'use client';

import { useEffect, useState } from "react";
import BottomNav from "@/app/components/BottomNav";
import Header from "@/app/components/Header";
import InputField from "../components/InputField";
import axiosServices from "../utils/axiosServices";
import { useRouter } from "next/navigation";

export default function Commercial() {
   const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerLocalisation, setCustomerLocalisation] = useState("");
  const [customerActivity, setCustomerActivity] = useState("");
  const [pointVente, setPointVente] = useState("");
  const [manager, setManager] = useState("");

  const [pointsVente, setPointsVente] = useState<{ id: number; name: string }[]>([]);
  const [loadingPoints, setLoadingPoints] = useState(true);

  const managers = [
    { id: "skypay", nom: "Manager - SKYPAY" },
    { id: "pv", nom: "Manager - PV" },
    { id: "a_mobile", nom: "Manager - A.Mobile" },
    { id: "a_fixe", nom: "Manager - A.Fixe" },
    { id: "partenaire", nom: "Manager - Partenaire" },
  ];

  useEffect(() => {
    const fetchPointVentes = async () => {
      try {
        const res = await axiosServices.get("/api/point-sales");
        setPointsVente(res.data || []);
      } catch (err) {
        console.warn("Erreur API:", err);
      } finally {
        setLoadingPoints(false);
      }
    };
    fetchPointVentes();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data={
      customerName,
      customerPhone,
      customerLocalisation,
      customerActivity,
      pointVente,
      manager,
    }
    console.log(data);
    sessionStorage.setItem('commercial_data', JSON.stringify(data))
   // alert("Client enregistré ✅");
   router.push('commercial/checkout')
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20 flex flex-col">
      <Header />
      <div className="bg-[#014d74] h-24"></div>

      <div className="px-4 -mt-12 flex-1">
        <div className="bg-white rounded-xl shadow-md p-6 space-y-5">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
            Enregistrement client
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              id="name_customer"
              label="Nom du client"
              placeholder="Ex: Jean Dupont"
              value={customerName}
              onChange={setCustomerName}
            />

            <InputField
              id="phone_customer"
              label="Téléphone"
              placeholder="Ex: 670000000"
              value={customerPhone}
              onChange={setCustomerPhone}
            />

            <InputField
              id="localisation_customer"
              label="Adresse"
              placeholder="Ex: Douala, Akwa"
              value={customerLocalisation}
              onChange={setCustomerLocalisation}
            />

            <InputField
              id="activity_customer"
              label="Activité"
              placeholder="Ex: Vente de téléphones"
              value={customerActivity}
              onChange={setCustomerActivity}
            />

            {/* 🔹 Sélection du point de vente */}
            <div>
              <label htmlFor="pointVente" className="block font-medium text-gray-700 mb-1">
                Point de vente
              </label>
              <select
                id="pointVente"
                value={pointVente}
                onChange={(e) => setPointVente(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#014d74] focus:outline-none  text-gray-700"
              >
                <option value="">Sélectionnez un point de vente</option>
                {loadingPoints ? (
                  <option disabled>Chargement...</option>
                ) : (
                  pointsVente.map((pv) => (
                    <option key={pv.id} value={pv.id}>
                      {pv.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* 🔹 Sélection du manager */}
            <div>
              <label htmlFor="manager" className="block font-medium text-gray-700 mb-1">
                Manager
              </label>
              <select
                id="manager"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#014d74] focus:outline-none  text-gray-700"
              >
                <option value="">Sélectionnez un manager</option>
                {managers.map((mng) => (
                  <option key={mng.id} value={mng.id}>
                    {mng.nom}
                  </option>
                ))}
              </select>
            </div>

            {/* 🔹 Bouton d'enregistrement */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#014d74] text-white py-2 rounded-lg font-semibold hover:bg-[#03609a] transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

