'use client'

import {Phone} from "../types/types";
import {useSession} from "next-auth/react";
import {toFixedNumber} from "@react-stately/utils";

interface PhoneCardProps {
    phone: Phone;
    baseImage?: string;
    onChoice: (phone: Phone, isLeasing: boolean, amount: number) => void;
}

export default function PhoneCard({phone, baseImage, onChoice}: PhoneCardProps) {
    const { data: session, status } = useSession();
    const imgSrc = (() => {
        const img = phone.image || phone.img || phone.image_url || "";
        if (!img) return "";
        try {
            return new URL(baseImage + img).href;
        } catch {
            return img.startsWith("/")
                ? `${baseImage?.replace(/\/$/, "")}${img}`
                : img;
        }
    })();

    const prixCash=phone.price|| 0.0

    return (
        <div
            className="bg-white rounded-2xl shadow-md p-4 flex flex-col transition hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center justify-center h-40 bg-gray-100 rounded-xl">
                <img src={imgSrc} alt={phone.name} className="object-contain w-full h-full p-2"/>
            </div>

            <div className="mt-3 flex flex-col grow space-y-1">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {phone.name}
                    <span className="text-sm text-gray-500"> ({phone.memory || "-"})</span>
                </h3>

                <p className="text-blue-600 font-bold text-xl">
                    {prixCash.toLocaleString()} FCFA
                </p>
            </div>

            <button
                className="bg-red-500 text-white py-1 mt-2 rounded-lg text-sm font-medium hover:bg-red-600"
                onClick={() => onChoice(phone, false, Math.round(prixCash))}
            >
                PAY
            </button>
        </div>
    );
}
