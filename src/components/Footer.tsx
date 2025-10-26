import { motion } from 'framer-motion';
import { Twitter, Linkedin, Github, Facebook, ArrowUp, Heart } from 'lucide-react';
import { Theme, FooterNavigation } from '../types/config';

interface FooterProps {
  navigation: FooterNavigation;
  theme: Theme;
  brandName: string;
}

const socialIcons: Record<string, typeof Twitter> = {
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  facebook: Facebook,
};

export function Footer({ navigation, theme, brandName }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!navigation.enabled) return null;

  // Get different column types
  const brandColumn = navigation.columns.find(col => col.type === 'brand');
  const linksColumn = navigation.columns.find(col => col.type === 'links');
  const socialColumn = navigation.columns.find(col => col.type === 'social');

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Decorations */}
      <div 
        className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: `${theme.primaryColor}1a` }}
      />
      <div 
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: `${theme.secondaryColor}1a` }}
      />

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto container-padding py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            {brandColumn && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                    }}
                  >
                    <span className="text-2xl font-bold">{brandName.charAt(0)}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gradient">
                    {brandName}
                  </h3>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
                  {brandColumn.content}
                </p>
                
                {/* Newsletter Signup */}
                {navigation.newsletter.enabled && (
                  <div className="flex gap-2 max-w-md">
                    <input
                      type="email"
                      placeholder={navigation.newsletter.placeholder}
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none text-white placeholder-gray-500 transition-all"
                      style={{
                        borderColor: '#374151'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = theme.primaryColor || '';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#374151';
                      }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-xl font-semibold shadow-lg transition-all"
                      style={{
                        background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.secondaryColor})`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 40px ${theme.primaryColor}66`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
                      }}
                    >
                      {navigation.newsletter.buttonText}
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Quick Links */}
            {linksColumn && linksColumn.links && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h4 className="text-lg font-bold mb-6 text-white">{linksColumn.heading}</h4>
                <ul className="space-y-3">
                  {linksColumn.links.map((link) => (
                    <li key={link.label}>
                      <motion.a
                        href={link.href}
                        className="text-gray-400 transition-colors inline-flex items-center gap-2 group"
                        style={{ color: '#9ca3af' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = theme.primaryColor || '';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#9ca3af';
                        }}
                        whileHover={{ x: 4 }}
                      >
                        <span 
                          className="w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ backgroundColor: theme.primaryColor }}
                        />
                        {link.label}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Social Media */}
            {socialColumn && socialColumn.socialMedia && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h4 className="text-lg font-bold mb-6 text-white">{socialColumn.heading}</h4>
                <div className="flex flex-wrap gap-3">
                  {socialColumn.socialMedia.map((social) => {
                    const Icon = socialIcons[social.platform];
                    return Icon ? (
                      <motion.a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 rounded-xl bg-gray-800 border flex items-center justify-center transition-all group"
                        style={{ borderColor: '#374151' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = theme.primaryColor || '';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#374151';
                        }}
                      >
                        <Icon 
                          size={20} 
                          className="text-gray-400 group-hover:transition-colors" 
                          style={{ color: '#9ca3af' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = theme.primaryColor || '';
                          }}
                        />
                      </motion.a>
                    ) : null;
                  })}
                </div>

                {/* Scroll to Top Button */}
                <motion.button
                  onClick={scrollToTop}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="mt-8 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 40px ${theme.primaryColor}66`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
                  }}
                  aria-label="Scroll to top"
                >
                  <ArrowUp size={20} />
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="border-t border-gray-800 pt-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm flex items-center gap-2">
                &copy; {currentYear} {navigation.bottomBar.copyrightText} {navigation.bottomBar.customText.madeWith} <Heart size={14} className="text-red-500" fill="currentColor" /> {navigation.bottomBar.customText.by} {brandName}
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                {navigation.bottomBar.links.map((link, index) => (
                  <>
                    {index > 0 && <span key={`dot-${index}`} className="w-1 h-1 rounded-full bg-gray-700" />}
                    <a 
                      key={link} 
                      href="#" 
                      className="transition-colors"
                      style={{ color: '#9ca3af' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = theme.primaryColor || '';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#9ca3af';
                      }}
                    >
                      {link}
                    </a>
                  </>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative Bottom Wave */}
        <div 
          className="h-1"
          style={{
            background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.secondaryColor}, ${theme.primaryColor})`
          }}
        />
      </div>
    </footer>
  );
}
