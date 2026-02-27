// import { motion } from "framer-motion";
// import { ChevronRight, ArrowRight } from "lucide-react";
// import { useAuthContext } from "../context/AuthContext"; // ✅ ADDED: To get the real username
// import { Link } from "react-router-dom"; // ✅ ADDED: For internal navigation

// export const Hero = () => {
//   const { user } = useAuthContext(); // ✅ Get user from global state

//   return (
//     <section className="relative h-screen min-h-[700px] w-full flex items-center justify-center overflow-hidden">
//       {/* Background Image with Overlay */}
//       <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
//         <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
//       </div>

//       <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-20">
//         <div className="max-w-2xl">
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             className="mb-6 flex items-center gap-2"
//           >
//             <div className="h-0.5 w-12 bg-brand-gold" />
//             <span className="text-brand-gold font-bold uppercase tracking-[0.2em] text-sm">
//               {/* ✅ CHANGE: Dynamic welcome message based on login status */}
//               {user ? `Welcome back, ${user.username}` : "Welcome to our Salon"}
//             </span>
//           </motion.div>

//           <motion.h1
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//             className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-[1.1] mb-8"
//           >
//             Glow & <br />
//             <span className="italic text-brand-pink">Glamour</span>
//           </motion.h1>

//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.4 }}
//             className="text-white/80 text-lg md:text-xl font-light mb-10 max-w-md leading-relaxed"
//           >
//             Experience the pinnacle of professional beauty services crafted specifically for divas like you.
//           </motion.p>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.6 }}
//             className="flex flex-col sm:flex-row gap-4"
//           >
//             {/* ✅ CHANGE: Using Link instead of <a> to prevent state loss */}
//             <Link
//               to="/services"
//               className="group relative inline-flex items-center justify-center gap-3 bg-brand-pink text-white px-8 py-4 rounded-full font-bold text-lg overflow-hidden transition-all hover:pr-10"
//             >
//               <span>View Our Services</span>
//               <div className="absolute right-4 transition-all opacity-0 group-hover:opacity-100 group-hover:right-6">
//                 <ChevronRight size={20} />
//               </div>
//             </Link>
            
//             <Link
//               to={user ? "/booking" : "/login"} // Redirect to login if not authenticated
//               className="flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
//             >
//               Book Appointment <ArrowRight size={20} />
//             </Link>
//           </motion.div>
//         </div>
//       </div>

//       {/* Decorative Elements */}
//       <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/40">
//         <span className="text-xs uppercase tracking-[0.3em] font-medium rotate-0">Scroll to explore</span>
//         <motion.div
//           animate={{ y: [0, 10, 0] }}
//           transition={{ repeat: Infinity, duration: 2 }}
//           className="h-12 w-[2px] bg-gradient-to-b from-brand-pink to-transparent"
//         />
//       </div>
//     </section>
//   );
// };
// //https://cdn.pixabay.com/video/2020/05/21/40049-424564490_large.mp4" type="video/mp4


import { motion } from "framer-motion";
import { ChevronRight, ArrowRight, Sparkles, Star } from "lucide-react";
import { useAuthContext } from "../context/AuthContext"; 
import { Link } from "react-router-dom"; 

export const Hero = () => {
  const { user } = useAuthContext(); 

  return (
    <section className="relative h-screen min-h-[700px] w-full flex items-center justify-center overflow-hidden">
      
      {/* Background Media */}
      <div className="absolute inset-0 w-full h-full bg-brand-deep">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        >
          {/* ✅ FIXED: Correct path for Vite to access files in the public folder */}
          <source src="/Bride.mp4" type="video/mp4" />
        </video>
        {/* Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-20 flex flex-col lg:flex-row items-center justify-between">
        
        {/* LEFT SIDE: Text Content */}
        <div className="max-w-2xl lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 inline-flex items-center gap-3 glass-panel px-6 py-2 rounded-full"
          >
            <Sparkles size={16} className="text-brand-gold" />
            <span className="text-brand-gold font-bold uppercase tracking-[0.2em] text-sm">
              {user ? `Welcome back, ${user.username}` : "Premium Beauty Experience"}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-7xl lg:text-8xl font-serif text-white leading-[1.1] mb-8 drop-shadow-2xl"
          >
            Reveal Your <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-gold">
              Inner Glow
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/90 text-lg md:text-xl font-light mb-10 max-w-md leading-relaxed"
          >
            Step into a world of elegance. We craft bespoke beauty treatments designed exclusively for the modern diva.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to={user ? "/contact" : "/login"} 
              className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-brand-pink to-[#b56579] shadow-lg shadow-brand-pink/30 text-white px-8 py-4 rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105"
            >
              <span>Book Appointment</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/services"
              className="glass-panel text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              Explore Services <ChevronRight size={20} />
            </Link>
          </motion.div>
        </div>

        {/* ✅ ADDED: RIGHT SIDE Floating Motive Cards */}
        <div className="hidden lg:flex lg:w-1/2 relative justify-end items-center h-[500px]">
          
          {/* Main Featured Service Card */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotate: 5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute right-12 top-16 w-72 glass-panel p-4 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-md hover:-translate-y-2 transition-transform duration-500"
          >
            <div className="w-full h-40 rounded-2xl overflow-hidden mb-4 relative">
              <img 
                src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070&auto=format&fit=crop" 
                alt="Signature Facial" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-2 right-2 bg-white/90 text-brand-deep text-xs font-bold px-3 py-1 rounded-full">
                Featured
              </div>
            </div>
            <h3 className="text-white font-serif text-xl mb-1">Bridal Glow</h3>
            <p className="text-white/70 text-sm mb-4">120 Min • Ultimate radiance</p>
            <div className="flex justify-between items-center">
              <span className="text-brand-gold font-bold text-lg">$250</span>
              <Link 
                to="/contact" 
                className="bg-brand-pink text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-white hover:text-brand-pink transition-colors"
              >
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>

          {/* Floating Trust Badge */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute right-4 bottom-20 glass-panel px-6 py-4 rounded-3xl border border-white/20 shadow-xl backdrop-blur-md flex items-center gap-4 animate-bounce-slow"
            style={{ animationDuration: '4s' }}
          >
            <div className="flex -space-x-3">
              <img src="https://i.pravatar.cc/100?img=1" alt="Client" className="w-12 h-12 rounded-full border-2 border-brand-pink object-cover" />
              <img src="https://i.pravatar.cc/100?img=5" alt="Client" className="w-12 h-12 rounded-full border-2 border-brand-pink object-cover" />
              <img src="https://i.pravatar.cc/100?img=9" alt="Client" className="w-12 h-12 rounded-full border-2 border-brand-pink object-cover" />
            </div>
            <div>
              <div className="flex text-brand-gold gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-white text-sm font-bold mt-1">500+ Happy Divas</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};