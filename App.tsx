import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Store from './src/Store';
import ProductDetails from './src/ProductDetails';
import Login from './src/Login';
import ForgotPassword from './src/ForgotPassword';
import ResetPassword from './src/ResetPassword';
import Blog from './src/Blog';
import BlogPost from './src/BlogPost';
import Checkout from './src/Checkout';
import UserLayout from './src/user/UserLayout';
import ProfilePage from './src/user/ProfilePage';
import UserOrdersPage from './src/user/UserOrdersPage';

import ProtectedRoute from './src/components/ProtectedRoute';

// Lazy load Admin components
const AdminLayout = lazy(() => import('./src/admin/AdminLayout'));
const Dashboard = lazy(() => import('./src/admin/Dashboard'));
const ProductsPage = lazy(() => import('./src/admin/ProductsPage'));
const AppearancePage = lazy(() => import('./src/admin/AppearancePage'));
const TestimonialsPage = lazy(() => import('./src/admin/TestimonialsPage'));
const FeaturesPage = lazy(() => import('./src/admin/FeaturesPage'));
const BlogPage = lazy(() => import('./src/admin/BlogPage'));
const MediaPage = lazy(() => import('./src/admin/MediaPage'));
const OrdersPage = lazy(() => import('./src/admin/OrdersPage'));

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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* User Routes - Protected by default via UserLayout logic or Auth Guard if needed */}
          <Route path="/user" element={<UserLayout />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="orders" element={<UserOrdersPage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
// ... existing admin routes
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="blog" element={<BlogPage />} />
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