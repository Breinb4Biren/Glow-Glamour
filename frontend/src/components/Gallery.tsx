import { motion } from "framer-motion";

const galleryImages = [
  {
    url: "https://images.unsplash.com/photo-1522337621169-4236b604d94a?q=80&w=2082&auto=format&fit=crop",
    title: "Bridal Preparation",
    size: "large"
  },
  {
    url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2070&auto=format&fit=crop",
    title: "Hair Styling",
    size: "small"
  },
  {
    url: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070&auto=format&fit=crop",
    title: "Skincare Ritual",
    size: "small"
  },
  {
    url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071&auto=format&fit=crop",
    title: "Glamour Makeup",
    size: "medium"
  },
  {
    url: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=2070&auto=format&fit=crop",
    title: "Luxe Spa",
    size: "medium"
  },
];

export const Gallery = () => {
  return (
    <section id="gallery" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-brand-pink font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Visual Experience</span>
            <h2 className="text-4xl md:text-5xl font-serif text-brand-deep mb-6">Our Glamour Gallery</h2>
            <div className="h-1 w-24 bg-brand-pink mx-auto rounded-full" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[1000px] md:h-[600px]">
          {galleryImages.map((image, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative group overflow-hidden rounded-3xl ${
                image.size === 'large' ? 'md:col-span-2 md:row-span-2' : 
                image.size === 'medium' ? 'md:col-span-2' : 'md:col-span-1'
              }`}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                <div>
                  <h4 className="text-white font-serif text-xl mb-1">{image.title}</h4>
                  <p className="text-white/70 text-sm uppercase tracking-widest font-bold">Glow & Glamour Studio</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
