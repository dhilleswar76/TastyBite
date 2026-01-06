import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
    <Router>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/signup" element={
          <>
            <Header />
            <Signup />
            <Footer />
          </>
        } />
        <Route path="/signin" element={
          <>
            <Header />
            <Signin />
            <Footer />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
