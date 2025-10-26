import { motion } from 'framer-motion';
import { Target, Users, TrendingUp, Award } from 'lucide-react';
import { About as AboutType, Theme } from '../types/config';

interface AboutProps {
  about: AboutType;
  theme: Theme;
}

export function About({ about, theme }: AboutProps) {
  const stats = [
    { icon: Users, label: 'Happy Clients', value: '10,000+' },
    { icon: TrendingUp, label: 'Growth Rate', value: '250%' },
    { icon: Award, label: 'Awards Won', value: '50+' },
  ];

  return (
    <section id="about" className="section-padding bg-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-30 -z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-100 rounded-full blur-3xl opacity-30 -z-0" />

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
              <span className="px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 rounded-full text-sm font-semibold">
                About Us
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-gradient">
              {about.title}
            </h2>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {about.description}
            </p>

            {/* Mission Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6 border border-primary-100 mb-8"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <Target size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">
                    Our Mission
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {about.mission}
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full blur-2xl opacity-20" />
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
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary-500" />
                  <div className="text-2xl font-bold text-gradient mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-600 font-semibold">
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
                  src={about.image}
                  alt={about.title}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20" />
              </motion.div>

              {/* Floating Decorative Elements */}
              <motion.div
                className="absolute -top-6 -right-6 w-40 h-40 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-3xl opacity-20 blur-2xl"
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
                className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-secondary-400 to-primary-400 rounded-2xl opacity-20 blur-2xl"
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
                <div className="text-5xl font-bold text-gradient mb-1">10+</div>
                <div className="text-sm font-semibold text-gray-600">Years Experience</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
