import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { TransactionProvider } from './contexts/TransactionContext';
import { SearchHistoryProvider } from './contexts/SearchHistoryContext';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// ✅ Lazy load the pages
const Home = lazy(() => import('./pages/Home'));
const Transactions = lazy(() => import('./pages/Transactions'));
const TransactionDetails = lazy(() => import('./pages/TransactionDetails'));
const CreateTransaction = lazy(() => import('./pages/CreateTransaction'));
const Search = lazy(() => import('./pages/Search'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Returns = lazy(() => import('./pages/Returns'));
const Profile = lazy(() => import('./pages/Profile'));
const Auth = lazy(() => import('./pages/Auth'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PaymentCancel = lazy(() => import('./pages/PaymentCancel'));


// ✅ Loading fallback component
const Loading = () => <div>Loading...</div>;

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <TransactionProvider>
          <SearchHistoryProvider>
            <Router>
              {/* ✅ Suspense wraps all lazy-loaded routes */}
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <Layout />
                      </PrivateRoute>
                    }
                  >
                    <Route index element={<Home />} />
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="transactions/create" element={<CreateTransaction />} />
                    <Route path="transactions/:safeCode" element={<TransactionDetails />} />
                    <Route path="search" element={<Search />} />
                    <Route path="tasks" element={<Tasks />} />
                    <Route path="returns" element={<Returns />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="payment/success" element={<PaymentSuccess />} />
                    <Route path="payment/cancel" element={<PaymentCancel />} />
                  </Route>
                </Routes>
              </Suspense>
            </Router>
          </SearchHistoryProvider>
        </TransactionProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
