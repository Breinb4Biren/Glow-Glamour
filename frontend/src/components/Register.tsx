import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Create form data (matches your RegisterController)
    const data = new URLSearchParams();
    data.append('fullName', formData.fullName);
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('password', formData.password);

    try {
      // Note: We might need to adjust your RegisterController to return JSON instead of redirect
      // For now, let's try calling it.
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data,
      });

      if (response.redirected || response.ok) {
        window.location.href = "/login?registered=true";
      } else {
        setError("Registration failed. Try a different username.");
      }
    } catch (err) {
      setError("Registration failed. Server unreachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream/30 px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="bg-brand-deep p-8 text-center">
          <h2 className="text-3xl font-serif text-white mb-2">Join Glow & Glamour</h2>
          <p className="text-white/80">Create an account to start your beauty journey</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
              <div className="relative">
                <input name="fullName" type="text" onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-pink/50 transition-all" placeholder="Jane Doe" required />
                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Username</label>
              <div className="relative">
                <input name="username" type="text" onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-pink/50 transition-all" placeholder="janedoe" required />
                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email</label>
              <div className="relative">
                <input name="email" type="email" onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-pink/50 transition-all" placeholder="jane@example.com" required />
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
              <div className="relative">
                <input name="password" type="password" onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-pink/50 transition-all" placeholder="••••••••" required />
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            <button disabled={loading} className="w-full bg-brand-pink text-white py-3 rounded-xl font-bold hover:bg-brand-deep transition-colors flex items-center justify-center gap-2 mt-4">
              {loading ? <Loader2 className="animate-spin" /> : <>Create Account <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account? <a href="/login" className="text-brand-pink font-bold hover:underline">Sign in</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};