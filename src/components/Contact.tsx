import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Contact as ContactType, Theme } from '../types/config';

interface ContactProps {
  contact: ContactType;
  theme: Theme;
}

export function Contact({ contact, theme }: ContactProps) {
  const contactInfo = [
    { icon: Mail, label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
    { icon: Phone, label: 'Phone', value: contact.phone, href: `tel:${contact.phone}` },
    { icon: MapPin, label: 'Address', value: contact.address, href: null },
  ];

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: theme.textColor }}
          >
            {contact.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {contact.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {contactInfo.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-xl shadow-lg p-8 text-center transition-shadow hover:shadow-2xl"
            >
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{ backgroundColor: `${theme.primaryColor}20` }}
              >
                <item.icon size={32} style={{ color: theme.primaryColor }} />
              </div>

              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: theme.textColor }}
              >
                {item.label}
              </h3>

              {item.href ? (
                <a
                  href={item.href}
                  className="text-gray-600 hover:opacity-80 transition-opacity"
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
                  {item.value}
                </a>
              ) : (
                <p className="text-gray-600">{item.value}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
