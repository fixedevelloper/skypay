'use client'

import BottomNav from "@/app/components/BottomNav";
import Header from "@/app/components/Header";
import {MessageCircle} from "lucide-react";
import React, {useEffect, useState} from "react";
import {Phone} from "../types/types";
import {useSession} from "next-auth/react";
import axiosServices from "../lib/axios";


export default function Page() {
    const [phones, setPhones] = useState<Phone[]>([]);
    const {data: session} = useSession();
    const BASE_IMAGE = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        axiosServices
            .get<Phone[]>("/api/products?code=customer")
            .then(res => setPhones(res.data))
            .catch(err => console.warn(err));
    }, []);

    const buildWhatsappLink = (phone: Phone) => {
        const number = "237683806782";

        const message = `
Bonjour CCA 👋

Je souhaite effectuer un achat via le point CCA.

🛒 Produit :
• Modèle : ${phone?.name}
• Mémoire : ${phone?.memory || "-"}

💰 Prix : ${phone?.price?.toLocaleString()} FCFA

👤 Client :
• Nom : ${session?.user?.name || "Client"}
• Téléphone : ${session?.user?.phone || "-"}

Merci de bien vouloir m’assister pour la suite.
`;


        return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    };

    const getImageSrc = (phone: Phone) => {
        const img = phone.image || phone.img || phone.image_url;
        if (!img) return "/placeholder.png";

        return img.startsWith("/")
            ? `${BASE_IMAGE}${img}`
            : img;
    };

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            <Header/>
            <div className="bg-[#014d74] h-24"/>

            {/* CCA CARD */}
            <div className="max-w-5xl mx-auto -mt-10 px-4 mb-6">
                <div className="bg-white rounded-2xl shadow-lg p-5">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Vente assistée – Point CCA
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Sélectionnez un produit puis finalisez l’achat via WhatsApp avec votre CCA.
                    </p>
                </div>
            </div>

            {/* PRODUCTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
                {phones.map(phone => (
                    <div
                        key={phone.id}
                        className="bg-white rounded-2xl shadow-md p-4 flex flex-col hover:shadow-xl transition"
                    >
                        <div className="h-40 bg-gray-100 rounded-xl flex items-center justify-center">
                            <img
                                src={getImageSrc(phone)}
                                alt={phone?.name}
                                className="object-contain w-full h-full p-2"
                            />
                        </div>

                        <div className="mt-3 grow">
                            <h3 className="text-lg font-semibold truncate">
                                {phone?.name}
                                <span className="text-sm text-gray-500">
                                    {" "}({phone?.memory || "-"})
                                </span>
                            </h3>

                            <p className="text-blue-600 font-bold text-xl mt-1">
                                {phone?.price?.toLocaleString()} FCFA
                            </p>
                        </div>

                        <a
                            href={buildWhatsappLink(phone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold"
                        >
                            <MessageCircle className="w-4 h-4"/>
                            Acheter via WhatsApp
                        </a>
                    </div>
                ))}
            </div>

            <BottomNav/>
        </div>
    );
}



