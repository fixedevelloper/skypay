'use client'

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; price: string }) => void;
  name: string;
  setName: (name: string) => void;
  price: string;
  setPrice: (price: string) => void;
}

export default function CustomModal({
  isOpen,
  onClose,
  onSubmit,
  name,
  setName,
  price,
  setPrice
}: CustomModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-50"
          leave="ease-in duration-200"
          leaveFrom="opacity-50"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-zinc-700" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                 Équipement personnalisé
                </Dialog.Title>

                <input
                  type="text"
                  placeholder="Nom de l'équipement"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border p-2 rounded mb-3 text-gray-800"
                />

                <input
                  type="number"
                  placeholder="Montant à payer (FCFA)"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full border p-2 rounded mb-3 text-gray-800"
                />

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => onSubmit({ name, price })}
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Ajouter
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
