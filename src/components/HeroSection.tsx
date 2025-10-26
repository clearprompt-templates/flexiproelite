import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Rocket } from 'lucide-react';
import { Hero, Theme } from '../types/config';

interface HeroSectionProps {
  hero: Hero;
  theme: Theme;
  uiText: {
    badge: string;
    learnMoreButton: string;
    scrollIndicator: string;
    features: Array<{ icon: string; text: string }>;
  };
}

const iconMap: Record<string, typeof Zap> = {
  zap: Zap,
  sparkles: Sparkles,
  rocket: Rocket,
};

export function HeroSection({ hero, theme, uiText }: HeroSectionProps) {
  const features = uiText.features.map(f => ({
    icon: iconMap[f.icon] || Sparkles,
    text: f.text
  }));

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${hero.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Gradient Overlays - Darker for better text contrast */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${theme.primaryColor}dd 0%, ${theme.secondaryColor}bb 50%, ${theme.primaryColor}dd 100%)`
        }}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl"
          style={{ backgroundColor: `${theme.primaryColor}33` }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: `${theme.secondaryColor}33` }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto container-padding py-32 text-center relative z-10">
        {/* Badge */}
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
              borderColor: 'rgba(255, 255, 255, 0.3)'
            }}
          >
            <span 
              className="text-white text-sm font-semibold flex items-center gap-2"
              style={{
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
              }}
            >
              <Sparkles size={16} style={{ color: '#ffffff', filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))' }} />
              {uiText.badge}
            </span>
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight"
          style={{
            textShadow: '0 4px 12px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3)'
          }}
        >
          {hero.title.split(' ').slice(0, 3).join(' ')}
          <span 
            className="block text-gradient mt-2"
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5))'
            }}
          >
            {hero.title.split(' ').slice(3).join(' ')}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto leading-relaxed"
          style={{
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.6), 0 1px 3px rgba(0, 0, 0, 0.4)',
            opacity: 0.95
          }}
        >
          {hero.subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <motion.a
            href={hero.ctaLink}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group px-8 py-4 rounded-xl font-bold text-white shadow-2xl flex items-center gap-2"
            style={{
              background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.secondaryColor})`,
              boxShadow: `0 25px 50px -12px ${theme.primaryColor}80`
            }}
          >
            {hero.ctaText}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </motion.a>
          <motion.a
            href="#about"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl font-bold text-white glass-dark border border-white/30 hover:border-white/50 transition-all"
          >
            {uiText.learnMoreButton}
          </motion.a>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-wrap gap-6 justify-center"
        >
          {features.map((feature, index) => (
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
                borderColor: 'rgba(255, 255, 255, 0.25)'
              }}
            >
              <feature.icon size={18} style={{ color: '#ffffff', filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.5))' }} />
              <span 
                className="text-white font-semibold"
                style={{
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
                }}
              >
                {feature.text}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
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
          <p className="text-xs text-white/70 mt-2">{uiText.scrollIndicator}</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
