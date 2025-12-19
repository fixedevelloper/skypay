'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Header from '@/app/components/Header';
import BottomNav from '@/app/components/BottomNav';
import { useRouter } from 'next/navigation';
import { Button } from '@headlessui/react';
import Link from 'next/link';


export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Appel à NextAuth (si configuré)
      const res = await signIn('credentials', {
        redirect: false,
        phone:username,
        password,
      });

      if (res?.error) {
        setError('Identifiants incorrects');
      } else {
        router.push('/'); // Redirection après connexion
      }
    } catch (err) {
      console.error(err);
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Si déjà connecté
  if (session) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20 flex flex-col">
      <Header />

      <div className="bg-[#014d74] h-24" />

      <div className="flex justify-center -mt-10 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-sm">
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
            Connexion
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Numéro de téléphone"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none  text-gray-800"
            />

            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none  text-gray-800"
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white font-medium transition ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#014d74] hover:bg-[#013d5a]'
              }`}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
            <div className="text-center text-sm text-gray-700 mt-4">
    <span className='text-[#014d74] hover:text-[#013d5a]'>Vous n’avez pas encore de compte ?{" "}</span>  
      <Link
        href="/auth/register"
        className="text-[#014d74] font-semibold hover:underline hover:text-[#013d5a] transition-colors"
      >
        S’inscrire
      </Link>
    </div>
          </form>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
