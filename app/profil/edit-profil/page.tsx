'use client'
import BottomNav from "@/app/components/BottomNav";
import Header from "@/app/components/Header";
import {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import axiosServices from "../../lib/axios";
import {useSession} from "next-auth/react";



export default function EditProfil() {
    const { data: session } = useSession();

    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { enqueueSnackbar } = useSnackbar();
    // 🔄 Hydratation depuis la session
    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || "");
            setPhone(session.user.phone || "");
            setEmail(session.user.email || "");
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!name && !phone && !email && !password) {
            setError("Veuillez modifier au moins un champ.");
            return;
        }

        if (password && password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        try {
            setLoading(true);

            const payload: any = {};

            if (name !== session?.user?.name) payload.name = name;
            if (phone !== session?.user?.phone) payload.phone = phone;
            if (email !== session?.user?.email) payload.email = email;
            if (password) payload.password = password;

            await axiosServices.put("/api/profile", payload);

            enqueueSnackbar("Profil mis à jour avec succès.", {
                variant: "success",
            });

            setPassword("");

        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Impossible de mettre à jour le profil.";

            setError(message);

            enqueueSnackbar(message, {
                variant: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            <Header />
            <div className="bg-[#014d74] h-24"></div>

            <div className="mx-auto flex justify-center -mt-10 px-4 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
                <div className="bg-white shadow-lg rounded-2xl p-6 w-full">
                    <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                        Modifier vos informations
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Nom"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none text-gray-800"
                        />

                        <input
                            type="text"
                            placeholder="Numéro de téléphone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none text-gray-800"
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none text-gray-800"
                        />

                        <input
                            type="password"
                            placeholder="Nouveau mot de passe (optionnel)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none text-gray-800"
                        />

                        {error && (
                            <p className="text-red-500 text-sm text-center">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 rounded-lg text-white font-medium transition ${
                                loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-[#014d74] hover:bg-[#013d5a]"
                            }`}
                        >
                            {loading ? "Enregistrement..." : "Enregistrer"}
                        </button>
                    </form>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}

