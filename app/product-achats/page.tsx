'use client'
import BottomNav from "@/app/components/BottomNav";
import Header from "@/app/components/Header";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {Phone} from "../types/types";
import {useSession} from "next-auth/react";
import axiosServices from "../lib/axios";
import PhoneGrid from "../components/PhoneGrid";


export default function page() {
    const router = useRouter();
    const [phones, setPhones] = useState<Phone[]>([]);
    const BASE_IMAGE = process.env.NEXT_PUBLIC_API_URL;

    const { data: session } = useSession();
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axiosServices.get<Phone[]>("/api/products?code=customer");
                setPhones(res.data);
            } catch (err) {
                console.warn("API error:", err);
            }
        };
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
            router.push('/checkout')

    };
    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            <Header />
            <div className="bg-[#014d74] h-24"></div>
            <PhoneGrid phones={phones} baseImage={BASE_IMAGE} onChoice={handleChoice} />
            <BottomNav />
        </div>
    );
}
