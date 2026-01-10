import { AlertCircleIcon, BellIcon, LogInIcon, LogOutIcon, UserCheck, UserCircleIcon,MenuIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center bg-[#014d74] text-white px-4 py-3">
      {/* Profil / User */}
      {session?.user ? (
      <Link href="/profil">
        <span className="text-xl font-semibold">
          <MenuIcon size={28} />
        </span>
      </Link>):(
      <Link href="/auth/signin">
        <span className="text-xl font-semibold">
          <UserCheck size={28} />
        </span>
      </Link>)
      }

      {/* Logo */}
        <Link href="/">
      <Image src="/logo.png" alt="Logo" width={100} height={100} />
        </Link>

      {/* Connexion / Déconnexion */}
      <div className="relative">
        {session?.user ? (
            <LogOutIcon
                size={28}
                className="cursor-pointer hover:opacity-80"
                onClick={() =>
                    signOut({
                        callbackUrl: `${window.location.origin}/auth/signin`,
                    })
                }
            />

        ) : (
          <Link href="/auth/signin">
            <LogInIcon size={28} className="cursor-pointer hover:opacity-80" />
          </Link>
        )}
      </div>
    </header>
  );
}
