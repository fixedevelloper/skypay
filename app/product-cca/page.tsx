'use client'
import React from "react";
import {CheckCircle, FileUp, UserIcon} from "lucide-react";
import {useRouter} from "next/navigation";


export default function Page() {
    const router = useRouter()

    const steps = [
        {
            icon: <UserIcon className="text-white w-4 h-4" />,
            title: "Étape 1 : Informations client",
            description:
                "Choisir votre type (Particulier, Employé, PME) et renseigner vos informations personnelles ou PME.",
        },
        {
            icon: <FileUp className="text-white w-4 h-4" />,
            title: "Étape 2 : Upload documents",
            description:
                "Joindre les documents requis : CNI recto/verso, facture, demi-carte, NIU (si PME), justificatif (si employé).",
        },
        {
            icon: <CheckCircle className="text-white w-4 h-4" />,
            title: "Étape 3 : Validation CCA BANK",
            description:
                "Après envoi, un correspondant CCA BANK vérifiera vos informations et vous contactera via WhatsApp.",
        },
    ]

    return (
        <div className="bg-white rounded-2xl p-6 shadow space-y-6 max-w-md mx-auto mt-6">
            <h1 className="text-2xl font-bold text-gray-900">Enrôlement CCA BANK</h1>
            <p className="text-gray-600 text-sm mb-4">
                Suivez les étapes ci-dessous pour compléter votre enrôlement :
            </p>

            <div className="space-y-4">
                {steps.map((step, idx) => (
                    <div
                        key={idx}
                        className="flex items-start gap-4 bg-gray-50 p-3 rounded-xl shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-600">
                            {step.icon}
                        </div>
                        <div>
                            <h2 className="text-gray-900 font-semibold">{step.title}</h2>
                            <p className="text-gray-500 text-sm mt-1">{step.description}</p>

                            {/* Aperçu des documents pour l'étape 2 */}
                            {idx === 1 && (
                                <ul className="text-gray-700 text-xs mt-2 list-disc list-inside">
                                    <li>CNI Recto / Verso</li>
                                    <li>Facture récente</li>
                                    <li>Demi carte photo</li>
                                    <li>NIU (si PME)</li>
                                    <li>Justificatif activité (si Employé)</li>
                                </ul>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => router.push("/product-cca/step-1")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
            >
                Commencer l’enrôlement
            </button>
        </div>
    )
}
