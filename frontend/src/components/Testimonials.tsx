import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sophia Roberts",
    role: "Bride",
    content: "The bridal makeup I received was beyond my expectations. I felt like a princess, and it stayed perfect through all the emotions and dancing!",
    avatar: "https://i.pravatar.cc/150?u=sophia",
  },
  {
    name: "Elena Gilbert",
    role: "Regular Client",
    content: "I've been coming to Mom's Glow & Glamour for 5 years. The consistency and care they provide is unmatched. Highly recommend the facials!",
    avatar: "https://i.pravatar.cc/150?u=elena",
  },
  {
    name: "Marcus Aurelius",
    role: "Executive",
    content: "Professional, clean, and welcoming. Their attention to detail in hair styling is the best in the city. Truly a premium experience.",
    avatar: "https://i.pravatar.cc/150?u=marcus",
  },
  // Adding one more for better marquee flow
  {
    name: "Isabella V.",
    role: "Fashion Model",
    content: "They understand skin like no one else. Every session leaves me camera-ready and glowing!",
    avatar: "https://i.pravatar.cc/150?u=isabella",
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-32 bg-brand-deep text-white relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-brand-pink/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-brand-pink font-bold uppercase tracking-[0.4em] text-xs mb-4 block">Testimonials</span>
          <h2 className="text-5xl md:text-6xl font-serif mb-6 italic">The <span className="text-brand-gold not-italic">Diva</span> Diaries</h2>
        </motion.div>
      </div>

      {/* MARQUEE CONTAINER 
          We use a 'mask-image' style to fade the left and right edges 
      */}
      <div 
        className="relative flex overflow-hidden group"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
        }}
      >
        <motion.div
          className="flex gap-8 py-4 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }} // Only need to move halfway if the list is doubled
          transition={{
            duration: 35, // Adjust for speed
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {/* Double the content to ensure it never gaps */}
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div
              key={index}
              className="w-[450px] bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-md flex flex-col h-full group/card hover:border-brand-pink/30 transition-colors"
            >
              <div className="mb-6 text-brand-gold flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              
              <Quote className="text-brand-pink mb-6 opacity-40 group-hover/card:scale-110 transition-transform" size={32} />
              
              <p className="text-lg font-light leading-relaxed mb-8 italic whitespace-normal text-white/80">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4 border-t border-white/10 pt-8 mt-auto">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-brand-pink/50 group-hover/card:border-brand-pink transition-colors"
                />
                <div className="text-left">
                  <h4 className="font-bold text-white text-base tracking-wide">{testimonial.name}</h4>
                  <span className="text-[10px] uppercase tracking-widest text-brand-gold/60 font-bold">{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Optional: Add a subtle 'Pause on Hover' hint for users */}
      <p className="text-center text-white/20 text-[10px] uppercase tracking-[0.3em] mt-12">
        — Hover to pause —
      </p>
    </section>
  );
};