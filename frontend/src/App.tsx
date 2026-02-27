import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast'; // ✅ 1. IMPORT THIS
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { About } from "./components/About";
import { Testimonials } from "./components/Testimonials";
import { Booking } from "./components/Booking";
import { Bookings } from "./components/Bookings";
import { Gallery } from "./components/Gallery";
import { Footer } from "./components/Footer";
import { Login } from "./Components/Login";    
import { Register } from "./Components/Register"; 
import { ScrollToTop } from "./components/ScrollToTop";
import { AdminDashboard } from "./components/AdminDashboard";
import { AuthProvider } from './context/AuthContext'; // NEW IMPORT

const Home = () => (
  <main>
    <Hero />
    <About />
    <Services /> 
    <Gallery />
    <Testimonials />
    <Booking /> 
  </main>
);

export function App() {
  return (
    <Router>
      {/* ✅ ADDED: AuthProvider wraps everything to broadcast login state */}
      <AuthProvider>
        {/* ✅ 2. ADD TOASTER HERE (It sits at the top level) */}
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#ec4899', // Matches your brand pink!
                secondary: '#fff',
              },
            },
          }} 
        />
        {/* ✅ 2. PLACE IT RIGHT HERE INSIDE THE ROUTER */}
        <ScrollToTop />

        <div className="min-h-screen flex flex-col">
          {/* Navbar is outside Routes so it shows on every page */}
          <Navbar />

          {/* Add padding-top (pt-24) so the Navbar doesn't cover the content */}
          <div className="flex-grow">
            <Routes>
              {/* ✅ 1. The Main Landing Page (http://localhost:3000/) */}
              <Route path="/" element={<Home />} />

              {/* ✅ 2. Authentication Pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* 👇 ADD THIS NEW LINE RIGHT HERE 👇 */}
              <Route path="/admin" element={<AdminDashboard />} />

              {/* ✅ 3. THE MISSING LINKS (This fixes your blank pages!) */}
              
              {/* When you click "Services" in Navbar -> Go to Services Page */}
              <Route path="/services" element={<Services />} />
              
              {/* When you click "Book Now" -> Go to Booking Page */}
              <Route path="/contact" element={<Booking />} />
              
              {/* When you click "About Us" -> Go to About Page (Optional) */}
              <Route path="/about" element={<About />} />

              {/* When you click "Gallery" -> Go to Gallery Page (Optional) */}
              <Route path="/gallery" element={<Gallery />} />

              {/* ✅ NEW: This makes the 'Bookings' link in Navbar work */}
              <Route path="/bookings" element={<Bookings />} /> 
              
            </Routes>
          </div>

          {/* Footer shows on every page */}
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;