import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Calendar, LogOut, LayoutDashboard } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn"; 
import { useNavigate, Link } from "react-router-dom"; 
import { useAuthContext } from "../context/AuthContext"; 

export const Navbar = () => {
  const { user, logout } = useAuthContext(); 
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "My Bookings", href: "/bookings" }, 
  ];

  return (
    <>
      {/* 1. MAIN NAVIGATION BAR */}
      <nav className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 lg:px-12",
          isScrolled 
            ? "py-3 bg-brand-deep/90 backdrop-blur-xl shadow-2xl border-b border-white/10" 
            : "py-6 bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
            <motion.div
              whileHover={{ rotate: 15 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-pink to-brand-gold flex items-center justify-center text-white shadow-lg shadow-brand-pink/20"
            >
              <span className="font-serif font-bold text-xl text-white">G</span>
            </motion.div>
            <span className={cn(
              "text-xl font-serif font-bold tracking-wider uppercase transition-colors",
              isScrolled ? "text-white" : "text-white drop-shadow-md group-hover:text-brand-pink"
            )}>
              Glow & Glamour
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-[11px] font-bold tracking-[0.2em] uppercase transition-all text-white/70 hover:text-brand-pink"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User / Login Section (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={cn(
                    "flex items-center gap-3 pl-1 pr-3 py-1 rounded-full border transition-all hover:border-brand-pink/50 bg-white/5",
                    isScrolled ? "border-white/10" : "border-white/30"
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-brand-pink to-[#b56579] flex items-center justify-center text-[12px] font-bold text-white uppercase">
                    {user.username.charAt(0)}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-white">
                    {user.username}
                  </span>
                  <ChevronDown size={14} className={cn("text-white/40 transition-transform", isProfileOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-60 bg-brand-deep/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-3 shadow-2xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-white/5 mb-2">
                        <p className="text-[10px] text-brand-gold font-bold uppercase tracking-[0.2em]">Profile Active</p>
                        <p className="text-white text-sm truncate font-medium">{user.username}</p>
                      </div>
                      <div className="space-y-1">
                        {user.role === 'ADMIN' && (
                          <Link to="/admin" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 w-full p-3 rounded-2xl text-white/70 hover:bg-white/10 hover:text-brand-pink transition-all text-xs font-bold uppercase tracking-wider">
                            <LayoutDashboard size={16} /> Dashboard
                          </Link>
                        )}
                        <Link to="/bookings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 w-full p-3 rounded-2xl text-white/70 hover:bg-white/10 hover:text-brand-pink transition-all text-xs font-bold uppercase tracking-wider">
                          <Calendar size={16} /> My Itinerary
                        </Link>
                        <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all text-xs font-bold uppercase tracking-wider mt-2 border-t border-white/5 pt-4">
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-white hover:text-brand-pink transition-all">
                Sign In
              </Link>
            )}
            
            <Link
              to="/contact"
              className="bg-brand-pink hover:bg-brand-pink/90 text-white px-7 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-brand-pink/20 transition-all active:scale-95"
            >
              Book Session
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white p-2 z-[60]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* 2. MOBILE MENU OVERLAY (Outside the <nav> tag) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-brand-deep flex flex-col md:hidden"
          >
            {/* Header inside the menu */}
            <div className="flex justify-between items-center px-6 py-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-pink flex items-center justify-center text-white font-serif font-bold">G</div>
                <span className="text-white font-serif font-bold uppercase tracking-widest text-sm">Menu</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white p-2">
                <X size={28} />
              </button>
            </div>

            {/* Links */}
            <div className="flex flex-col p-8 gap-4 overflow-y-auto h-full">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-serif font-bold text-white py-4 border-b border-white/5"
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="mt-auto pb-10">
                {user ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                       <div className="w-10 h-10 rounded-full bg-brand-pink flex items-center justify-center text-white font-bold uppercase">
                          {user.username.charAt(0)}
                       </div>
                       <span className="text-white font-medium">{user.username}</span>
                    </div>
                    <button onClick={handleLogout} className="text-red-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                      <LogOut size={16}/> Sign Out
                    </button>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-bold uppercase tracking-widest text-sm">
                    Sign In
                  </Link>
                )}

                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-8 block bg-brand-pink text-white text-center py-5 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] shadow-2xl"
                >
                  Book Session
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};