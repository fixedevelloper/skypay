'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axiosServices from "../../lib/axios";
import {enqueueSnackbar} from "notistack";



export default function Step2() {
    const router = useRouter()
    const [step1Data, setStep1Data] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    // Chaque fichier a son propre state
    const [cniRecto, setCniRecto] = useState<File | null>(null)
    const [cniVerso, setCniVerso] = useState<File | null>(null)
    const [niuImage, setNiuImage] = useState<File | null>(null)
    const [facture, setFacture] = useState<File | null>(null)
    const [demiCarte, setDemiCarte] = useState<File | null>(null)
    const [justificatif, setJustificatif] = useState<File | null>(null)

    const whatsappNumber = '237683806782'

    // 🔹 Récupérer Step1 depuis session
    useEffect(() => {
        const stored = sessionStorage.getItem('cca_step1')
        if (!stored) return router.push('/product-cca/step-1')
        setStep1Data(JSON.parse(stored))
    }, [router])

    // 🔹 Générer le lien WhatsApp
    const generateWhatsappLink = () => {
        if (!step1Data) return '#'

        let message = `Bonjour CCA 👋\n\nJe souhaite m'enrôler :\n\n`
        message += `Type : ${step1Data.type}\n`
        message += `Nom / PME : ${step1Data.name}\n`
        message += `Nombre de comptes : ${step1Data.accounts}\n`
        if (step1Data.niu) message += `NIU : ${step1Data.niu}\n`
        message += `Position : ${step1Data.position}\n`
        message += `\nDocuments joints ci-dessous.`

        return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    }

    // 🔹 Prévisualisation
/*    const renderPreview = (file: File | null) => {
        if (!file) return null
        if (file.type.startsWith('image/')) {
            return <img src={URL.createObjectURL(file)} className="w-24 h-24 object-cover rounded-md" alt="Preview" />
        }
        return <p className="text-xs text-gray-500 truncate">{file.name}</p>
    }*/

    // 🔹 Envoi final
    const submit = async () => {
        if (!cniRecto || !cniVerso || !facture || !demiCarte || !step1Data) {
            enqueueSnackbar('Veuillez joindre tous les documents requis.', { variant: "error" });
            return
        }

        setLoading(true)
        const formData = new FormData()
        formData.append('step1', JSON.stringify(step1Data))
        formData.append('cni_recto', cniRecto)
        formData.append('cni_verso', cniVerso)
        if (niuImage) formData.append('niu_image', niuImage)
        formData.append('facture', facture)
        formData.append('demi_carte', demiCarte)
        if (justificatif) formData.append('justificatif', justificatif)

        try {
            const { data } = await axiosServices.post("/api/cca/submit", formData)
            enqueueSnackbar('Redirection encours ....', { variant: "success" });
            // Redirection vers WhatsApp
            const link = data.whatsapp_link || generateWhatsappLink()
            window.open(link, "_blank")

        } catch (err) {
            console.error(err)
            enqueueSnackbar('Erreur lors de l’envoi. Veuillez réessayer.', { variant: "error" });
        } finally {
            setLoading(false)
        }
    }

    if (!step1Data) return null

    return (
        <div className="bg-white p-6 rounded-2xl shadow space-y-6 max-w-xl mx-auto mt-6">
            <h2 className="font-semibold text-xl text-gray-900">Étape 2 : Documents requis</h2>
            <p className="text-sm text-gray-500">Veuillez uploader vos documents pour compléter l’enrôlement.</p>

            {/* Aperçu Step1 */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-1 text-sm text-gray-800">
                <p><strong>Type :</strong> {step1Data.type}</p>
                <p><strong>Nom / PME :</strong> {step1Data.name}</p>
                <p><strong>Comptes :</strong> {step1Data.accounts}</p>
                {step1Data.niu && <p><strong>NIU :</strong> {step1Data.niu}</p>}
                <p><strong>Position :</strong> {step1Data.position}</p>
            </div>

            {/* Inputs fichiers */}
            <div className="flex flex-col gap-4">
                <FileInput label="CNI Recto" file={cniRecto} setFile={setCniRecto} />


                <FileInput label="CNI Verso" file={cniVerso} setFile={setCniVerso} />


                {step1Data.type === 'pme' && <>
                    <FileInput label="Image NIU" file={niuImage} setFile={setNiuImage} />
                </>}

                <FileInput label="Facture" file={facture} setFile={setFacture} />

                <FileInput label="Demi carte photo" file={demiCarte} setFile={setDemiCarte} />

                {step1Data.type === 'employe' && <>
                    <FileInput label="Justificatif activité" file={justificatif} setFile={setJustificatif} />
                </>}
            </div>

            <button
                onClick={submit}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl disabled:opacity-50 transition"
            >
                {loading ? 'Envoi en cours...' : 'Envoyer & WhatsApp'}
            </button>
        </div>
    )
}



function FileInput({
                       label,
                       file,
                       setFile,
                   }: {
    label: string
    file: File | null
    setFile: (f: File | null) => void
}) {
    const [preview, setPreview] = useState<string | null>(null)

    // Générer un aperçu si c'est une image
    useEffect(() => {
        if (!file) {
            setPreview(null)
            return
        }

        if (file.type.startsWith('image/')) {
            const objectUrl = URL.createObjectURL(file)
            setPreview(objectUrl)

            return () => URL.revokeObjectURL(objectUrl) // cleanup
        } else {
            setPreview(null)
        }
    }, [file])

    return (
        <div className="flex flex-col gap-2">
            <label className="label-fintech text-gray-800">{label}</label>
            <input
                type="file"
                accept="image/*,.pdf"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none"
            />

            {file && (
                <div className="flex items-center gap-2 mt-1">
                    {preview ? (
                        <img
                            src={preview}
                            alt="preview"
                            className="w-16 h-16 object-cover rounded-lg border"
                        />
                    ) : (
                        <p className="text-xs text-gray-500 truncate">{file.name}</p>
                    )}

                    <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="text-red-500 text-sm hover:underline"
                    >
                        Supprimer
                    </button>
                </div>
            )}
        </div>
    )
}
