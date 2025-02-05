import React from 'react';
import AccountInfo from '../components/AccountInfo';
import ActionButtons from '../components/ActionButtons';
import Header from '../components/Header';
import ConnectionToast from '../components/common/ConnectionToast';

export default function Home() {
  return (
    <div className="flex-1">
      <Header title="SafeHome" showProfile={true} />
      <main className="p-4 space-y-6">
        <ConnectionToast />
        <AccountInfo />
        <ActionButtons />
      </main>
    </div>
  );
}