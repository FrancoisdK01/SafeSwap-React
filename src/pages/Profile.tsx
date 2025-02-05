import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageToggle from '../components/LanguageToggle';
import VerificationSection from '../components/profile/VerificationSection';
import LogoutButton from '../components/profile/LogoutButton';
import UserAvatar from '../components/UserAvatar';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function Profile() {
  const { t } = useLanguage();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 bg-white">
        <div className="p-4 text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 bg-white">
        <div className="p-4 text-center text-gray-500">Please sign in to view your profile</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white">
      <header className="pt-6 px-4 pb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{t('profile.title')}</h1>
          <LanguageToggle />
        </div>
        <div className="flex justify-end">
          <LogoutButton />
        </div>
      </header>

      <main className="p-4 space-y-8">
        <div className="flex justify-center">
          <UserAvatar size="large" />
        </div>

        <VerificationSection />

        <div>
          <h2 className="font-medium mb-2">{t('profile.address')}</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="301 Brain Eil.."
              className="w-full p-3 pr-10 border border-gray-200 rounded-lg"
            />
            <FaMapMarkerAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <p className="mt-2 text-sm text-gray-500">{t('profile.pudo')}</p>
        </div>
      </main>
    </div>
  );
}