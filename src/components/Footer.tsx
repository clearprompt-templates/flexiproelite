import { motion } from 'framer-motion';
import { Twitter, Linkedin, Github, Facebook, ArrowUp, Heart } from 'lucide-react';
import { Footer as FooterType, Theme } from '../types/config';

interface FooterProps {
  footer: FooterType;
  theme: Theme;
  brandName: string;
}

const socialIcons: Record<string, typeof Twitter> = {
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  facebook: Facebook,
};

export function Footer({ footer, theme, brandName }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto container-padding py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold">T</span>
                </div>
                <h3 className="text-3xl font-bold text-gradient">
                  {brandName}
                </h3>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
                Empowering businesses with innovative technology solutions. Join thousands of companies transforming their digital future.
              </p>
              
              {/* Newsletter Signup */}
              <div className="flex gap-2 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-primary-500 focus:outline-none text-white placeholder-gray-500 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl font-semibold shadow-lg hover:shadow-glow transition-all"
                >
                  Subscribe
                </motion.button>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                {footer.links.map((link) => (
                  <li key={link.label}>
                    <motion.a
                      href={link.href}
                      className="text-gray-400 hover:text-primary-400 transition-colors inline-flex items-center gap-2 group"
                      whileHover={{ x: 4 }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-lg font-bold mb-6 text-white">Follow Us</h4>
              <div className="flex flex-wrap gap-3">
                {footer.socialMedia.map((social) => {
                  const Icon = socialIcons[social.platform];
                  return Icon ? (
                    <motion.a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 hover:border-primary-500 flex items-center justify-center transition-all group"
                    >
                      <Icon size={20} className="text-gray-400 group-hover:text-primary-400 transition-colors" />
                    </motion.a>
                  ) : null;
                })}
              </div>

              {/* Scroll to Top Button */}
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="mt-8 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg hover:shadow-glow transition-all"
                aria-label="Scroll to top"
              >
                <ArrowUp size={20} />
              </motion.button>
            </motion.div>
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
                &copy; {currentYear} {footer.copyright} Made with <Heart size={14} className="text-red-500" fill="currentColor" /> by TechFlow
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-primary-400 transition-colors">Privacy</a>
                <span className="w-1 h-1 rounded-full bg-gray-700" />
                <a href="#" className="hover:text-primary-400 transition-colors">Terms</a>
                <span className="w-1 h-1 rounded-full bg-gray-700" />
                <a href="#" className="hover:text-primary-400 transition-colors">Sitemap</a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative Bottom Wave */}
        <div className="h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500" />
      </div>
    </footer>
  );
}
