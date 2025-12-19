'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import BottomNav from "@/app/components/BottomNav";
import { signIn } from "next-auth/react";

export default function Register() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erreur lors de l'inscription");
        setLoading(false);
        return;
      }
// 2️⃣ Connexion automatique via NextAuth credentials
    const result = await signIn("credentials", {
      redirect: false, // On gère la redirection nous-mêmes
      phone,
      password,
    });

    if (result?.error) {
      setError(result.error || "Erreur lors de la connexion automatique");
      setLoading(false);
      return;
    }

    // 3️⃣ Redirection après succès
    router.push("/"); // Ou la page principale après login
    } catch (err: any) {
      console.error(err);
      setError("Impossible de se connecter au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20 flex flex-col">
      <Header />

      <div className="bg-[#014d74] h-24" />

      <div className="max-w-md mx-auto flex justify-center -mt-10 px-4 rounded-xl">
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-sm">
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
           Créer un compte
          </h2>
    
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none  text-gray-800"
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
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none text-gray-800"
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-medium transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#014d74] hover:bg-[#013d5a]"
            }`}
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
         <span className='text-[#014d74] hover:text-[#013d5a]'>Vous avez déjà un compte ?{" "}</span>  
          <a href="/auth/singin" className="text-[#014d74] font-medium hover:underline">
            Se connecter
          </a>
        </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
