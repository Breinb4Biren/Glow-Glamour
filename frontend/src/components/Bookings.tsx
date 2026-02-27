import { useEffect, useState } from "react";
import { Calendar, AlertCircle, ArrowLeft, Plus, Sparkles, Trash2, Loader2 } from "lucide-react"; // ✅ Swapped Scissors for Sparkles, added Trash2 & Loader2
import { motion } from "framer-motion";
import { useAuthContext } from "../context/AuthContext"; 
import { Navigate, Link, useNavigate } from "react-router-dom"; 

interface Booking {
  id: number;
  service: string; 
  date: string;    
  time: string;    
}

export const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { user, loading: authLoading } = useAuthContext(); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null); // ✅ Tracks which booking is being deleted
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:8080/api/bookings", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          setError("Could not load bookings. Please sign in again.");
        }
      } catch (err) {
        setError("Network error. Please check if the server is live.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchBookings();
    }
  }, [authLoading]);

  // ✅ NEW: Handle Canceling a Booking
  const handleCancel = async (id: number) => {
    if (!window.confirm("Are you sure you want to cancel this glamorous session?")) return;

    setDeletingId(id);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:8080/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}` // Assuming your backend needs auth to delete
        }
      });

      if (response.ok) {
        // Smoothly remove the booking from the UI without reloading the page
        setBookings(prevBookings => prevBookings.filter(booking => booking.id !== id));
      } else {
        alert("Failed to cancel the booking. Please try again.");
      }
    } catch (err) {
      alert("Network error while trying to cancel.");
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-brand-deep pt-32 pb-24 relative overflow-hidden">
      {/* Soft background glow to match Hero */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-pink/5 rounded-full blur-[120px] -z-0" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex justify-between items-end mb-12"
        >
          <div>
            <button 
              onClick={() => navigate("/")} 
              className="flex items-center gap-2 text-brand-gold font-bold uppercase tracking-widest text-xs mb-4 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} /> Back to Salon
            </button>
            <h2 className="text-5xl font-serif text-white">Your <span className="italic text-brand-pink">Itinerary</span></h2>
          </div>
          <Link to="/services" className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-brand-pink text-white px-6 py-3 rounded-2xl transition-all text-sm font-bold uppercase tracking-widest">
            <Plus size={18} /> New Booking
          </Link>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-brand-pink border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white/40 uppercase tracking-widest text-xs">Curating your history...</p>
          </div>
        ) : error ? (
          <div className="glass-panel p-6 border-red-500/20 text-red-400 flex items-center gap-3 mb-8">
            <AlertCircle size={20} /> {error}
          </div>
        ) : bookings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center glass-panel p-16 rounded-[3rem] border border-white/10"
          >
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-gold">
                <Calendar size={40} />
            </div>
            <p className="text-2xl text-white font-serif mb-8">No glam sessions scheduled yet.</p>
            <Link to="/services" className="bg-gradient-to-r from-brand-pink to-[#b56579] text-white px-10 py-4 rounded-full font-bold hover:scale-105 transition-all inline-block shadow-lg shadow-brand-pink/20">
                Book Your First Session
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking, index) => (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between hover:border-brand-pink/30 transition-all group"
              >
                <div className="flex items-center gap-6 mb-4 md:mb-0 w-full md:w-auto">
                  {/* ✅ Replaced Scissors with Sparkles */}
                  <div className="w-16 h-16 bg-brand-pink/10 rounded-2xl flex items-center justify-center text-brand-pink group-hover:bg-brand-pink group-hover:text-white transition-all">
                    <Sparkles size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-white">{booking.service || "Glamour Service"}</h3>
                    <p className="text-[10px] text-brand-gold uppercase tracking-[0.2em] font-bold">Ref ID: #{booking.id}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col items-end gap-1 px-4 border-r border-white/10">
                        <span className="text-[10px] text-white/30 uppercase tracking-widest">Date</span>
                        <span className="text-white font-medium">{booking.date}</span>
                    </div>
                    <div className="flex flex-col items-start gap-1 px-4">
                        <span className="text-[10px] text-white/30 uppercase tracking-widest">Time</span>
                        <span className="text-white font-medium">{booking.time}</span>
                    </div>
                </div>

                {/* ✅ Added the Cancel Button next to the Confirmed badge */}
                <div className="mt-6 md:mt-0 flex flex-col items-end gap-3">
                  <span className="px-5 py-2 bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-500/20 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    Confirmed
                  </span>
                  
                  <button 
                    onClick={() => handleCancel(booking.id)}
                    disabled={deletingId === booking.id}
                    className="flex items-center gap-2 text-white/30 hover:text-red-400 transition-colors text-[10px] uppercase tracking-widest font-bold disabled:opacity-50"
                  >
                    {deletingId === booking.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                    Cancel Booking
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};