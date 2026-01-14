'use client'

import { Phone } from "../types/types";
import React, {useState} from "react";
import PhoneCardList from "./PhoneCardList";
import {useRouter} from "next/navigation";

interface PhoneListProps {
    phones: Phone[];
    baseImage?: string;
    onChoice: (selectedPhones: any[]) => void;
}

export default function PhoneList({ phones, baseImage }: PhoneListProps) {
    const [selected, setSelected] = useState<{ [id: string]: any }>({});
    const router = useRouter();

    const handleUpdate = (phone: Phone, quantity: number, checked: boolean) => {
        setSelected((prev) => {
            const copy = { ...prev };
            if (checked) {
                copy[phone.id] = {
                    product_id: phone.id,
                    phone: phone.name || phone.nom,
                    is_custom: phone.isCustom ?? false,
                    is_cash: true,
                    amount: Number(phone.prixCash || phone.price || phone.prix || 0) * quantity,
                };
            } else {
                delete copy[phone.id];
            }
            return copy;
        });
    };

    const handleAddToCheckout = () => {
        const items = Object.values(selected);
        if (items.length === 0) {
            alert("Veuillez sélectionner au moins un produit");
            return;
        }

        sessionStorage.setItem("selectedPhones", JSON.stringify(items));
        router.push("/checkout-list");
    };

    return (
        <div className="flex flex-col gap-4 p-3">
            {phones.map((phone) => (
                <PhoneCardList
                    key={phone.id}
                    phone={phone}
                    baseImage={baseImage}
                    onUpdate={handleUpdate}
                />
            ))}

            <button
                onClick={handleAddToCheckout}
                className="mt-4 w-full sm:w-1/3 mx-auto py-2 bg-[#014d74] hover:bg-[#01385a] text-white rounded-xl font-semibold transition"
            >
                Ajouter au checkout
            </button>
        </div>
    );
}


