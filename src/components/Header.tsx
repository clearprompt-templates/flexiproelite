import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brand, NavItem, Theme } from '../types/config';

interface HeaderProps {
  brand: Brand;
  navigation: NavItem[];
  theme: Theme;
}

export function Header({ brand, navigation, theme }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3"
          >
            <img
              src={brand.logoUrl}
              alt={`${brand.name} Logo`}
              className="h-12 w-auto object-contain"
            />
            <div>
              <h1 className="text-xl font-bold" style={{ color: theme.primaryColor }}>
                {brand.name}
              </h1>
              <p className="text-xs text-gray-600">{brand.tagline}</p>
            </div>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-gray-700 hover:opacity-80 transition-opacity font-medium"
                style={{
                  color: theme.textColor,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.primaryColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.textColor;
                }}
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={24} style={{ color: theme.primaryColor }} />
            ) : (
              <Menu size={24} style={{ color: theme.primaryColor }} />
            )}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 pb-4"
            >
              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block py-2 text-gray-700 hover:opacity-80 transition-opacity"
                  style={{ color: theme.textColor }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
