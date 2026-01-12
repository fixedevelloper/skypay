'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Step1() {
    const router = useRouter()

    const [form, setForm] = useState({
        type: 'particulier',
        name: '',
        accounts: 1,
        niu: '',
        position: '',
    })

    const [loading, setLoading] = useState(false)

    const isPME = form.type === 'pme'
    const isValid =
        form.name.trim() !== '' &&
        form.accounts > 0 &&
        (!isPME || form.niu.trim() !== '') &&
        form.position.trim() !== ''

    const submit = async () => {
        if (!isValid) return

        setLoading(true)

        // 1️⃣ Sauvegarde en session
        sessionStorage.setItem(
            'cca_step1',
            JSON.stringify(form)
        )

        // 3️⃣ Redirection
        router.push(`/product-cca/step-2`)
    }


    return (
        <div className="bg-white p-6 rounded-2xl shadow space-y-6">
            {/* HEADER */}
            <div className="space-y-1">
                <h2 className="font-semibold text-xl text-gray-900">
                    Informations client
                </h2>
                <p className="text-sm text-gray-500">
                    Merci de renseigner correctement les informations
                </p>
            </div>

            {/* TYPE */}
            <div className="flex flex-col gap-1">
                <label className="label-fintech text-gray-800">Type de client</label>
                <select
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none  text-gray-800"
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                >
                    <option value="particulier">Particulier</option>
                    <option value="employe">Employé</option>
                    <option value="pme">PME</option>
                </select>
            </div>

            {/* NOM */}
            <div className="flex flex-col gap-1">
                <label className="label-fintech text-gray-800">
                    {isPME ? 'Nom de la PME' : 'Nom complet'}
                </label>
                <input
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none  text-gray-800"
                    placeholder={isPME ? 'Nom de l’entreprise' : 'Nom et prénom'}
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                />
            </div>

            {/* COMPTES */}
            <div className="flex flex-col gap-1">
                <label className="label-fintech text-gray-800">Nombre de comptes</label>
                <input
                    type="number"
                    min={1}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none  text-gray-800"
                    value={form.accounts}
                    onChange={e =>
                        setForm({ ...form, accounts: +e.target.value })
                    }
                />
            </div>

            {/* NIU */}
            {isPME && (
                <div className="flex flex-col gap-1">
                    <label className="label-fintech">Numéro NIU</label>
                    <input
                        className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none  text-gray-800"
                        placeholder="Ex : M0123456789"
                        value={form.niu}
                        onChange={e =>
                            setForm({ ...form, niu: e.target.value })
                        }
                    />
                </div>
            )}

            {/* POSITION */}
            <div className="flex flex-col gap-1">
                <label className="label-fintech text-gray-800">Position actuelle</label>
                <input
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none  text-gray-800"
                    placeholder="Ville / Quartier"
                    value={form.position}
                    onChange={e =>
                        setForm({ ...form, position: e.target.value })
                    }
                />
            </div>

            {/* ACTION */}
            <button
                onClick={submit}
                disabled={!isValid || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl disabled:opacity-50 transition"
            >
                {loading ? 'Enregistrement...' : 'Continuer'}
            </button>
        </div>

    )
}

