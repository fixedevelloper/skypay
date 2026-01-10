'use client'

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";
import Header from "./Header";
import WalletCard from "./WalletCard";
import BottomNav from "./BottomNav";
import HomeGrid from "./HomeCard";

export default function HomePage() {

  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Header />
      <div className="bg-[#014d74] h-24"/>
      <WalletCard />

      <HomeGrid/>


      <BottomNav />
    </div>
  );
}

