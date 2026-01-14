"use client";
import {useEffect, useState} from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import axiosServices from "../lib/axios";
import {Order} from "../types/types";


export default function Achats() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axiosServices.get("/api/orders");
                setOrders(res.data.data ?? res.data); // compatible paginé / non paginé
            } catch {
                setError("Impossible de charger les achats");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            <Header />
            <div className="bg-[#014d74] h-24"></div>

            <div className="max-w-4xl mx-auto mt-4 px-4">
                <h2 className="text-lg font-semibold mb-3 text-gray-500">
                    Liste des achats
                </h2>

                {loading && <p className="text-center text-gray-500">Chargement...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!loading && !error && orders.length === 0 && (
                    <p className="text-center text-gray-500">Aucun achat trouvé.</p>
                )}

                <div className="grid gap-4">
                    {orders.map(order => (
                        <div
                            key={order.id}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center px-4 py-3 border-b">
                                <div>
                                    <p className="text-sm text-gray-500">Commande</p>
                                    <p className="font-semibold text-gray-800">
                                        #00{order.id ?? order.id}
                                    </p>
                                </div>

                                <span
                                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                                        order.status === "confirmed"
                                            ? "bg-green-100 text-green-700"
                                            : order.status === "failed"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                    {order.status.toUpperCase()}
                </span>
                            </div>

                            {/* Body */}
                            <div className="px-4 py-3">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p>
                                            🛒 <span className="font-medium">{order.items.length}</span> articles
                                        </p>
                                    </div>

                                    {order?.meta.mode !== 'distribute' && (
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">Total</p>
                                            <p className="text-lg font-bold text-blue-600">
                                                {order.amount.toLocaleString()} FCFA
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Items */}
                                <div className="mt-3 bg-gray-50 rounded-lg p-2">
                                    {order.items.map(item => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between text-xs text-gray-600 py-1"
                                        >
                            <span>
                                {item.product.name}
                                <span className="ml-1 text-gray-400">
                                    × {item.quantity}
                                </span>
                            </span>

                                            {order?.meta.mode !== 'distribute' && (
                                                <span className="font-medium">
                                    {item.amount.toLocaleString()} FCFA
                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                    <span>
                        📅 {new Date(order.created_at).toLocaleDateString()}
                    </span>

                                    {order.status !== "confirmed" && (
                                        <button className="text-blue-600 font-medium hover:underline">
                                            Payer maintenant →
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


            </div>

            <BottomNav />
        </div>
    );
}
