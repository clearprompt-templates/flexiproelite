'use client'

import { motion } from 'framer-motion'
import { getIcon } from '@/lib/icon-map'
import { useThemeColors } from '@/lib/use-theme-colors'
import type { HeroContent } from '@/lib/site-data'

export function HeroSection({ content }: { content: HeroContent }) {
  const colors = useThemeColors()
  const settings = content.settings ?? {}
  const headingText = content.heading?.text || content.headline || ''
  const titleWords = headingText.split(' ')
  const splitAt = content.heading?.splitAt ?? 3
  const firstPart = titleWords.slice(0, splitAt).join(' ')
  const secondPart = titleWords.slice(splitAt).join(' ')
  const ArrowRight = getIcon('arrowRight')
  const SparklesIcon = getIcon(content.badge?.icon || 'sparkles')

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20"
      style={{
        backgroundImage: content.backgroundImage?.url
          ? `url(${content.backgroundImage.url})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: settings.parallax ? 'fixed' : 'scroll',
      }}
    >
      {settings.overlay !== false && (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}dd 0%, ${colors.secondary}bb 50%, ${colors.primary}dd 100%)`,
              opacity: settings.overlayOpacity ?? 0.85,
            }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </>
      )}

      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl"
          style={{ backgroundColor: `${colors.primary}33` }}
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: `${colors.secondary}33` }}
          animate={{ scale: [1, 1.3, 1], x: [0, -30, 0], y: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container mx-auto container-padding py-32 px-4 text-center relative z-10">
        {content.badge?.visible !== false && content.badge?.text && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 inline-flex"
          >
            <div
              className="px-6 py-2 rounded-full border"
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
              }}
            >
              <span
                className="text-white text-sm font-semibold flex items-center gap-2"
                style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}
              >
                <SparklesIcon
                  size={16}
                  style={{ color: '#ffffff', filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))' }}
                />
                {content.badge.text}
              </span>
            </div>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-tight md:leading-tight px-4"
          style={{ lineHeight: '1.2' }}
        >
          <span className="block">{firstPart}</span>
          {content.heading?.gradient && secondPart && (
            <span
              className="block text-gradient mt-4 pb-2"
              style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
            >
              {secondPart}
            </span>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto leading-relaxed opacity-95 px-4"
        >
          {content.subheading?.text || content.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <motion.a
            href={content.cta.primary.href}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group px-8 py-4 rounded-xl font-bold text-white shadow-lg flex items-center gap-2"
            style={{
              background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
            }}
          >
            {content.cta.primary.text || content.cta.primary.label}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </motion.a>
          {content.cta.secondary && (
            <motion.a
              href={content.cta.secondary.href}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl font-bold text-white glass-dark border border-white/30 hover:border-white/50 transition-all"
            >
              {content.cta.secondary.text || content.cta.secondary.label}
            </motion.a>
          )}
        </motion.div>

        {content.features && content.features.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap gap-6 justify-center"
          >
            {content.features.map((feature, index) => {
              const Icon = getIcon(feature.icon)
              return (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border"
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    borderColor: 'rgba(255, 255, 255, 0.25)',
                  }}
                >
                  <Icon size={18} style={{ color: '#ffffff' }} />
                  <span className="text-white font-semibold">{feature.text}</span>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>

      {content.scrollIndicator?.visible !== false && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white text-center"
          >
            <div className="w-6 h-10 border-2 border-white/50 rounded-full mx-auto flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-white rounded-full"
              />
            </div>
            {content.scrollIndicator?.text && (
              <p className="text-xs text-white/70 mt-2">{content.scrollIndicator.text}</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
