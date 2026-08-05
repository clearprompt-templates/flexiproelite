'use client';

import { motion } from 'framer-motion';
import { getIcon } from '@/lib/icon-map';
import { useThemeColors } from '@/lib/use-theme-colors';
import type { CardGridContent } from '@/lib/site-data';

export function CardGridSection({ content }: { content: CardGridContent }) {
  const colors = useThemeColors();
  const settings = content.settings ?? {};
  const ArrowRight = getIcon('arrowRight');
  const StarIcon = getIcon('star');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
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
          {content.badge && (
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
                  background: `linear-gradient(to right, ${colors.primary}1a, ${colors.secondary}1a)`,
                  color: colors.primary,
                }}
              >
                {content.badge}
              </span>
            </motion.div>
          )}
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-gradient">
            {content.heading}
          </h2>
          {content.description && (
            <p
              className="text-xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: colors.subtext }}
            >
              {content.description}
            </p>
          )}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {(content.items || []).map((card, index) => {
            const isFeatured = card.featured || index === settings.featuredIndex;
            return (
              <motion.div key={card.id} variants={itemVariants} className="group relative">
                <motion.div
                  whileHover={{ y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all h-full flex flex-col"
                >
                  {isFeatured && (
                    <div className="absolute top-4 right-4 z-10">
                      <div
                        className="text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                        style={{
                          background: `linear-gradient(to right, ${colors.secondary}, ${colors.primary})`,
                        }}
                      >
                        <StarIcon size={12} fill="currentColor" />
                        {content.labels?.featuredBadge || 'Featured'}
                      </div>
                    </div>
                  )}

                  {card.media?.url && (
                    <div className="relative h-56 overflow-hidden">
                      <motion.img
                        src={card.media.url}
                        alt={card.media.alt || card.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-2xl font-bold mb-3" style={{ color: colors.text }}>
                      {card.title}
                    </h3>

                    {card.subtitle && (
                      <p className="text-sm mb-2 font-medium" style={{ color: colors.muted }}>
                        {card.subtitle}
                      </p>
                    )}

                    <p
                      className="mb-4 leading-relaxed line-clamp-3"
                      style={{ color: colors.subtext }}
                    >
                      {card.description}
                    </p>

                    {card.tags && card.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {card.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: `${colors.primary}12`,
                              color: colors.primary,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                      {card.metadata?.value && (
                        <div>
                          {content.labels?.metadataLabel && (
                            <p className="text-xs" style={{ color: colors.muted }}>
                              {content.labels.metadataLabel}
                            </p>
                          )}
                          <p className="font-bold" style={{ color: colors.primary }}>
                            {card.metadata.value}
                          </p>
                        </div>
                      )}
                      {card.cta && (
                        <motion.a
                          href={card.cta.href}
                          whileHover={{ x: 4 }}
                          className="inline-flex items-center gap-1 text-sm font-semibold"
                          style={{ color: colors.primary }}
                        >
                          {card.cta.text || card.cta.label}
                          <ArrowRight size={16} />
                        </motion.a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {content.footer && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-center mt-16"
          >
            <p className="mb-6" style={{ color: colors.subtext }}>
              {content.footer.text}
            </p>
            <motion.a
              href={content.footer.cta.href}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold border-2 transition-all"
              style={{
                borderColor: colors.primary,
                color: colors.primary,
              }}
            >
              {content.footer.cta.text || content.footer.cta.label}
              <ArrowRight size={20} />
            </motion.a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
