import { Instagram, Facebook, Twitter, Mail, ArrowUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-brand-deep pt-32 pb-12 relative overflow-hidden border-t border-white/5">
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-brand-pink/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-pink to-brand-gold flex items-center justify-center text-white shadow-lg shadow-brand-pink/20">
                <span className="font-serif font-bold text-xl">G</span>
              </div>
              <span className="text-xl font-serif font-bold tracking-widest uppercase text-white">
                Glow <span className="text-brand-pink italic">&</span> Glamour
              </span>
            </div>
            <p className="text-white/50 leading-relaxed font-light mb-8 text-sm italic">
              "Where every client is treated like the only diva in the room." Premium care tailored for your unique shine.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter, Mail].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-brand-pink hover:border-brand-pink hover:bg-brand-pink/5 transition-all group"
                >
                  <Icon size={18} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold mb-8">Navigate</h4>
            <ul className="space-y-4">
              {[
                { name: "Home", path: "/" },
                { name: "The Services", path: "/services" },
                { name: "My Itinerary", path: "/bookings" },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-white/40 hover:text-brand-pink transition-all text-sm font-medium flex items-center gap-2 group">
                    <span className="w-0 h-[1px] bg-brand-pink group-hover:w-4 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours Section - Replaces the repeated services list for better UX */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold mb-8">The Studio</h4>
            <ul className="space-y-4 text-sm font-light">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/60">Mon — Fri</span>
                <span className="text-white/30 italic">9am - 8pm</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/60">Saturday</span>
                <span className="text-white/30 italic">10am - 6pm</span>
              </li>
              <li className="flex justify-between">
                <span className="text-brand-pink/60">Sunday</span>
                <span className="text-white/20 italic tracking-widest uppercase text-[10px]">Closed</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold mb-8">Inner Circle</h4>
            <p className="text-white/40 font-light text-sm mb-6 leading-relaxed">
              Join our exclusive list for priority booking and seasonal styling guides.
            </p>
            <div className="relative group">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-white/5 border-b border-white/10 py-4 pr-12 text-white text-sm focus:outline-none focus:border-brand-pink transition-all placeholder:text-white/20"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-brand-gold hover:text-brand-pink transition-all">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-bold">
              © 2026 Glow & Glamour Studio. Crafted for excellence.
            </p>
            <div className="flex gap-6 text-[10px] uppercase tracking-widest text-white/10">
              <Link to="#" className="hover:text-brand-pink transition-colors">Privacy</Link>
              <Link to="#" className="hover:text-brand-pink transition-colors">Terms</Link>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="flex flex-col items-center gap-2 text-white/30 hover:text-brand-pink transition-all font-bold uppercase tracking-[0.3em] text-[10px]"
          >
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center mb-1 group-hover:border-brand-pink transition-colors">
              <ArrowUp size={16} />
            </div>
            Back to Top
          </motion.button>
        </div>
      </div>
    </footer>
  );
};