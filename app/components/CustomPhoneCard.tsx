'use client'

import { useState } from "react";
import { Phone } from "../types/types";
import CustomModal from "./CustomModal";

interface CustomPhoneCardProps {
  onChoice: (phone: Phone, isLeasing: boolean, amount: number) => void;
}

export default function CustomPhoneCard({ onChoice }: CustomPhoneCardProps) {
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("");

  const handleCustomiseSubmit = ({ name, price }: { name: string; price: string }) => {
    if (!name || !price) return;
    const customPhone: Phone = {
      id: Date.now(),
      name,
      prixCash: Number(price),
      isCustom: true,
    };
    onChoice(customPhone, false, Number(price));
    setCustomModalOpen(false);
    setCustomName("");
    setCustomPrice("");
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col transition hover:shadow-xl hover:-translate-y-1">
        <div className="flex items-center justify-center h-40 bg-gray-100 rounded-xl">
          <img src='/custom.png' alt='custom_phone' className="object-contain w-full h-full p-2"/>
        </div>

     <div className="mt-3 flex flex-col grow space-y-1">
  <h3 className="text-lg font-semibold text-gray-800 truncate">
    Custom
    <span className="text-sm text-gray-500"> (-)</span>
  </h3>

  <p className="text-blue-600 font-bold text-xl">
    XXX FCFA
  </p>
</div>


        <div className="mt-4">
          <button
  type="button"
  className="
    w-full 
    py-2 px-4 
    rounded-lg 
    text-sm font-medium 
    bg-blue-600 
    text-white 
    hover:bg-blue-700 
    transition-colors duration-200 
    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
  "
  onClick={() => setCustomModalOpen(true)}
>
  Paye
</button>

        </div>
      </div>

      <CustomModal
        isOpen={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        onSubmit={handleCustomiseSubmit}
        name={customName}
        setName={setCustomName}
        price={customPrice}
        setPrice={setCustomPrice}
      />
    </>
  );
}
