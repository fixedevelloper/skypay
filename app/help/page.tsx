'use client'
import BottomNav from "@/app/components/BottomNav";
import Header from "@/app/components/Header";


export default function Helps() {
  return (
      <div className="min-h-screen bg-gray-100 pb-20">
        <Header />
        <div className="bg-[#014d74] h-24"></div>
 <h2 className="mt-4 text-center text-3xl font-bold text-gray-800">
            Aide & Support
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Retrouvez ici toutes nos informations et contacts utiles.
          </p>

          <div className="mt-8 rounded-2xl bg-white p-6 shadow-md overflow-hidden">
            {/* Informations entreprise */}
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-sky-600">
                Informations de l'entreprise
              </h3>
              <ul className="mt-2 text-gray-700 text-sm space-y-1">
                <li>Nom : DSC Group</li>
                <li>Adresse : Bonamoussadi, Douala</li>
                <li>Email : contact.info@dsc-group.org</li>
                <li>
                  Site :{" "}
                  <a
                      href="https://dsc-group.org"
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                  >
                    dsc-group.org
                  </a>
                </li>
              </ul>
            </section>

            {/* Service client */}
            <section className="mb-6 border-t border-gray-100 pt-4">
              <h3 className="text-lg font-semibold text-green-600">
                Service client
              </h3>
              <ul className="mt-2 text-gray-700 text-sm space-y-1">
                <li>Téléphone : +237 6 83 80 67 82</li>
                <li>Horaires : Lun - Ven, 08:00 - 18:00</li>
              </ul>
            </section>

            {/* Support technique */}
            <section className="mb-6 border-t border-gray-100 pt-4">
              <h3 className="text-lg font-semibold text-red-600">
                Support technique
              </h3>
              <ul className="mt-2 text-gray-700 text-sm space-y-1">
                <li>Email : tech.skypay@dsc-group.org</li>
                <li>
                  Pour signaler un bug, envoyez une capture d’écran et une
                  description du problème.
                </li>
              </ul>
            </section>

            {/* FAQ */}
            <section className="border-t border-gray-100 pt-4">
              <h3 className="text-lg font-semibold text-yellow-600">
                FAQ rapide
              </h3>
              <ul className="mt-2 list-disc pl-5 text-gray-700 text-sm space-y-1">
                <li>
                  <span className="font-medium">Créer un point de vente :</span>{" "}
                  Remplissez le formulaire puis ajoutez les images demandées.
                </li>
                <li>
                  <span className="font-medium">Payer les frais :</span>{" "}
                  Le paiement se fait via Mobile Money (MTN ou Orange).
                </li>
              </ul>
            </section>
          </div>
       
        <BottomNav />
      </div>
  );
}
