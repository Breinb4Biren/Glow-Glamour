import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, Users, Sparkles, Check, X, Trash2, 
  Plus, PhoneCall, Search
} from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import toast from 'react-hot-toast'; // <--- MAKE SURE THIS IS HERE

// --- Types ---
interface Booking {
  id: number;
  name: string;
  email: string;
  serviceName: string; 
  date: string;
  time: string;
  status: string; 
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface Service {
  id: number;
  name: string;
  price: number;
}

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, token, loading: authLoading } = useAuthContext(); 
  
  const [activeTab, setActiveTab] = useState<'bookings' | 'users' | 'services'>('bookings');
  const [loading, setLoading] = useState(false);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); 

  const [newService, setNewService] = useState({
    name: "", description: "", price: "", image: null as File | null
  });

  useEffect(() => {
    if (authLoading) return;

    if (!token || !user || user.role !== "ADMIN") {
      toast.error("⛔ wrong request");
      navigate("/"); 
      return;
    }

    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 30000); 

    return () => clearInterval(interval);
  }, [activeTab, authLoading, user, token]);

  const fetchData = async () => {
    if (!token) return;
    const headers = { "Authorization": `Bearer ${token}` };

    try {
      if (activeTab === 'bookings') {
        const res = await fetch("http://localhost:8080/api/admin/bookings", { headers });
        if (res.ok) setBookings(await res.json());
      } 
      else if (activeTab === 'users') {
        const res = await fetch("http://localhost:8080/api/admin/users", { headers });
        if (res.ok) setUsers(await res.json());
      }
      else if (activeTab === 'services') {
        const res = await fetch("http://localhost:8080/api/services");
        if (res.ok) setServices(await res.json());
      }
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

 const updateStatus = async (id: number, newStatus: string) => {
  if (!token) return;
  
  // We wrap the fetch in a promise for the toast
  const updateProcess = fetch(`http://localhost:8080/api/admin/bookings/${id}/status`, {
    method: 'PUT',
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus })
  });

  // This one line handles Loading, Success, AND Error UI!
  toast.promise(updateProcess, {
    loading: 'Updating booking...',
    success: `Booking marked as ${newStatus.toLowerCase()}!`,
    error: 'Could not update status.',
  });

  // Update local UI immediately (Optimistic UI)
  setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  
  const res = await updateProcess;
  if (!res.ok) fetchData(); // Refresh if server failed
};

  const deleteUser = async (id: number) => {
    if (!token || !window.confirm("Are you sure?")) return;
    const res = await fetch(`http://localhost:8080/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) setUsers(prev => prev.filter(u => u.id !== id));
    toast.success("User removed successfully.");
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const formData = new FormData();
    formData.append("name", newService.name);
    formData.append("description", newService.description);
    formData.append("price", newService.price);
    if (newService.image) formData.append("image", newService.image);

    const res = await fetch("http://localhost:8080/api/admin/services", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }, 
      body: formData
    });

    if (res.ok) {
        toast.success("Service Added!");
        setNewService({ name: "", description: "", price: "", image: null }); 
        fetchData(); 
    }
  };

  const deleteService = async (id: number) => {
    if (!token || !window.confirm("Delete permanently?")) return;
    await fetch(`http://localhost:8080/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
    });
    fetchData();
  };

  // --- SAFE FILTER LOGIC ---
  // We use optional chaining ?. to prevent crashes if data is null
  const filteredBookings = (bookings || []).filter(b => 
    b.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.serviceName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = (users || []).filter(u => 
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredServices = (services || []).filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-brand-cream/30">
        <div className="animate-spin w-12 h-12 border-4 border-brand-pink border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-4 min-h-screen bg-brand-cream/30">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div>
                <h1 className="text-4xl font-serif text-brand-deep">Admin Dashboard</h1>
                <p className="text-gray-500">Manage your salon operations</p>
            </div>
            <div className="flex gap-2">
                <span className="bg-brand-deep text-white px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-widest shadow-md">
                    Admin Mode
                </span>
                <button onClick={() => navigate('/')} className="bg-white text-brand-deep px-4 py-2 rounded-lg text-sm font-bold border border-gray-200 hover:bg-gray-50">
                    Exit
                </button>
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 mb-8 border-b border-brand-pink/20 pb-6">
            <button onClick={() => { setActiveTab('bookings'); setSearchTerm(""); }} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'bookings' ? 'bg-brand-pink text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100'}`}>
                <Calendar size={18} /> Bookings
            </button>
            <button onClick={() => { setActiveTab('users'); setSearchTerm(""); }} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'users' ? 'bg-brand-pink text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100'}`}>
                <Users size={18} /> Users
            </button>
            <button onClick={() => { setActiveTab('services'); setSearchTerm(""); }} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'services' ? 'bg-brand-pink text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100'}`}>
                <Sparkles size={18} /> Services
            </button>
        </div>

        {/* 🔍 SEARCH BAR */}
        <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={18} />
            </div>
            <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-brand-pink/10 shadow-sm focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink outline-none transition-all"
            />
            {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-brand-pink">
                    <X size={16} />
                </button>
            )}
        </div>

        {loading && <div className="text-center py-10 text-brand-pink font-bold">Loading Data...</div>}

        {/* BOOKINGS TAB */}
        {!loading && activeTab === 'bookings' && (
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-brand-pink/10">
                <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-brand-pink text-white uppercase text-xs tracking-wider">
                        <tr>
                            <th className="p-6">ID</th><th className="p-6">Customer Details</th><th className="p-6">Service</th><th className="p-6">Date/Time</th><th className="p-6">Status</th><th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredBookings.map(booking => (
                            <tr key={booking.id} className="hover:bg-brand-cream/20 transition-colors">
                                <td className="p-6 font-bold text-gray-400">#{booking.id}</td>
                                <td className="p-6"><div className="font-bold text-brand-deep text-lg">{booking.name}</div><div className="text-sm text-gray-500">{booking.email}</div></td>
                                <td className="p-6 font-medium text-brand-pink">{booking.serviceName}</td>
                                <td className="p-6 text-gray-600"><div>{booking.date}</div><div className="text-xs font-bold text-gray-400">{booking.time}</div></td>
                                <td className="p-6"><span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : booking.status === 'NEGOTIATING' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{booking.status || 'PENDING'}</span></td>
                                <td className="p-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => updateStatus(booking.id, 'CONFIRMED')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 border border-green-200" title="Confirm"><Check size={18}/></button>
                                        <button onClick={() => updateStatus(booking.id, 'CANCELLED')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-200" title="Cancel"><X size={18}/></button>
                                        <button onClick={() => updateStatus(booking.id, 'NEGOTIATING')} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 border border-blue-200" title="Reschedule"><PhoneCall size={18}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredBookings.length === 0 && <div className="p-10 text-center text-gray-400">No matching bookings found.</div>}
                </div>
            </div>
        )}

        {/* USERS TAB */}
        {!loading && activeTab === 'users' && (
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-brand-pink/10">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-white uppercase text-xs tracking-wider">
                        <tr><th className="p-6">ID</th><th className="p-6">Username</th><th className="p-6">Email</th><th className="p-6">Role</th><th className="p-6 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.map(u => (
                            <tr key={u.id}>
                                <td className="p-6 font-bold text-gray-400">#{u.id}</td><td className="p-6 font-bold text-brand-deep">{u.username}</td><td className="p-6 text-gray-600">{u.email}</td><td className="p-6"><span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold">{u.role}</span></td>
                                <td className="p-6 text-right">
                                    {u.role !== 'ADMIN' ? (<button onClick={() => deleteUser(u.id)} className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">Delete User</button>) : (<span className="text-xs text-gray-400 font-bold uppercase">Protected</span>)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && <div className="p-10 text-center text-gray-400">No matching users found.</div>}
            </div>
        )}

        {/* SERVICES TAB */}
        {!loading && activeTab === 'services' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-brand-pink/20 h-fit">
                    <h3 className="text-xl font-bold text-brand-deep mb-6 flex items-center gap-2"><Plus className="text-brand-pink"/> Add New Service</h3>
                    <form onSubmit={handleAddService} className="space-y-4">
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Service Name</label><input className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-brand-pink" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} required /></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Description</label><textarea className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-brand-pink" rows={3} value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} required /></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Price ($)</label><input className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-brand-pink" type="number" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} required /></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Image</label><input className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-pink file:text-white hover:file:bg-brand-deep" type="file" accept="image/*" onChange={e => setNewService({...newService, image: e.target.files ? e.target.files[0] : null})} /></div>
                        <button className="w-full bg-brand-deep text-white py-3 rounded-xl font-bold hover:bg-black transition-colors shadow-lg mt-4">+ Add Service</button>
                    </form>
                </div>
                <div className="lg:col-span-2 space-y-4">
                    {filteredServices.map(service => (
                        <div key={service.id} className="bg-white p-6 rounded-2xl shadow-sm flex items-center justify-between border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4"><div className="w-12 h-12 bg-brand-cream rounded-full flex items-center justify-center text-brand-pink"><Sparkles size={24} /></div><div><h4 className="font-bold text-lg text-brand-deep">{service.name}</h4><p className="text-brand-pink font-bold">${service.price}</p></div></div>
                            <button onClick={() => deleteService(service.id)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Delete Service"><Trash2 size={20} /></button>
                        </div>
                    ))}
                    {filteredServices.length === 0 && <div className="text-center text-gray-400">No matching services found.</div>}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};