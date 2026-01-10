"use client";

import { Tab } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const items = [
    { title: "Achat", icon: "/icons/shopping-cart.svg", href: "/product-achats", tab: "forYou" },
    { title: "Commercial", icon: "/icons/sale-tag.svg", href: "/product-commercial", tab: "forYou" },
    { title: "Vente PV", icon: "/icons/exchange.svg", href: "/product-pv", tab: "vendors" },
    { title: "Distributeur", icon: "/icons/arrow.svg", href: "/product-distribution", tab: "vendors" },
    { title: "Vente PMEs", icon: "/icons/build-busines.svg", href: "/create-pmes", tab: "vendors" },
    { title: "Mon profil", icon: "/icons/user-list.svg", href: "/profil", tab: "forYou" },
    { title: "Mon commercial", icon: "/icons/cca.jpeg", href: "/product-cca", tab: "forYou" },
];

export default function HomeGrid() {
    const forYou = items.filter(i => i.tab === "forYou");
    const vendors = items.filter(i => i.tab === "vendors");

    return (
        <Tab.Group>
            {/* TABS HEADER */}
            <Tab.List className="flex bg-gray-100 rounded-xl p-1 mb-4">
                {["Pour vous", "Vendeurs"].map((tab) => (
                    <Tab
                        key={tab}
                        className={({ selected }) =>
                            `flex-1 py-2 text-sm font-semibold rounded-lg transition 
                            ${selected ? "bg-white shadow text-blue-600" : "text-gray-500"}`
                        }
                    >
                        {tab}
                    </Tab>
                ))}
            </Tab.List>

            {/* PANELS */}
            <Tab.Panels>
                <Tab.Panel>
                    <Grid items={forYou} />
                </Tab.Panel>

                <Tab.Panel>
                    <Grid items={vendors} />
                </Tab.Panel>
            </Tab.Panels>
        </Tab.Group>
    );
}

function Grid({ items:any }: { items: typeof items }) {
    return (
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-4 px-2">
            {items.map((item, index) => (
                <Link key={index} href={item.href}>
                    <div className="bg-white rounded-2xl shadow-md p-2 hover:shadow-xl hover:-translate-y-1 transition">
                        <div className="flex items-center justify-center h-20 bg-gray-100 rounded-xl">
                            <Image src={item.icon} alt={item.title} width={48} height={48} />
                        </div>
                        <h3 className="mt-3 text-sm font-semibold text-center truncate text-gray-800">
                            {item.title}
                        </h3>
                    </div>
                </Link>
            ))}
        </div>
    );
}
