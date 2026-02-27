import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Phone, MapPin, Calendar, Clock, Loader2, 
  CheckCircle, AlertCircle, User, Mail, ArrowLeft, Sparkles 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti"; // ✅ NEW: Import confetti

interface ServiceItem {
  id: number;
  name: string;
}

export const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [availableServices, setAvailableServices] = useState<ServiceItem[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceName: location.state?.preSelectedService || "", 
    date: "",
    time: "",
    message: ""
  });

  useEffect(() => {
    fetch('http://localhost:8080/api/services')
      .then(res => res.json())
      .then(data => {
        setAvailableServices(data);
        if (data.length > 0 && !formData.serviceName) {
           setFormData(prev => ({ ...prev, serviceName: data[0].name }));
        }
      })
      .catch(err => console.error("Failed to load services", err));
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setFormData(prev => ({ ...prev, name: storedUsername }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ LUXURY CONFETTI TRIGGER
  const triggerSuccess = () => {
    setSuccess(true);
    
    const duration = 3 * 1000;
    const end = Date.now() + duration;
    // Brand colors: Rose Gold, Gold, White
    const colors = ["#ffafcc", "#d4af37", "#ffffff"];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }) 
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        triggerSuccess(); // ✅ Call the cinematic success function
      } else {
        const errorText = await response.text();
        setErrorMessage("Booking failed: " + errorText);
      }
    } catch (error) {
      setErrorMessage("Server error. Is Spring Boot running?");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setFormData(prev => ({ ...prev, date: "", time: "", message: "", phone: "" }));
  };

  return (
    <div className="min-h-screen bg-brand-deep pt-32 pb-20 relative overflow-hidden">
      
      {/* ✅ FULL SCREEN SUCCESS OVERLAY */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-deep/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="glass-panel text-center p-12 max-w-lg rounded-[2.5rem] border border-white/20 shadow-2xl"
            >
              <div className="w-24 h-24 bg-gradient-to-tr from-brand-pink to-brand-gold rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-brand-pink/40">
                <CheckCircle size={48} className="text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">You're all set!</h2>
              <p className="text-brand-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-8">
                Confirmed for {formData.date} at {formData.time}
              </p>
              <p className="text-white/80 text-base mb-10 leading-relaxed font-light">
                Get ready, <span className="text-white font-bold">{formData.name}</span>. Your <span className="italic text-brand-pink">{formData.serviceName}</span> transformation awaits.
              </p>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => navigate("/bookings")}
                  className="bg-brand-pink text-white py-4 px-8 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-lg shadow-brand-pink/20"
                >
                  View My Itinerary
                </button>
                <button 
                  onClick={handleReset}
                  className="text-white/40 hover:text-white transition-colors text-[10px] uppercase tracking-widest font-bold mt-2"
                >
                  Book another session
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Background Overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2074')] bg-cover opacity-10 mix-blend-overlay" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-pink/10 rounded-full blur-[120px] -z-0" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          
          {/* LEFT: Contact & Info (2 Columns) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-12"
          >
            <div>
              <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-brand-gold font-bold uppercase tracking-widest text-xs mb-8 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <h1 className="text-5xl md:text-6xl font-serif text-white mb-6">Book Your <br /><span className="italic text-brand-pink">Glow Up</span></h1>
              <p className="text-white/60 text-lg font-light leading-relaxed">
                Secure your session with our master stylists. Professional beauty care tailored to your unique elegance.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-5 p-4 rounded-3xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-brand-pink/20 flex items-center justify-center text-brand-pink">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest">Our Studio</p>
                  <p className="text-white text-sm">123 Beauty Lane, Glamour District</p>
                </div>
              </div>

              <div className="flex items-center gap-5 p-4 rounded-3xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-brand-gold/20 flex items-center justify-center text-brand-gold">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest">Direct Line</p>
                  <p className="text-white text-sm">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Booking Form (3 Columns) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 glass-panel p-8 md:p-12 rounded-[2.5rem] border border-white/10"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center gap-3 text-sm">
                  <AlertCircle size={18} /> {errorMessage}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-white/50 text-xs uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input required name="name" type="text" value={formData.name} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:border-brand-pink transition-colors" placeholder="Diva Name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-white/50 text-xs uppercase tracking-widest ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input required name="email" type="email" value={formData.email} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:border-brand-pink transition-colors" placeholder="email@example.com" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-white/50 text-xs uppercase tracking-widest ml-1">Phone Number</label>
                <input required name="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-pink transition-colors" placeholder="+1 (555) 000-0000" />
              </div>

              <div className="space-y-2">
                <label className="text-white/50 text-xs uppercase tracking-widest ml-1">Service</label>
                <div className="relative">
                  <select name="serviceName" value={formData.serviceName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-pink transition-colors appearance-none">
                    {availableServices.map(s => <option key={s.id} value={s.name} className="bg-brand-deep">{s.name}</option>)}
                  </select>
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-white/50 text-xs uppercase tracking-widest ml-1">Date</label>
                  <input required name="date" type="date" value={formData.date} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-pink transition-colors [color-scheme:dark]" />
                </div>
                <div className="space-y-2">
                  <label className="text-white/50 text-xs uppercase tracking-widest ml-1">Time</label>
                  <input required name="time" type="time" value={formData.time} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-pink transition-colors [color-scheme:dark]" />
                </div>
              </div>

              <button disabled={loading} className="w-full bg-gradient-to-r from-brand-pink to-brand-gold text-white py-5 rounded-2xl font-bold uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <>Confirm Booking <Sparkles size={20} /></>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};