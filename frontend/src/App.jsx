import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import AboutPage from './pages/AboutPage';
import ReservationsPage from './pages/ReservationsPage';
import EventsPage from './pages/EventsPage';
import ReviewsPage from './pages/ReviewsPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';

// Auth & Admin
import Signup from './components/Signup';
import Signin from './components/Signin';
import AdminDashboard from './components/AdminDashboard';

// Global Drawers and Modals
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import DishCustomizationModal from './components/DishCustomizationModal';
import NutritionModal from './components/NutritionModal';
import LiveOrderTracker from './components/LiveOrderTracker';

import { CartProvider } from './context/CartContext';
import './App.css';

// Main Multi-Page Layout Wrapper
function MainLayout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="main-content-flow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <Routes>
          {/* Main Website Multi-Page Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/reservations" element={<ReservationsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
          </Route>

          {/* Dedicated Fullscreen Admin Operations Dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>

        {/* Global Floating Drawers & Modals (Available on all pages) */}
        <CartDrawer />
        <CheckoutModal />
        <DishCustomizationModal />
        <NutritionModal />
        <LiveOrderTracker />
      </Router>
    </CartProvider>
  );
}

export default App;
