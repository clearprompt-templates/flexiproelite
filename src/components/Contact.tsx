import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { Theme, ContactSection as ContactSectionType } from "../types/config";

interface ContactProps {
  section: ContactSectionType;
  theme: Theme;
}

const iconMap: Record<string, typeof Mail> = {
  mail: Mail,
  phone: Phone,
  mapPin: MapPin,
  send: Send,
  messageCircle: MessageCircle,
};

export function Contact({ section, theme }: ContactProps) {
  const { content } = section;

  const contactInfo = content.contactInfo.map((item) => ({
    ...item,
    icon: iconMap[item.icon] || Mail,
    // Ensure color is set with defaults
    color: item.color || {
      from: theme.primaryColor || "#1A1A2E",
      to: theme.secondaryColor || "#16213E",
    },
  }));

  const CTAIcon = content.cta ? iconMap[content.cta.button.icon] || Send : Send;

  return (
    <section
      id="contact"
      className="section-padding bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
    >
      {/* Background Decorations */}
      <div
        className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: `${theme.primaryColor}33` }}
      />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: `${theme.secondaryColor}33` }}
      />

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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            style={{
              background: `linear-gradient(to right, ${theme.primaryColor}1a, ${theme.secondaryColor}1a)`,
              color: theme.primaryColor,
            }}
          >
            <MessageCircle size={16} />
            {content.badge}
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-gradient">
            {content.heading}
          </h2>
          <p
            className="text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: `${theme.textColor}cc` }}
          >
            {content.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {contactInfo.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative"
            >
              <motion.div
                whileHover={{ y: -12 }}
                transition={{ duration: 0.3 }}
                className="relative bg-white rounded-3xl shadow-xl p-8 text-center border transition-all h-full"
                style={{ borderColor: "#f3f4f6" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${theme.primaryColor}33`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#f3f4f6";
                }}
              >
                {/* Icon Container */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${item.color.from}, ${item.color.to})`,
                  }}
                >
                  <item.icon size={36} className="text-white" />
                </motion.div>

                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ color: theme.textColor }}
                >
                  {item.label}
                </h3>

                {item.href ? (
                  <motion.a
                    href={item.href}
                    whileHover={{ scale: 1.05 }}
                    className="font-medium break-words transition-colors"
                    style={{ color: `${theme.textColor}99` }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = theme.primaryColor || "";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = `${theme.textColor}99`;
                    }}
                  >
                    {item.value}
                  </motion.a>
                ) : (
                  <p
                    className="font-medium leading-relaxed"
                    style={{ color: `${theme.textColor}99` }}
                  >
                    {item.value}
                  </p>
                )}

                {/* Decorative Corner */}
                <div
                  className="absolute top-4 right-4 w-16 h-16 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primaryColor}1a, ${theme.secondaryColor}1a)`,
                  }}
                />
              </motion.div>

              {/* Glow Effect on Hover */}
              <motion.div
                className="absolute -inset-2 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl -z-10 transition-opacity"
                style={{
                  background: `linear-gradient(to right, ${item.color.from}, ${item.color.to})`,
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.2 }}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        {content.cta && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-20 text-center"
          >
            <div
              className="max-w-3xl mx-auto rounded-3xl p-12 shadow-2xl relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
              }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-2xl" />
                <div className="absolute bottom-0 right-0 w-56 h-56 bg-white rounded-full blur-3xl" />
              </div>

              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {content.cta.heading}
                </h3>
                <p className="text-lg text-white/90 mb-8">
                  {content.cta.description}
                </p>
                <motion.a
                  href={
                    content.cta.button.href ||
                    `mailto:${
                      content.contactInfo.find((item) => item.type === "email")
                        ?.value || ""
                    }`
                  }
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white rounded-xl font-bold shadow-2xl transition-all"
                  style={{ color: theme.primaryColor }}
                  onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 0 40px ${theme.primaryColor}66`;
                  }}
                  onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                      "0 25px 50px -12px rgba(0,0,0,0.25)";
                  }}
                >
                  {content.cta.button.text}
                  <CTAIcon size={20} />
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
