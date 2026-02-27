import { motion } from "framer-motion";
import { Check } from "lucide-react";

export const About = () => {
  const highlights = [
    "Over 15 Years of Excellence",
    "Certified Professional Artists",
    "Premium International Products",
    "Personalized Beauty Consultations",
    "Hygienic & Luxurious Environment",
    "Commitment to Client Satisfaction",
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2087&auto=format&fit=crop"
                alt="Our Salon"
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
            {/* Decorative frames */}
            <div className="absolute -top-6 -left-6 w-32 h-32 border-t-4 border-l-4 border-brand-gold z-0 rounded-tl-3xl" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-4 border-r-4 border-brand-pink z-0 rounded-br-3xl" />
            
            {/* Experience Badge */}
            <div className="absolute bottom-12 -left-8 bg-white p-6 rounded-2xl shadow-xl z-20 border border-brand-cream hidden md:block">
              <div className="text-4xl font-serif font-bold text-brand-pink">15+</div>
              <div className="text-xs uppercase tracking-widest text-brand-deep/60 font-bold">Years of Passion</div>
            </div>
          </motion.div>

          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-brand-pink font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Our Story</span>
              <h2 className="text-4xl md:text-5xl font-serif text-brand-deep mb-8">Redefining Elegance with <span className="text-brand-pink italic">Mom's Glow & Glamour</span></h2>
              
              <p className="text-brand-deep/70 text-lg font-light leading-relaxed mb-8">
                Founded with a vision to provide a sanctuary for beauty and self-care, Mom's Glow & Glamour has been a trusted name for over 15 years. We believe that beauty is not just about looks, but about how you feel inside.
              </p>
              
              <p className="text-brand-deep/70 text-lg font-light leading-relaxed mb-10">
                Our team of dedicated professionals uses the finest products and the latest techniques to ensure you leave our salon feeling confident, rejuvenated, and absolutely glamorous.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-pink/10 flex items-center justify-center">
                      <Check size={14} className="text-brand-pink" />
                    </div>
                    <span className="text-brand-deep/80 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-8">
                <button className="bg-brand-pink text-white px-10 py-4 rounded-full font-bold shadow-lg hover:bg-brand-pink/90 transition-colors">
                  Learn Our Methods
                </button>
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm text-brand-deep/40 font-bold uppercase tracking-widest">Call for Inquiry</span>
                  <span className="text-xl font-serif text-brand-deep font-bold">+1 (555) 123-4567</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
