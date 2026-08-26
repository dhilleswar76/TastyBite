import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Menu from './components/Menu';
import Reservations from './components/Reservations';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Signup from './components/Signup';
import Signin from './components/Signin';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/AdminDashboard';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import { CartProvider } from './context/CartContext';
import './App.css';

function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Menu />
      <Reservations />
      <Contact />
      <Footer />
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <Header />
                <Signup />
                <Footer />
              </>
            }
          />
          <Route
            path="/signin"
            element={
              <>
                <Header />
                <Signin />
                <Footer />
              </>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminDashboard />
            }
          />
        </Routes>

        {/* Global Cart Drawer and Checkout Modal */}
        <CartDrawer />
        <CheckoutModal />
      </Router>
    </CartProvider>
  );
}

export default App;
