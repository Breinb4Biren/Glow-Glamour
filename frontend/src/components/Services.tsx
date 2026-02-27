import { useEffect, useState } from "react";
import { Sparkles, Palette, Crown, Heart, Scissors, Smile, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  imageBase64?: string;
}

const getIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("bridal")) return <Crown size={24} />;
  if (lowerName.includes("hair")) return <Scissors size={24} />;
  if (lowerName.includes("nail")) return <Palette size={24} />;
  if (lowerName.includes("eye")) return <Heart size={24} />;
  if (lowerName.includes("party")) return <Smile size={24} />;
  return <Sparkles size={24} />;
};

export const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching services:", err);
        setLoading(false);
      });
  }, []);

  const getImageSrc = (base64String?: string) => {
    if (!base64String) return "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80";
    return base64String.startsWith("data:image") ? base64String : `data:image/jpeg;base64,${base64String}`;
  };

  const handleBookNow = (serviceName: string) => {
    navigate("/contact", { state: { preSelectedService: serviceName } });
  };

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-brand-deep to-[#1a1a1a] relative overflow-hidden">
      {/* Background Glows for Depth */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-pink/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <span className="text-brand-gold font-bold uppercase tracking-[0.4em] text-xs mb-4">The Diva Catalog</span>
            <h2 className="text-5xl md:text-6xl font-serif text-white mb-6">Exceptional Services</h2>
            <div className="h-px w-40 bg-gradient-to-r from-transparent via-brand-pink to-transparent" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            <div className="col-span-3 py-20 text-center">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-12 h-12 border-4 border-brand-pink border-t-transparent rounded-full mx-auto"
              />
              <p className="mt-4 text-white/50 font-light tracking-widest">CONNECTING TO DATABASE...</p>
            </div>
          ) : (
            services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative h-[500px] flex flex-col overflow-hidden rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-500 hover:border-brand-pink/50 hover:bg-white/10"
              >
                {/* Image Section */}
                <div className="relative h-2/3 overflow-hidden">
                  <img
                    src={getImageSrc(service.imageBase64)}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-transparent to-transparent opacity-80" />
                  
                  {/* Price Tag */}
                  <div className="absolute top-6 right-6 bg-brand-pink/90 backdrop-blur-md text-white font-bold px-4 py-2 rounded-2xl shadow-xl">
                    ${service.price}
                  </div>

                  {/* Icon Badge */}
                  <div className="absolute bottom-6 left-6 w-12 h-12 glass-panel rounded-2xl flex items-center justify-center text-brand-gold">
                    {getIcon(service.name)}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-2xl font-serif text-white mb-2 group-hover:text-brand-pink transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-white/50 text-sm font-light leading-relaxed line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleBookNow(service.name)}
                    className="mt-4 w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-brand-pink group-hover:border-brand-pink transition-all duration-300"
                  >
                    Reserve Now
                    <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};