import { motion } from 'framer-motion';
import { About as AboutType, Theme } from '../types/config';

interface AboutProps {
  about: AboutType;
  theme: Theme;
}

export function About({ about, theme }: AboutProps) {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ color: theme.textColor }}
            >
              {about.title}
            </h2>

            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {about.description}
            </p>

            <div
              className="border-l-4 pl-6 py-4"
              style={{ borderColor: theme.primaryColor }}
            >
              <h3
                className="text-2xl font-semibold mb-3"
                style={{ color: theme.primaryColor }}
              >
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {about.mission}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={about.image}
                alt={about.title}
                className="w-full h-auto object-cover"
              />
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                }}
              />
            </div>

            <motion.div
              className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full opacity-20"
              style={{ backgroundColor: theme.accentColor }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
