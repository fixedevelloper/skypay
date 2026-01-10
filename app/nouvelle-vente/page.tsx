"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";
import { Phone } from "../types/types";
import axiosServices from "../lib/axios";
import Header from "../components/Header";
import PhoneGrid from "../components/PhoneGrid";
import CustomModal from "../components/CustomModal";
import BottomNav from "../components/BottomNav";
import {enqueueSnackbar, useSnackbar} from "notistack";

export default function NewSellPage() {
    const router = useRouter();
    const [phones, setPhones] = useState<Phone[]>([]);
    const BASE_IMAGE = process.env.NEXT_PUBLIC_API_URL;
    console.log(BASE_IMAGE)
    const [customModalOpen, setCustomModalOpen] = useState(false);
    const [customName, setCustomName] = useState("");
    const [customPrice, setCustomPrice] = useState("");
    const { data: session,status } = useSession();
    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        if (status === "loading") return;

        if (!session?.user) {
            enqueueSnackbar("Veuillez vous connecter", { variant: "warning" });
            router.replace("/auth/signin");
            return;
        }

        const roles: string[] = session.user.roles || [];
        console.log(session?.user)
        // ❌ Client simple → pas accès
        if (roles.includes("customer")) {
            enqueueSnackbar(
                "Vous n'avez pas accès à cette page, veuillez créer un point de vente",
                { variant: "error" }
            );
            router.replace("/commercial");
            return;
        }

        // ❌ Pas commercial
        if (!roles.includes("vendor")) {
            enqueueSnackbar("Vous n'avez pas accès à cette page", {
                variant: "error",
            });
            router.replace("/");
            return;
        }

    }, [session, status, router]);
    useEffect(() => {
        if (status === "loading") return;
        const fetchProducts = async () => {
            try {
                const res = await axiosServices.get<Phone[]>("/api/products");
                setPhones(res.data);
            } catch (err) {
                console.warn("API error:", err);
            }
        };
        console.log(session?.user.token)
        fetchProducts();
    }, []);


    const handleChoice = (phone: Phone, isLeasing: boolean, amount: number) => {
        const finalData = {
            phone: phone.name,
            amount,
            product_id: phone.id,
            is_cash: isLeasing ? 0 : 1,
            is_custom: phone.isCustom ?? false,
        };
        // ✅ Sauvegarde dans sessionStorage
        sessionStorage.setItem("selectedPhone", JSON.stringify(finalData));
        if(session?.user){
            router.push('/commercial')

        }else{
            router.push('/checkout/register-guest')
        }
    };

    const handleCustomiseSubmit = ({ name, price }: { name: string; price: string }) => {
        if (!name || !price) return;

        const customPhone: Phone = {
            name,
            prixCash: Number(price),
            isCustom: true,
            id: Date.now(), // id temporaire
        };

        handleChoice(customPhone, false, Number(price));
        setCustomModalOpen(false);
        setCustomName("");
        setCustomPrice("");
    };

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            <Header />
            <div className="bg-[#014d74] h-24"></div>

            <PhoneGrid phones={phones} baseImage={BASE_IMAGE} onChoice={handleChoice} />

            <CustomModal
                isOpen={customModalOpen}
                onClose={() => setCustomModalOpen(false)}
                onSubmit={handleCustomiseSubmit}
                name={customName}
                setName={setCustomName}
                price={customPrice}
                setPrice={setCustomPrice}
            />

            <BottomNav />
        </div>
    );
}