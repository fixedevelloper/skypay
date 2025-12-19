
interface Service {
    name: string;
    icon: string;
}

export default function ServiceGrid() {
    const services: Service[] = [
        { name: "Envoyer de l'argent", icon: "✈️" },
        { name: "Crédit", icon: "📞" },
        { name: "Services Publics", icon: "💡" },
        { name: "TV", icon: "📺" },
        { name: "Services Bancaires", icon: "🏦" },
    ];

    return (
        <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-2xl mx-4 mt-4 shadow">
            {services.map((s, i) => (
                <div
                    key={i}
                    className="flex flex-col items-center text-center text-[#014d74]"
                >
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <p className="text-sm">{s.name}</p>
                </div>
            ))}
        </div>
    );
}
