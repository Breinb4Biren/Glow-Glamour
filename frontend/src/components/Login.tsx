import { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import this for smooth redirection
import { useAuthContext } from "../context/AuthContext"; // NEW IMPORT

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate(); // Hook for navigation
  const { login } = useAuthContext(); // ✅ Get global login function

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. CHANGE URL: Match the RequestMapping in AuthApiController ("/api/auth")
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        // 2. CHANGE HEADERS: Java expects JSON, not x-www-form-urlencoded
        headers: {
          'Content-Type': 'application/json',
        },
        // 3. CHANGE BODY: Send a JSON object matching 'LoginPayload' record in Java
        body: JSON.stringify({ 
            username: username, 
            password: password 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // // 4. SAVE TOKEN: This is crucial! You must save the JWT to use it later.
        // localStorage.setItem("token", data.token);
        // localStorage.setItem("role", data.role);
        // localStorage.setItem("username", data.username);

        // 4. SAVE TOKEN: Updated to use context login (fixes refresh issue)
        login(data.token, data.username, data.role);

        console.log("Login Successful", data);

        // 5. REDIRECT: Use navigate instead of window.location for a faster feel
        if (data.role === 'ADMIN') {
            navigate("/admin");
        } else {
            navigate("/");
        }
      } else {
        // Handle 401 Unauthorized
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Is the Java Backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... REST OF YOUR JSX STAYS EXACTLY THE SAME ...
    <div className="min-h-screen flex items-center justify-center bg-brand-cream/30 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="bg-brand-pink p-8 text-center">
          <h2 className="text-3xl font-serif text-white mb-2">Welcome Back</h2>
          <p className="text-white/80">Sign in to manage your appointments</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Username</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-pink/50 transition-all"
                  placeholder="Enter username"
                  required
                />
                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-pink/50 transition-all"
                  placeholder="••••••••"
                  required
                />
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-brand-deep text-white py-3 rounded-xl font-bold hover:bg-brand-pink transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account? <a href="/register" className="text-brand-pink font-bold hover:underline">Register here</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};