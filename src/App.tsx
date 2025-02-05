import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { TransactionProvider } from './contexts/TransactionContext';
import { SearchHistoryProvider } from './contexts/SearchHistoryContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Transactions from './pages/Transactions';
import TransactionDetails from './pages/TransactionDetails';
import CreateTransaction from './pages/CreateTransaction';
import Search from './pages/Search';
import Tasks from './pages/Tasks';
import Returns from './pages/Returns';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <TransactionProvider>
          <SearchHistoryProvider>
            <Router>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={
                  <PrivateRoute>
                    <Layout />
                  </PrivateRoute>
                }>
                  <Route index element={<Home />} />
                  <Route path="transactions" element={<Transactions />} />
                  <Route path="transactions/create" element={<CreateTransaction />} />
                  <Route path="transactions/:safeCode" element={<TransactionDetails />} />
                  <Route path="search" element={<Search />} />
                  <Route path="tasks" element={<Tasks />} />
                  <Route path="returns" element={<Returns />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
              </Routes>
            </Router>
          </SearchHistoryProvider>
        </TransactionProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}