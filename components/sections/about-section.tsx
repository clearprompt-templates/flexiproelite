'use client'

import { motion } from 'framer-motion'
import { getIcon } from '@/lib/icon-map'
import { useThemeColors } from '@/lib/use-theme-colors'
import type { AboutContent } from '@/lib/site-data'

export function AboutSection({ content }: { content: AboutContent }) {
  const colors = useThemeColors()
  const mission = content.mission
  const MissionIcon = getIcon(mission?.icon || 'target')

  return (
    <section id={content.sectionId} className="section-padding bg-white relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-30 -z-0"
        style={{ backgroundColor: `${colors.primary}1a` }}
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-30 -z-0"
        style={{ backgroundColor: `${colors.secondary}1a` }}
      />

      <div className="container mx-auto container-padding relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {content.badge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-6"
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

            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-gradient">{content.heading}</h2>

            <p className="text-lg mb-8 leading-relaxed" style={{ color: colors.subtext }}>
              {content.description}
            </p>

            {mission && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative rounded-2xl p-6 border mb-8"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}0d, ${colors.secondary}0d)`,
                  borderColor: `${colors.primary}1a`,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    }}
                  >
                    <MissionIcon size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3" style={{ color: colors.text }}>
                      {mission.heading}
                    </h3>
                    <p className="leading-relaxed" style={{ color: colors.subtext }}>
                      {mission.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-3 gap-4">
              {content.stats.map((stat, index) => {
                const Icon = getIcon(stat.icon || 'users')
                return (
                  <motion.div
                    key={stat.id || stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="text-center p-4 bg-white rounded-xl shadow-lg border border-gray-100"
                  >
                    <Icon className="w-8 h-8 mx-auto mb-2" style={{ color: colors.primary }} />
                    <div className="text-2xl font-bold text-gradient mb-1">{stat.value}</div>
                    <div className="text-xs font-semibold" style={{ color: colors.muted }}>
                      {stat.label}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {content.image && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative overflow-hidden rounded-3xl shadow-2xl"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={content.image.url}
                    alt={content.image.alt}
                    className="w-full h-auto object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}33, ${colors.secondary}33)`,
                    }}
                  />
                </motion.div>

                {content.experience?.years && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="absolute bottom-8 left-8 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100"
                  >
                    <div className="text-5xl font-bold text-gradient mb-1">
                      {content.experience.years}
                    </div>
                    <div className="text-sm font-semibold" style={{ color: colors.muted }}>
                      {content.experience.label}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
