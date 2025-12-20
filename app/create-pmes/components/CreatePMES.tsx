'use client'
import BottomNav from "@/app/components/BottomNav";
import FileField from "@/app/components/FileInput";
import Header from "@/app/components/Header";
import InputField from "@/app/components/InputField";
import {useRouter} from "next/navigation";
import React, {useState, useRef} from "react";
import StepWizard from "react-step-wizard";
import mtn from "@/public/icons/momo_mtnb.png";
import orange from "@/public/icons/orange.png";
import Image from "next/image";
import axiosServices from "../../lib/axios";

type FormDataType = {
    name_entreprise: string;
    name_responsable: string;
    poste_responsable: string;

    amount_bc: number;
    number_souscripteur: number;
    number_echeance_paiement: number;

    name_gestionnaire: string;
    name_manager: string;
    platform:string,
    phone:string,
    image_bc: File | null;
    image_bl: File | null;
    image_facture: File | null;
};


export default function CreatePMESPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormDataType>({
        amount_bc: 0,
        image_bc: null,
        image_bl: null,
        image_facture: null,
        name_entreprise: "",
        name_gestionnaire: "",
        name_manager: "",
        platform: "",
        phone: "",
        name_responsable: "",
        number_echeance_paiement: 0,
        number_souscripteur: 0,
        poste_responsable: ""

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
        setFormData(prev => ({...prev, [field]: value}));
    };

    const onNext = () => wizardRef.current?.nextStep();
    const onBack = () => wizardRef.current?.previousStep();

    const handleSubmit = async () => {
        setSubmitting(true);
        setError(null);
        setStatus("PENDING");
        try {
            const payload = new FormData();
            payload.append("platform", platform);
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== "") {
                    payload.append(key, value as any);
                }

                //  if (value) payload.append(key, value as any);
            });

