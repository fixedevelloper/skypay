'use client'
import BottomNav from "@/app/components/BottomNav";
import Header from "@/app/components/Header";
import ServiceGrid from "@/app/components/ServiceGrid";
import WalletCard from "@/app/components/WalletCard";



export default function EditProfil() {
  return (
      <div className="min-h-screen bg-gray-100 pb-20">
        <Header />
        <div className="bg-[#014d74] h-24"></div>
 
        <BottomNav />
      </div>
  );
}
