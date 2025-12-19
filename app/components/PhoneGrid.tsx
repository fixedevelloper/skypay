'use client'

import { useState } from "react";
import { Phone } from "../types/types";
import CustomPhoneCard from "./CustomPhoneCard";
import PhoneCard from "./PhoneCard";
import CustomModal from "./CustomModal";

interface PhoneGridProps {
  phones: Phone[];
  baseImage?: string;
  onChoice: (phone: Phone, isLeasing: boolean, amount: number) => void;
}

export default function PhoneGrid({ phones, baseImage, onChoice }: PhoneGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
      {phones.map(phone => (
        <PhoneCard key={phone.id} phone={phone} baseImage={baseImage} onChoice={onChoice} />
      ))}

      {/* Carte Custom */}
      <CustomPhoneCard onChoice={onChoice} />
    </div>
  );}
