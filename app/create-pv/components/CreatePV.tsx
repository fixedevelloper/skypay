'use client'
import BottomNav from "@/app/components/BottomNav";
import FileField from "@/app/components/FileInput";
import Header from "@/app/components/Header";
import InputField from "@/app/components/InputField";
import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";
import StepWizard from "react-step-wizard";
import axiosServices from "../../lib/axios";
import mtn from "@/public/icons/momo_mtnb.png";
import orange from "@/public/icons/orange.png";
import Image from "next/image";

type FormDataType = {
    name_promote: string;
    name_salepoint: string;
    activity: string;
    phone: string;
    phonePv: string;
    localisation: string;
    phonePayment:string;
    platform:string;
    image_piece: File | null;
    image_doc_fiscal: File | null;
    image_cni_recto: File | null;
    image_cni_verso: File | null;
};

export default function CreatePVPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormDataType>({
        name_promote: "",
        name_salepoint: "",
        activity: "",
        phone: "",
        platform: "",
        phonePayment: "",
        phonePv: "",
        localisation: "",
        image_piece: null,
        image_doc_fiscal: null,
        image_cni_recto: null,
        image_cni_verso: null,
    });

    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(0);
    const wizardRef = useRef<any>(null);
    const steps = ["Informations", "Documents", "Aperçu"];
    const [platform, setPlatform] = useState<"MTN" | "ORANGE">("MTN");
    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const onNext = () => wizardRef.current?.nextStep();
    const onBack = () => wizardRef.current?.previousStep();

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const payload = new FormData();
            payload.append("platform", platform);
            Object.entries(formData).forEach(([key, value]) => {
                if (value) payload.append(key, value as any);
            });