/*            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pmes`, {
                method: "POST",
                body: payload,
            });*/
            const res = await axiosServices.post("/api/pmes", payload);
          //  const data = await res.json();
            const data = res.data;
            if (data.referenceId) {
                alert("PV enregistré avec succès !");
                localStorage.setItem("referenceId", data.referenceId)
                router.push("/create-pmes/waiting-pay");
                setFormData({
                    phone: "", platform: "",
                    amount_bc: 0,
                    image_bc: null,
                    image_bl: null,
                    image_facture: null,
                    name_entreprise: "",
                    name_gestionnaire: "",
                    name_manager: "",
                    name_responsable: "",
                    number_echeance_paiement: 0,
                    number_souscripteur: 0,
                    poste_responsable: ""
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
        key: keyof Pick<FormDataType,
            "image_bc" | "image_bl" | "image_facture">;
    }[] = [
        {label: "Image BC", key: "image_bc"},
        {label: "Image BL", key: "image_bl"},
        {label: "Image Facture", key: "image_facture"},
    ];
    const FRAIS_PAR_SOUSCRIPTEUR = 2000;

    const montantTotal =
        formData.number_souscripteur * FRAIS_PAR_SOUSCRIPTEUR;
    const formatMoney = (amount: number) =>
        amount.toLocaleString("fr-FR") + " FCFA";

    return (
        <div className="min-h-screen bg-gray-100 pb-20 flex flex-col">
            <Header/>
            <div className="bg-[#014d74] h-24"/>

            <div className="max-w-md mx-auto flex justify-center -mt-10 px-4 rounded-xl w-full">
                <div className="bg-white shadow-lg rounded-2xl p-6 w-full">
                    <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                        Création PMEs
                    </h2>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
                        <div
                            className="bg-[#014d74] h-2 rounded-full transition-all duration-300"
                            style={{width: `${progressPercent}%`}}
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
                                    <li>Ajoutez les documents requis (BC, BL, Facture)</li>
                                    <li>Validez le récapitulatif et effectuez le paiement (<strong>2000 FCFA / souscripteur</strong>)</li>
                                    <li>Ensuite, vous pouvez vendre de façon sécurisée sur notre plateforme en vous connectant avec votre téléphone</li>
                                </ul>
                            </div>
                            <InputField
                                id='name_entreprise'
                                label="Nom de l'entreprise"
                                value={formData.name_entreprise}
                                onChange={(v) => handleChange("name_entreprise", v)}
                            />

                            <InputField
                                id='name_responsable'
                                label="Nom du responsable"
                                value={formData.name_responsable}
                                onChange={(v) => handleChange("name_responsable", v)}
                            />

                            <InputField
                                id='poste_responsable'
                                label="Poste du responsable"
                                value={formData.poste_responsable}
                                onChange={(v) => handleChange("poste_responsable", v)}
                            />

                            <InputField
                                id='amount_bc'
                                label="Montant BC"
                                value={formData.amount_bc.toString()}
                                onChange={(v) => handleChange("amount_bc", Number(v))}
                            />

                            <InputField
                                id='number_souscripteur'
                                label="Nombre de souscripteurs"
                                value={formData.number_souscripteur.toString()}
                                onChange={(v) => handleChange("number_souscripteur", Number(v))}
                            />

                            <InputField
                                id='name_gestionnaire'
                                label="Gestionnaire"
                                value={formData.name_gestionnaire}
                                onChange={(v) => handleChange("name_gestionnaire", v)}
                            />

                            <InputField
                                id='name_manager'
                                label="Manager"
                                value={formData.name_manager}
                                onChange={(v) => handleChange("name_manager", v)}
                            />

                            <InputField
                                id='number_echeance_paiement'
                                label="Nombre d’échéances"
                                value={formData.number_echeance_paiement.toString()}
                                onChange={(v) => handleChange("number_echeance_paiement", Number(v))}
                            />

                            <p className="font-bold  text-gray-800 text-md">Frais 2000 FCFA / souscripteurs</p>
                        </div>

                        {/* Step 2 */}
                        <div className="space-y-3">
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
                            <p className="text-lg font-medium text-gray-800 text-center mb-2">Aperçu des
                                informations</p>

                            {/* Texte */}
                            {[
                                {label: "Entreprise", value: formData.name_entreprise},
                                {label: "Responsable", value: formData.name_responsable},
                                {label: "Poste", value: formData.poste_responsable},
                                {label: "Montant BC", value: formData.amount_bc},
                                {label: "Manager", value: formData.name_manager},
                                {label: "Gestionnaire DSC", value: formData.name_gestionnaire},
                                {label: "Souscripteurs", value: formData.number_souscripteur},
                                {label: "Échéances", value: formData.number_echeance_paiement},
                            ].map((field) => (
                                <div key={field.label} className="flex justify-between border-b border-gray-200 py-1">
                                    <span className="font-medium text-gray-700">{field.label}:</span>
                                    <span className="text-gray-800">{field.value || "-"}</span>
                                </div>
                            ))}
                            <div className="border-b pt-3 mt-3 pb-2 space-y-2 mb-4">
                                <div className="flex justify-between">
    <span className="font-medium text-gray-700">
      Frais par souscripteur
    </span>
                                    <span className="text-gray-800">
      {formatMoney(2000)}
    </span>
                                </div>

                                <div className="flex justify-between">
    <span className="font-medium text-gray-700">
      Nombre de souscripteurs
    </span>
                                    <span className="text-gray-800">
      {formData.number_souscripteur}
    </span>
                                </div>

                                <div className="flex justify-between text-lg font-bold text-[#014d74]">
                                    <span>Montant total à payer</span>
                                    <span>{formatMoney(montantTotal)}</span>
                                </div>
                            </div>
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
                                    id="phone"
                                    label="Numéro de paiement :"
                                    value={formData.phone}
                                    onChange={(v) => handleChange("phone", v)}
                                    placeholder="Ex: 6XXXXXXXX"
                                />

                            </div>
                            {/* Images en grille 2 colonnes */}
                            <div className="mb-3">
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    {[
                                        {label: "Image pièce", file: formData.image_bc},
                                        {label: "Image doc fiscal", file: formData.image_bl},
                                        {label: "Image CNI recto", file: formData.image_facture},
                                    ].map((img) =>
                                        img.file ? (
                                            <div key={img.label} className="flex flex-col items-center">
                                                <span
                                                    className="font-medium text-gray-700 mb-1 text-sm">{img.label}</span>
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

            <BottomNav/>
        </div>
    );
}
