"use client";

import React, { useState } from "react";
import { userData } from "../data/user";
import { useSession } from "next-auth/react";
import {ArrowDownCircle, ArrowUpCircle, Eye, EyeOff, Receipt} from "lucide-react";

export default function WalletCard() {
  const [hidden, setHidden] = useState(true);
  const { data: session } = useSession();

  const name = session?.user?.name ?? "Invité";
  const balance = typeof session?.user?.balance === "number" ? session.user.balance : 0;

  return (

          <div className="relative mx-4  mt-[-30px] mb-4 z-10">
              <div
                  className="
          relative
          w-full
          overflow-hidden
          rounded-2xl
          shadow-lg
          bg-black
          h-[220px]
          sm:h-[300px]
          md:h-[380px]
          lg:h-[460px]
        "
              >
                  <video
                      className="absolute inset-0 h-full w-full object-cover"
                      src="/videos/video.mp4"
                      poster="/logo.jpeg"
                      autoPlay
                      muted
                      playsInline
                      loop
                      preload="none"
                      onCanPlay={(e) => e.currentTarget.play()}
                  />
              </div>
          </div>


/*   <div className="bg-white rounded-2xl shadow-md mx-4 mt-[-30px] p-4 relative z-10">
      {/!* Header *!/}
      <p className="text-gray-500 text-sm">Portefeuille</p>
      <p className="text-lg font-semibold text-gray-500">{name}</p>

      {/!* Balance *!/}
      <div className="flex items-center justify-between mt-1">
        <p className="text-xl font-bold text-gray-500">
          {hidden ? "FCFA ******" : `FCFA ${balance.toLocaleString()}`}
        </p>
        <button onClick={() => setHidden(!hidden)} className="text-gray-600">
          {hidden ? <EyeOff size={28} /> : <Eye size={28} />}
        </button>
      </div>

      {/!* Actions *!/}
      <div className="flex justify-around mt-3 border-t pt-4 text-[#014d74] font-medium">
        <div className="flex flex-col items-center cursor-pointer hover:opacity-80">
          <ArrowDownCircle size={26} />
          <p className="text-sm mt-1">Dépôt</p>
        </div>

        <div className="flex flex-col items-center cursor-pointer hover:opacity-80">
          <ArrowUpCircle size={26} />
          <p className="text-sm mt-1">Retrait</p>
        </div>

        <div className="flex flex-col items-center cursor-pointer hover:opacity-80">
          <Receipt size={26} />
          <p className="text-sm mt-1">Mes achats</p>
        </div>
      </div>
    </div>*/
  );
}