'use client'
import BottomNav from "@/app/components/BottomNav";
import Header from "@/app/components/Header";
import {useState} from "react";
import {useSnackbar} from "notistack";
import axiosServices from "../../lib/axios";


export default function ChangePassword() {
    const [current_password, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { enqueueSnackbar } = useSnackbar();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset error
        setError("");

        // 🔒 Validation frontend
        if (!newPassword || !current_password) {
            setError("Veuillez remplir tous les champs.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }


        try {
            setLoading(true);

            await axiosServices.post("/api/change-password", {
                newPassword,
                current_password,
            });

            // ✅ Succès
            enqueueSnackbar("Mot de passe modifié avec succès.", {
                variant: "success",
            });

            // Optionnel : reset formulaire
            setNewPassword("");
            setCurrentPassword("");

            // Optionnel : redirection
            // router.push("/home");

        } catch (err: any) {
            console.warn("Change password error:", err);

            const message =
                err?.response?.data?.message ||
                "Une erreur est survenue. Veuillez réessayer.";

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
                      Changer votre mot de passe
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                      <input
                          type="password"
                          placeholder="Mot de passe"
                          value={current_password}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none text-gray-800"
                      />

                      <input
                          type="password"
                          placeholder="Nouveau mot de passe"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
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
                          {loading ? "Traitement..." : "Changer le mot de passe"}
                      </button>
                  </form>
              </div>
          </div>

          <BottomNav />
      </div>
  );
}
