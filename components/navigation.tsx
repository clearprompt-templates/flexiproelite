'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from '@/components/logo'
import { useSiteData } from '@/components/site-data-provider'
import { useThemeColors } from '@/lib/use-theme-colors'
import { getIcon } from '@/lib/icon-map'
import { UI_DEFAULTS } from '@/lib/site-ui-defaults'

export function Navigation() {
  const { data } = useSiteData()
  const colors = useThemeColors()
  const navigation = data.navigation.header
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const MenuIcon = getIcon('menu')
  const CloseIcon = getIcon('x')
  const SparklesIcon = getIcon('sparkles')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!navigation.enabled) return null

  const positionClass =
    navigation.position === 'fixed'
      ? 'fixed'
      : navigation.position === 'sticky'
        ? 'sticky'
        : 'relative'

  const logoHref = navigation.logoHref || '#home'

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`${positionClass} top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg border-b border-white/20' : ''
      }`}
      style={
        !scrolled && navigation.style === 'transparent'
          ? {
              background:
                'linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3), transparent)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }
          : undefined
      }
    >
      <nav className="container mx-auto container-padding py-4">
        <div className="flex items-center justify-between">
          <motion.a
            href={logoHref}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-3 group"
          >
            <div className="relative">
              <Logo
                className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                textColor={scrolled ? colors.text : '#ffffff'}
              />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <SparklesIcon size={16} style={{ color: colors.secondary }} />
              </motion.div>
            </div>
          </motion.a>

          <div className="hidden md:flex items-center space-x-1">
            {navigation.items.map((item, index) => (
              <motion.a
                key={item.id}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative px-4 py-2 font-semibold rounded-lg overflow-hidden group"
                style={{ color: scrolled ? colors.text : '#ffffff' }}
              >
                <span className="relative z-10 group-hover:text-white transition-colors">
                  {item.label}
                </span>
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                  }}
                />
              </motion.a>
            ))}
            {navigation.cta.enabled && (
              <motion.a
                href={navigation.cta.href}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-4 px-6 py-2.5 rounded-lg font-semibold text-white shadow-lg"
                style={{
                  background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                  boxShadow: `0 10px 15px -3px ${colors.primary}30`,
                }}
              >
                {navigation.cta.label}
              </motion.a>
            )}
          </div>

          <motion.button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={
              mobileMenuOpen
                ? UI_DEFAULTS.mobileMenu.closeAriaLabel
                : UI_DEFAULTS.mobileMenu.openAriaLabel
            }
            whileTap={{ scale: 0.9 }}
            style={{
              backgroundColor: scrolled ? `${colors.primary}15` : 'rgba(255,255,255,0.2)',
            }}
          >
            {mobileMenuOpen ? (
              <CloseIcon size={24} style={{ color: scrolled ? colors.primary : '#ffffff' }} />
            ) : (
              <MenuIcon size={24} style={{ color: scrolled ? colors.primary : '#ffffff' }} />
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 glass rounded-lg overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {navigation.items.map((item) => (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    className="block py-3 px-4 rounded-lg font-semibold transition-all"
                    style={{ color: colors.text }}
                    onClick={() => setMobileMenuOpen(false)}
                    whileHover={{ x: 4 }}
                  >
                    {item.label}
                  </motion.a>
                ))}
                {navigation.cta.enabled && (
                  <motion.a
                    href={navigation.cta.href}
                    className="block py-3 px-4 rounded-lg font-semibold text-white text-center shadow-lg"
                    style={{
                      background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {navigation.cta.label}
                  </motion.a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
