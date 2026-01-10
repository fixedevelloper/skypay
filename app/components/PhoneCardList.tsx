'use client'

import {Phone} from "../types/types";
import { useMemo, useState } from "react";

interface PhoneCardListProps {
    phone: Phone;
    baseImage?: string;
    onUpdate: (phone: Phone, quantity: number, checked: boolean) => void;
}

export default function PhoneCardList({
                                          phone,
                                          baseImage = "",
                                          onUpdate,
                                      }: PhoneCardListProps) {
    const [quantity, setQuantity] = useState<number>(1);
    const [checked, setChecked] = useState<boolean>(false);

    const imgSrc = useMemo(() => {
        const img = phone.image || phone.img || phone.image_url || "";
        if (!img) return "/placeholder.png";
        if (img.startsWith("http")) return img;
        return `${baseImage.replace(/\/$/, "")}/${img.replace(/^\//, "")}`;
    }, [phone, baseImage]);

    const prixCash = Number(phone.prixCash || phone.price || phone.prix || 0);
    const totalAmount = prixCash * quantity;
    const isDisabled = quantity <= 0 || prixCash <= 0;

    const handleCheck = (v: boolean) => {
        setChecked(v);
        onUpdate(phone, quantity, v);
    };

    const handleQuantityChange = (q: number) => {
        setQuantity(q);
        if (checked) onUpdate(phone, q, checked);
    };

    return (

 <div className="flex flex-col sm:flex-row items-center gap-4 bg-white rounded-xl shadow-sm p-3 hover:shadow-md transition">

            {/* CHECKBOX */}
            <input
                type="checkbox"
                checked={checked}
                disabled={isDisabled}
                onChange={(e) => handleCheck(e.target.checked)}
                className="w-5 h-5 accent-red-500"
            />

            {/* IMAGE */}
           <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                <img src={imgSrc} alt={phone.name || phone.nom} className="object-contain w-full h-full p-2" />
            </div>

            {/* INFO – largeur fixe */}
            <div className="min-w-0 w-48">
                <p className="text-lg font-semibold text-gray-800 truncate">{phone.name || phone.nom}</p>
                <p className="text-sm text-gray-500">Mémoire : {phone.memory || "-"}</p>
                <p className="font-medium text-blue-600">{prixCash.toLocaleString()} FCFA</p>
            </div>

            {/* QUANTITÉ */}
            <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
                className="w-20 border rounded-lg p-1 text-center text-gray-800"
            />

            {/* TOTAL */}
            <div className="w-32 text-right font-semibold text-blue-700">{totalAmount.toLocaleString()} FCFA</div>
        </div>
    );
}




