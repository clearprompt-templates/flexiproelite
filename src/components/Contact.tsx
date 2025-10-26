import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { Contact as ContactType, Theme } from '../types/config';

interface ContactProps {
  contact: ContactType;
  theme: Theme;
}

export function Contact({ contact, theme }: ContactProps) {
  const contactInfo = [
    { icon: Mail, label: 'Email', value: contact.email, href: `mailto:${contact.email}`, color: 'from-blue-500 to-cyan-500' },
    { icon: Phone, label: 'Phone', value: contact.phone, href: `tel:${contact.phone}`, color: 'from-green-500 to-emerald-500' },
    { icon: MapPin, label: 'Address', value: contact.address, href: null, color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <section id="contact" className="section-padding bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200 rounded-full blur-3xl opacity-20" />

      <div className="container mx-auto container-padding relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 rounded-full text-sm font-semibold mb-6"
          >
            <MessageCircle size={16} />
            Contact Us
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-gradient">
            {contact.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {contact.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {contactInfo.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative"
            >
              <motion.div
                whileHover={{ y: -12 }}
                transition={{ duration: 0.3 }}
                className="relative bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100 hover:border-primary-200 h-full"
              >
                {/* Icon Container */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 bg-gradient-to-br ${item.color} shadow-lg`}
                >
                  <item.icon size={36} className="text-white" />
                </motion.div>

                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  {item.label}
                </h3>

                {item.href ? (
                  <motion.a
                    href={item.href}
                    whileHover={{ scale: 1.05 }}
                    className="text-gray-600 hover:text-primary-600 transition-colors font-medium break-words"
                  >
                    {item.value}
                  </motion.a>
                ) : (
                  <p className="text-gray-600 font-medium leading-relaxed">
                    {item.value}
                  </p>
                )}

                {/* Decorative Corner */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
              </motion.div>

              {/* Glow Effect on Hover */}
              <motion.div
                className={`absolute -inset-2 bg-gradient-to-r ${item.color} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl -z-10 transition-opacity`}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.2 }}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 text-center"
        >
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-2xl" />
              <div className="absolute bottom-0 right-0 w-56 h-56 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-lg text-white/90 mb-8">
                Let's discuss how we can help transform your business
              </p>
              <motion.a
                href={`mailto:${contact.email}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-bold shadow-2xl hover:shadow-glow transition-all"
              >
                Send us a Message
                <Send size={20} />
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
