import { motion } from 'framer-motion';
import { Target, Users, TrendingUp, Award } from 'lucide-react';
import { Theme, AboutSection as AboutSectionType } from '../types/config';

interface AboutProps {
  section: AboutSectionType;
  theme: Theme;
}

const iconMap: Record<string, typeof Users> = {
  users: Users,
  trending: TrendingUp,
  award: Award,
  target: Target,
};

export function About({ section, theme }: AboutProps) {
  const { content } = section;
  
  const stats = content.stats.map(stat => ({
    icon: iconMap[stat.icon] || Users,
    label: stat.label,
    value: stat.value,
  }));

  const MissionIcon = iconMap[content.mission.icon] || Target;

  return (
    <section id="about" className="section-padding bg-white relative overflow-hidden">
      {/* Background Decorations */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-30 -z-0"
        style={{ backgroundColor: `${theme.primaryColor}1a` }}
      />
      <div 
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-30 -z-0"
        style={{ backgroundColor: `${theme.secondaryColor}1a` }}
      />

      <div className="container mx-auto container-padding relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
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

            <p className="text-lg mb-8 leading-relaxed" style={{ color: `${theme.textColor}cc` }}>
              {content.description}
            </p>

            {/* Mission Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative rounded-2xl p-6 border mb-8"
              style={{
                background: `linear-gradient(135deg, ${theme.primaryColor}0d, ${theme.secondaryColor}0d)`,
                borderColor: `${theme.primaryColor}1a`
              }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                  }}
                >
                  <MissionIcon size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: theme.textColor }}>
                    {content.mission.heading}
                  </h3>
                  <p className="leading-relaxed" style={{ color: `${theme.textColor}b3` }}>
                    {content.mission.text}
                  </p>
                </div>
              </div>
              <div 
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20"
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                }}
              />
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="text-center p-4 bg-white rounded-xl shadow-lg border border-gray-100"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-2" style={{ color: theme.primaryColor }} />
                  <div className="text-2xl font-bold text-gradient mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold" style={{ color: `${theme.textColor}99` }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Image Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative overflow-hidden rounded-3xl shadow-2xl"
              >
                <img
                  src={content.image.url}
                  alt={content.image.alt}
                  className="w-full h-auto object-cover"
                />
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primaryColor}33, ${theme.secondaryColor}33)`
                  }}
                />
              </motion.div>

              {/* Floating Decorative Elements */}
              <motion.div
                className="absolute -top-6 -right-6 w-40 h-40 rounded-3xl opacity-20 blur-2xl"
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 w-32 h-32 rounded-2xl opacity-20 blur-2xl"
                style={{
                  background: `linear-gradient(135deg, ${theme.secondaryColor}, ${theme.primaryColor})`
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, -90, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Experience Badge */}
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
                <div className="text-sm font-semibold" style={{ color: `${theme.textColor}99` }}>
                  {content.experience.label}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
