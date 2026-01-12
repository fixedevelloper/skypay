// app/product-cca/layout.tsx
import BottomNav from "../components/BottomNav";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-[#014d74] h-24" />
            <div className="max-w-xl mx-auto -mt-12 p-4">
                {children}
            </div>
            <BottomNav />
        </div>
    )
}
