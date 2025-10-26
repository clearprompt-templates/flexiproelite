import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Theme, CardGridSection } from '../types/config';

interface CardGridProps {
  section: CardGridSection;
  theme: Theme;
}

export function CardGrid({ section, theme }: CardGridProps) {
  const { content, settings } = section;
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="cards" className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <span 
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                background: `linear-gradient(to right, ${theme.primaryColor}1a, ${theme.secondaryColor}1a)`,
                color: theme.primaryColor
              }}
            >
              {content.badge}
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-gradient">
            {content.heading}
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: `${theme.textColor}cc` }}>
            {content.description}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {content.items.map((card, index) => (
            <motion.div
              key={card.id}
              variants={itemVariants}
              className="group relative"
            >
              <motion.div
                whileHover={{ y: -12 }}
                transition={{ duration: 0.3 }}
                className="relative bg-white rounded-2xl shadow-xl overflow-hidden border transition-all h-full"
                style={{ 
                  borderColor: '#f3f4f6'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${theme.primaryColor}33`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#f3f4f6';
                }}
              >
                {/* Featured Badge */}
                {(card.featured || index === settings.featuredIndex) && (
                  <div className="absolute top-4 right-4 z-10">
                    <div 
                      className="text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                      style={{
                        background: `linear-gradient(to right, ${theme.secondaryColor}, ${theme.primaryColor})`
                      }}
                    >
                      <Star size={12} fill="currentColor" />
                      {content.labels?.featuredBadge || 'Featured'}
                    </div>
                  </div>
                )}

                {/* Media */}
                <div className="relative h-56 overflow-hidden">
                  <motion.img
                    src={card.media.url}
                    alt={card.media.alt}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 
                    className="text-2xl font-bold mb-3 transition-all"
                    style={{ color: theme.textColor }}
                  >
                    {card.title}
                  </h3>

                  {card.subtitle && (
                    <p className="text-sm mb-2 font-medium" style={{ color: `${theme.textColor}80` }}>
                      {card.subtitle}
                    </p>
                  )}

                  <p className="mb-6 leading-relaxed line-clamp-3" style={{ color: `${theme.textColor}99` }}>
                    {card.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    {card.metadata && Object.keys(card.metadata).length > 0 && (
                      <div>
                        {content.labels?.metadataLabel && (
                          <p className="text-xs mb-1" style={{ color: `${theme.textColor}80` }}>
                            {content.labels.metadataLabel}
                          </p>
                        )}
                        <span className="text-3xl font-bold text-gradient">
                          {Object.values(card.metadata).find(val => val !== undefined && val !== null) || ''}
                        </span>
                      </div>
                    )}

                    {card.cta && (
                      <motion.a
                        href={card.cta.href}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-lg group/btn"
                        style={{
                          background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.secondaryColor})`,
                          boxShadow: `0 10px 15px -3px ${theme.primaryColor}30`
                        }}
                      >
                        <span className="hidden sm:inline">{card.cta.text}</span>
                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                      </motion.a>
                    )}
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div 
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      boxShadow: `0 0 40px ${theme.primaryColor}66`
                    }}
                  />
                </div>
              </motion.div>

              {/* Background Gradient Decoration */}
              <motion.div
                className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl -z-10 transition-opacity"
                style={{
                  background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.secondaryColor})`
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.2 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        {content.footer && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-center mt-16"
          >
            <p className="mb-6" style={{ color: `${theme.textColor}99` }}>
              {content.footer.text}
            </p>
            <motion.a
              href={content.footer.cta.href}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold border-2 transition-all"
              style={{
                borderColor: theme.primaryColor,
                color: theme.primaryColor
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${theme.primaryColor}0d`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {content.footer.cta.text}
              <ArrowRight size={20} />
            </motion.a>
          </motion.div>
        )}
      </div>
    </section>
  );
}

