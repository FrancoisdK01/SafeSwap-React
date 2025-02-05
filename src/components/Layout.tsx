import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

export default function Layout() {
  return (
    <div className="min-h-screen min-w-screen bg-gray-50 flex flex-col">
      <div className="flex-1 w-full mx-auto max-w-2xl bg-gray-50 flex flex-col">
        <div className="flex-1 pb-24">
          <Outlet />
        </div>
        <Navigation />
      </div>
    </div>
  );
}