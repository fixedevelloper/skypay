"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, UserCheck2, ShoppingCart, ReceiptText, HelpCircle, Lock,Package2Icon } from "lucide-react";

type NavItem = {
  name: string;
  path: string;
  icon: any;
  role?: string; // 'all' | 'customers' | 'commercial' | etc.
};

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // 🔹 Récupération du rôle utilisateur (par défaut "guest")
  const userRole = session?.user?.role || "guest";
console.log(userRole)
  const items: NavItem[] = [
    { name: "Accueil", path: "/", icon: Home, role: "all" },
    { name: "Creation PV", path: "/create-pv", icon: UserCheck2, role: "all" },
    { name: "Achats", path: "/achats", icon: ShoppingCart, role: "customer" },
    { name: "Facture", path: "/factures", icon: ReceiptText, role: "all" },
    { name: "Creation PMEs", path: "/create-pmes", icon: Package2Icon, role: "all" },
    //{ name: "Aide", path: "/help", icon: HelpCircle, role: "all" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-sm flex justify-around py-2 z-50">
      {items.map(({ name, path, icon: Icon, role }) => {
        const active = pathname === path;
        const hasAccess = role === "all" || userRole === role;

        return (
          <div key={name} className="flex flex-col items-center">
            {hasAccess ? (
              <Link href={path} className="flex flex-col items-center">
                <Icon
                  className={`w-5 h-5 mb-1 transition-colors ${
                    active ? "text-blue-600" : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-xs transition-colors ${
                    active ? "text-blue-600 font-semibold" : "text-gray-600"
                  }`}
                >
                  {name}
                </span>
              </Link>
            ) : (
              <div className="flex flex-col items-center opacity-40 cursor-not-allowed">
                <Lock className="w-5 h-5 mb-1 text-gray-400" />
                <span className="text-xs text-gray-400">{name}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

