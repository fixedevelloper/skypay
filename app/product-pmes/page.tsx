'use client'
import BottomNav from "@/app/components/BottomNav";
import Header from "@/app/components/Header";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {Phone} from "../types/types";
import {useSession} from "next-auth/react";
import axiosServices from "../lib/axios";
import PhoneGrid from "../components/PhoneGrid";
import {enqueueSnackbar} from "notistack";
import PhoneList from "../components/PhoneList";


export default function Page() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [phones, setPhones] = useState<Phone[]>([]);
    const BASE_IMAGE = process.env.NEXT_PUBLIC_API_URL;

    /* =======================
       🔐 PROTECTION DE LA PAGE
       ======================= */
    useEffect(() => {
        if (status === "loading") return;

        if (!session?.user) {
            enqueueSnackbar("Veuillez vous connecter", { variant: "warning" });
            router.replace("/auth/signin");
            return;
        }

        const roles: string[] = session.user.roles || [];

        // ❌ Client simple → pas accès
        if (roles.includes("customer")) {
            enqueueSnackbar(
                "Vous n'avez pas accès à cette page, veuillez créer un point de vente",
                { variant: "error" }
            );
            router.replace("/");
            return;
        }

        // ❌ Pas commercial
        if (!roles.includes("pme")) {
            enqueueSnackbar("Vous n'avez pas accès à cette page", {
                variant: "error",
            });
            router.replace("/");
            return;
        }

    }, [session, status, router]);


    /* =======================
       📦 FETCH PRODUITS
       ======================= */
    useEffect(() => {
        if (!session?.user) return;

        const fetchProducts = async () => {
            try {
                const res = await axiosServices.get<Phone[]>("/api/products?code=PME");
                setPhones(res.data);
            } catch (err) {
                console.warn("API error:", err);
            }
        };

        fetchProducts();
    }, [session]);

    /* =======================
       🛒 GESTION DU CHOIX DES PRODUITS
       ======================= */
    const handleChoice = (selectedPhones: any[]) => {
        // Stockage dans sessionStorage
        sessionStorage.setItem("selectedPhones", JSON.stringify(selectedPhones));
    };

    /* =======================
       ⏳ LOADING STATE
       ======================= */
    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="text-gray-500">Chargement...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            <Header />
            <div className="bg-[#014d74] h-24" />

            {/* =======================
                LISTE DES PRODUITS
                ======================= */}
            <PhoneList
                phones={phones}
                baseImage={BASE_IMAGE}
                onChoice={handleChoice} // récupère la sélection et met à jour sessionStorage
            />

            <BottomNav />
        </div>
    );
}


