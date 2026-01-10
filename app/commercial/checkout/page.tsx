'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BottomNav from "@/app/components/BottomNav";
import Header from "@/app/components/Header";

import mtn from "@/public/icons/momo_mtnb.png";
import orange from "@/public/icons/orange.png";
import { LucideUserPlus, ShoppingBag, ShoppingBasketIcon, Users } from "lucide-react";
import axiosServices from "../../lib/axios";

export default function Checkout() {
    const router = useRouter();
    const { data: session } = useSession();
    const [platform, setPlatform] = useState<"MTN" | "ORANGE">("MTN");
    const [phone, setPhone] = useState(session?.user?.phone || "");
    const [amount, setAmount] = useState<number>(0);
    const [productName, setProductName] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectItem, setSelectItem] = useState<any>(null);
    const [selectCommercial, setSelectCommercial] = useState<any>(null);

    // Charger les infos du téléphone sélectionné
    useEffect(() => {
        const data = sessionStorage.getItem("selectedPhone");
        const data_commercial = sessionStorage.getItem("commercial_data");
        if (data) {
            try {
                const parsed = JSON.parse(data);
                setAmount(parsed.amount || 0);
                setProductName(parsed.phone)
                 setSelectItem(parsed);
                console.log(parsed)
            } catch (err) {
                console.error("Erreur parsing JSON:", err);
            }
        }
        if (data_commercial) {
            try {
                const parsed = JSON.parse(data_commercial);
                setCustomerName(parsed.customerName);
 setSelectCommercial(parsed);
            } catch (err) {
                console.error("Erreur parsing JSON:", err);
            }
        }
    }, []);

    // Fonction de validation du paiement
    // 🔹 Envoi du paiement
    const handleValidate = async () => {
        if (!phone || phone.length < 9) {
            setError("Veuillez entrer un numéro de téléphone valide.");
            return;
        }

        setLoading(true);
        setError(null);
        setStatus("PENDING");

        try {
            const response = await axiosServices.post("/api/orders", {
                user_id: session?.user?.id,
                operator: platform, // correspond à 'operator' côté backend
                items: [{
                    product_id: selectItem?.product_id,
                    quantity:  1, // assure une quantité
                }],
                meta: { phone,
                    customer_name:customerName,
                    customer_phone:selectCommercial.customerPhone,
                    customer_localisation:selectCommercial.customerLocalisation,
                    customer_activity:selectCommercial.customerActivity,
                    sale_point:selectCommercial.pointVente,
                    manager:selectCommercial.manager, } // plus clair et extensible
            });
            const data = response.data; 

            if (data.referenceId) {
                localStorage.setItem("referenceId", data.referenceId);
                router.push("/checkout/waiting-pay");
            } else {
                throw new Error("Aucune référence de paiement reçue.");
            }
        } catch (err: any) {
            console.error("Erreur de paiement:", err.response?.data || err.message);
            setError(err.response?.data?.error || err.message || "Erreur inattendue.");
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
                        Paiement du téléphone
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
                                className={`flex items-center justify-center rounded-xl border-2 bg-white p-4 transition-all ${platform === name
                                    ? "border-green-500 shadow-md scale-105"
                                    : "border-gray-300 hover:border-blue-400"
                                    }`}
                            >
                                <Image
                                    src={img}
                                    alt={`${name} Money`}
                                    width={100}
                                    height={100}
                                    className="max-h-16 w-auto object-contain"
                                />
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm mb-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                            <LucideUserPlus className="text-gray-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Client</p>
                            <h3 className="font-bold text-gray-800 text-lg">{customerName}</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm mb-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                            <ShoppingBasketIcon className="text-gray-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Article sélectionné</p>
                            <h3 className="font-bold text-gray-800 text-lg">{productName}</h3>
                        </div>
                    </div>

                    {/* Numéro */}
                    <div className="mb-5">
                        <label htmlFor="phone" className="block font-medium text-gray-700">
                            Numéro pour le paiement :
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

                    {/* Montant */}
                    <div className="mb-6">
                        <label className="font-medium text-gray-700">Montant</label>
                        <div className="mt-2 text-2xl font-bold text-gray-900">
                            {amount.toLocaleString()} <span className="text-sm">FCFA</span>
                        </div>
                    </div>

                    {/* Boutons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="w-full rounded-xl bg-gray-400 py-2 font-semibold text-white hover:bg-gray-500 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            onClick={handleValidate}
                            className={`w-full rounded-xl bg-[#014d74] py-2 font-semibold text-white transition-colors ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#013b5a]"
                                }`}
                            disabled={loading}
                        >
                            {loading ? "Traitement..." : "Valider"}
                        </button>
                    </div>

                    {/* Statut */}
                    <div className="mt-6 text-center">
                        {status === "PENDING" && (
                            <div className="text-yellow-600 font-medium">
                                ⏳ Paiement en cours...
                            </div>
                        )}
                        {status === "FAILED" && (
                            <div className="text-red-600 font-medium">
                                ❌ Paiement échoué — {error}
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