/*            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/point-sales`, {
                method: "POST",
                body: payload,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Erreur serveur");*/
            const res = await axiosServices.post("/api/point-sales", payload);
            const data = res.data;
            if (data.referenceId) {
                localStorage.setItem("referenceId",data.referenceId)
                router.push("/create-pv/waiting-pay");
                setFormData({
                    phonePayment: "",
                    platform: "",
                    name_promote: "",
                    phone: "",
                    name_salepoint: "",
                    activity: "",
                    phonePv: "",
                    localisation: "",
                    image_piece: null,
                    image_doc_fiscal: null,
                    image_cni_recto: null,
                    image_cni_verso: null
                });
                wizardRef.current?.goToStep(1);
                setStep(0);
            } else {
                throw new Error("Aucune référence de paiement reçue.");
            }

        } catch (err: any) {
            console.error("Erreur de paiement:", err.response?.data || err.message);
            setError(err.response?.data?.error || err.message || "Erreur inattendue.");
            setStatus("FAILED");
        } finally {
            setSubmitting(false);
        }
    };

    const progressPercent = ((step + 1) / steps.length) * 100;
    const fileFields: {
        label: string;
        key: keyof Pick<
            FormDataType,
            "image_piece" | "image_doc_fiscal" | "image_cni_recto" | "image_cni_verso"
            >;
    }[] = [
        { label: "Image pièce", key: "image_piece" },
        { label: "Image doc fiscal", key: "image_doc_fiscal" },
        { label: "Image CNI recto", key: "image_cni_recto" },
        { label: "Image CNI verso", key: "image_cni_verso" },
    ];

    return (
        <div className="min-h-screen bg-gray-100 pb-20 flex flex-col">
            <Header />
            <div className="bg-[#014d74] h-24" />

            <div className="mx-auto flex justify-center -mt-10 px-4 rounded-xl w-full ">
                <div className="bg-white shadow-lg rounded-2xl p-6 w-full">
                    <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                        Création Point de Vente
                    </h2>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
                        <div
                            className="bg-[#014d74] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>

                    <StepWizard
                    
                          instance={(wizard: any) => {
                                wizardRef.current = wizard;
                            }}
                        onStepChange={(stats: any) => setStep(stats.activeStep - 1)}
                    >
                        {/* Step 1 */}

                        <div className="space-y-3">
                            <div className="text-sm text-gray-700 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <p className="font-semibold text-[#014d74] mb-2">
                                    ℹ️ Comment ça marche ?
                                </p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Remplissez les informations de votre PME</li>
                                    <li>Ajoutez les documents requis (Doc Fiscal, ID card, ...)</li>
                                    <li>Validez le récapitulatif et effectuez le paiement (<strong>15000 FCFA</strong>)</li>
                                    <li>Ensuite, vous pouvez vendre de façon sécurisée sur notre plateforme en vous connectant avec votre téléphone</li>
                                </ul>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                id="name_promote"
                                label="Nom Promoteur"
                                placeholder="Ex: Jean Dupont"
                                value={formData.name_promote}
                                onChange={(v) => handleChange("name_promote", v)}
                            />
                            <InputField
                                id="phone"
                                label="Téléphone promoteur"
                                placeholder="Ex: 690123456"
                                value={formData.phone}
                                onChange={(v) => handleChange("phone", v)}
                            />
                            <InputField
                                id="name_salepoint"
                                label="Nom point de vente"
                                placeholder="Ex: Boutique centrale"
                                value={formData.name_salepoint}
                                onChange={(v) => handleChange("name_salepoint", v)}
                            />
                            <InputField
                                id="activity"
                                label="Activité"
                                placeholder="Ex: Vente de téléphones"
                                value={formData.activity}
                                onChange={(v) => handleChange("activity", v)}
                            />
                            <InputField
                                id="localisation"
                                label="Localisation"
                                placeholder="Ex: Douala, Cameroun"
                                value={formData.localisation}
                                onChange={(v) => handleChange("localisation", v)}
                            /> 
                             <InputField
                                id="phonePv"
                                label="Téléphone"
                                placeholder="Ex: 690123456"
                                value={formData.phonePv}
                                onChange={(v) => handleChange("phonePv", v)}
                            />
                            </div>
                            <p className="font-bold  text-gray-800 text-md">Frais de création de point de vente: 15000 FCFA</p>
                        </div>

                        {/* Step 2 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {fileFields.map((field) => (
                                <FileField
                                    key={field.key}
                                    label={field.label}
                                    file={formData[field.key]}
                                    onChange={(f) => handleChange(field.key, f)}
                                />
                            ))}
                        </div>

                        {/* Step 3 */}
                        <div className="space-y-3">
                            <p className="text-lg font-medium text-gray-800 text-center mb-2">Aperçu des informations</p>

                            {/* Texte */}
                            {[
                                { label: "Nom Promoteur", value: formData.name_promote },
                                { label: "Nom point de vente", value: formData.name_salepoint },
                                { label: "Activité", value: formData.activity },
                                { label: "Numéro de téléphone", value: formData.phone },
                                { label: "Localisation", value: formData.localisation },
                            ].map((field) => (
                                <div key={field.label} className="flex justify-between border-b border-gray-200 py-1">
                                    <span className="font-medium text-gray-700">{field.label}:</span>
                                    <span className="text-gray-800">{field.value || "-"}</span>
                                </div>
                            ))}
                            {/* Choix de la plateforme */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {[
                                    { name: "MTN", img: mtn },
                                    { name: "ORANGE", img: orange },
                                ].map(({ name, img }) => (
                                    <button
                                        key={name}
                                        onClick={() => setPlatform(name as "MTN" | "ORANGE")}
                                        className={`flex flex-col items-center justify-center rounded-xl border-2 bg-white p-3 transition-all ${
                                            platform === name
                                                ? "border-[#014d74] shadow-lg scale-105"
                                                : "border-gray-300 hover:border-[#014d74]/50"
                                        }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${name} Money`}
                                            width={70}
                                            height={70}
                                            className="object-contain"
                                        />
                                        <span
                                            className={`mt-2 text-sm font-semibold ${
                                                platform === name ? "text-[#014d74]" : "text-gray-600"
                                            }`}
                                        >
                  {name} Money
                </span>
                                    </button>
                                ))}
                            </div>
                            {/* Téléphone */}
                            <div className="mb-5">
                                <InputField
                                    id="phonePayment"
                                    label="Numéro de paiement :"
                                    value={formData.phonePayment}
                                    onChange={(v) => handleChange("phonePayment", v)}
                                    placeholder="Ex: 6XXXXXXXX"
                                />

                            </div>
                            {/* Images en grille 2 colonnes */}
                            <div className="mb-3">
                                  <div className="grid grid-cols-2 gap-4 mt-2">
                                {[
                                    { label: "Image pièce", file: formData.image_piece },
                                    { label: "Image doc fiscal", file: formData.image_doc_fiscal },
                                    { label: "Image CNI recto", file: formData.image_cni_recto },
                                    { label: "Image CNI verso", file: formData.image_cni_verso },
                                ].map((img) =>
                                    img.file ? (
                                        <div key={img.label} className="flex flex-col items-center">
                                            <span className="font-medium text-gray-700 mb-1 text-sm">{img.label}</span>
                                            <img
                                                src={URL.createObjectURL(img.file)}
                                                alt={img.label}
                                                className="w-full object-cover rounded border border-gray-300"
                                            />
                                        </div>
                                    ) : null
                                )}
                            </div>
                            </div>
                          
                        </div>

                    </StepWizard>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-4">
                        {step > 0 && (
                            <button
                                onClick={onBack}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                                Retour
                            </button>
                        )}

                        {step < steps.length - 1 ? (
                            <button
                                onClick={onNext}
                                className="px-4 py-2 rounded-lg bg-[#014d74] text-white hover:bg-[#013d5a]"
                            >
                                Suivant
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className={`px-4 py-2 rounded-lg text-white ${submitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#014d74] hover:bg-[#013d5a]"
                                    }`}
                            >
                                {submitting ? "Enregistrement..." : "Enregistrer"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
