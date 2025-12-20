"use client";

import BottomNav from "@/app/components/BottomNav";
import Header from "@/app/components/Header";
import { ShoppingBagIcon, SquareChevronUp, UserCog2Icon,PlusSquareIcon,HelpCircleIcon } from "lucide-react";
import Link from "next/link";

export default function Profil() {
  const options = [
    {
      title: "Mes achats",
      icon: <ShoppingBagIcon className="w-6 h-6 text-[#014d74]" />,
      description: "Consultez l’historique de vos commandes et paiements.",
      link:'achats'
    },
    {
      title: "Nouvelle Vente",
      icon: <PlusSquareIcon className="w-6 h-6 text-[#014d74]" />,
      description: "Effectuer une nouvelle vente.",
      link:'nouvelle-vente'
    },
    {
      title: "Aide",
      icon: <HelpCircleIcon className="w-6 h-6 text-[#014d74]" />,
      description: "Aide",
      link:'help'
    },
    {
      title: "Mot de passe",
      icon: <SquareChevronUp className="w-6 h-6 text-[#014d74]" />,
      description: "Modifiez vos informations de connexion en toute sécurité.",
      link:'profil/changepassword'
    },
      {
      title: "Modifier Profil",
      icon: <UserCog2Icon className="w-6 h-6 text-[#014d74]" />,
      description: "Modifiez vos informations de connexion en toute sécurité.",
      link:'profil/edit-profil'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pb-20 flex flex-col">
      <Header />
      <div className="bg-[#014d74] h-24" />

      <div className="px-4 -mt-12 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Mon profil
        </h2>

        {options.map((item, index) => (
         <Link key={index} href={item.link}  className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">  
         <div
          
            className="flex items-start gap-4 bg-white p-4 "
         >
         
         
            <div className="bg-[#014d74]/10 p-3 rounded-full flex items-center justify-center">
              {item.icon}
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-lg">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{item.description}</p>
            </div>

            <span className="text-gray-400 text-lg">›</span>
          </div> </Link>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
