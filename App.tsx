import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Store from './src/Store';
import ProductDetails from './src/ProductDetails';
import Login from './src/Login';

// Admin imports
import AdminLayout from './src/admin/AdminLayout';
import Dashboard from './src/admin/Dashboard';
import ProductsPage from './src/admin/ProductsPage';
import AppearancePage from './src/admin/AppearancePage';
import TestimonialsPage from './src/admin/TestimonialsPage';
import FeaturesPage from './src/admin/FeaturesPage';
import MediaPage from './src/admin/MediaPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Store />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="appearance" element={<AppearancePage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="features" element={<FeaturesPage />} />
          <Route path="media" element={<MediaPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;