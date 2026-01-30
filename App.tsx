import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Store from './src/Store';
import ProductDetails from './src/ProductDetails';
import Login from './src/Login';
import ProtectedRoute from './src/components/ProtectedRoute';

// Lazy load Admin components
const AdminLayout = lazy(() => import('./src/admin/AdminLayout'));
const Dashboard = lazy(() => import('./src/admin/Dashboard'));
const ProductsPage = lazy(() => import('./src/admin/ProductsPage'));
const AppearancePage = lazy(() => import('./src/admin/AppearancePage'));
const TestimonialsPage = lazy(() => import('./src/admin/TestimonialsPage'));
const FeaturesPage = lazy(() => import('./src/admin/FeaturesPage'));
const MediaPage = lazy(() => import('./src/admin/MediaPage'));

// Loading Fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400 animate-pulse">Loading System...</p>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Store />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="appearance" element={<AppearancePage />} />
              <Route path="testimonials" element={<TestimonialsPage />} />
              <Route path="features" element={<FeaturesPage />} />
              <Route path="media" element={<MediaPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;