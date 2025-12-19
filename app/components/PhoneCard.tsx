'use client'

import { Phone } from "../types/types";

interface PhoneCardProps {
  phone: Phone;
  baseImage?: string;
  onChoice: (phone: Phone, isLeasing: boolean, amount: number) => void;
}

export default function PhoneCard({ phone, baseImage, onChoice }: PhoneCardProps) {
  const imgSrc = (() => {
    const img = phone.image || phone.img || phone.image_url || "";
    if (!img) return "";
    try {
      return new URL(baseImage+img).href;
    } catch {
      return img.startsWith("/")
        ? `${baseImage?.replace(/\/$/, "")}${img}`
        : img;
    }
  })();
  console.log(baseImage)

  const prixCash = phone.prixCash || phone.price || phone.prix || 0;
  const prixLeasing = phone.prixLeasing || phone.price_leasing || phone.prixLeasing;

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col transition hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-center justify-center h-40 bg-gray-100 rounded-xl">
        <img src={imgSrc} alt={phone.name || phone.nom} className="object-contain w-full h-full p-2"/>
      </div>

    <div className="mt-3 flex flex-col grow space-y-1">
  <h3 className="text-lg font-semibold text-gray-800 truncate">
    {phone.name || phone.nom}
    <span className="text-sm text-gray-500"> ({phone.memory || "-"})</span>
  </h3>

  <p className="text-blue-600 font-bold text-xl">
    {prixCash.toLocaleString()} FCFA
  </p>

  {prixLeasing && (
    <p className="text-gray-600 text-sm">
      {Math.round(prixCash * 0.65).toLocaleString()} FCFA / jour
    </p>
  )}
</div>


      {prixLeasing && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            className="bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-hover"
            onClick={() => onChoice(phone, true, Math.round(prixCash * 0.25))}
          >
            25%
          </button>

          <button
            className="bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600"
            onClick={() => onChoice(phone, true, Math.round(prixCash * 0.65))}
          >
            65%
          </button>

          <button
            className="bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600"
            onClick={() => onChoice(phone, false, Math.round(prixCash))}
          >
            CASH
          </button>
        </div>
      )}
    </div>
  );
}
