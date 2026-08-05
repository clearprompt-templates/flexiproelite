'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { getIcon } from '@/lib/icon-map';
import { useThemeColors } from '@/lib/use-theme-colors';
import { getContactApiUrl } from '@/lib/api-config';
import { UI_DEFAULTS } from '@/lib/site-ui-defaults';
import type { ContactContent } from '@/lib/site-data';

function buildContactPayload(
  fields: Array<{ name: string }> | undefined,
  data: Record<string, string>
): Record<string, string> {
  const payload: Record<string, string> = {};
  for (const field of fields ?? []) {
    const v = (data[field.name] ?? '').trim();
    if (v) payload[field.name] = v;
  }
  return payload;
}

function resolveColor(
  color: ContactContent['contactInfo'][0]['color'],
  fallbackFrom: string,
  fallbackTo: string
) {
  if (color && typeof color === 'object' && 'from' in color) {
    return { from: color.from, to: color.to };
  }
  return { from: fallbackFrom, to: fallbackTo };
}

export function ContactSection({ content }: { content: ContactContent }) {
  const colors = useThemeColors();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const MessageIcon = getIcon('messageCircle');
  const formEnabled = content.form?.enabled;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEnabled) return;
    setSubmitError(null);
    setIsSubmitting(true);
    const payload = buildContactPayload(content.form?.fields, formData);

    try {
      const res = await fetch(getContactApiUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        let detail = text;
        try {
          const json = JSON.parse(text) as { message?: string; error?: string };
          detail = json.message || json.error || text;
        } catch {
          /* use raw text */
        }
        throw new Error(detail || `Request failed (${res.status})`);
      }
      setSubmitted(true);
      setFormData({});
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : UI_DEFAULTS.contactErrorFallback);
    } finally {
      setIsSubmitting(false);
    }
  };

  const emailHref =
    content.contactInfo.find((item) => item.type === 'email')?.href ||
    `mailto:${content.contactInfo.find((item) => item.type === 'email')?.value || ''}`;

  return (
    <section
      id="contact"
      className="section-padding bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
    >
      <div
        className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: `${colors.primary}33` }}
      />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: `${colors.secondary}33` }}
      />

      <div className="container mx-auto container-padding relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          {content.badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
              style={{
                background: `linear-gradient(to right, ${colors.primary}1a, ${colors.secondary}1a)`,
                color: colors.primary,
              }}
            >
              <MessageIcon size={16} />
              {content.badge}
            </motion.div>
          )}
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-gradient">
            {content.heading}
          </h2>
          <p
            className="text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: colors.subtext }}
          >
            {content.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {content.contactInfo.map((item, index) => {
            const Icon = getIcon(item.icon);
            const itemColor = resolveColor(item.color, colors.primary, colors.secondary);
            return (
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
                  className="relative bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100 transition-all h-full"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${itemColor.from}, ${itemColor.to})`,
                    }}
                  >
                    <Icon size={36} className="text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
                    {item.label}
                  </h3>

                  {item.href ? (
                    <a
                      href={item.href}
                      className="font-medium break-words transition-colors hover:text-[var(--primary-color)]"
                      style={{ color: colors.subtext }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-medium leading-relaxed" style={{ color: colors.subtext }}>
                      {item.value}
                    </p>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {formEnabled && content.form && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 max-w-2xl mx-auto"
          >
            {submitted ? (
              <div className="rounded-3xl bg-white p-10 text-center shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
                  {content.form.successTitle || UI_DEFAULTS.contactSuccessTitle}
                </h3>
                <p style={{ color: colors.subtext }}>
                  {content.form.successDescription || UI_DEFAULTS.contactSuccessDescription}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-3xl bg-white p-8 md:p-10 shadow-xl border border-gray-100 space-y-5"
              >
                {content.form.fields.map((field) => (
                  <div key={field.name}>
                    <label
                      htmlFor={field.name}
                      className="block text-sm font-semibold mb-2"
                      style={{ color: colors.text }}
                    >
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.name}
                        name={field.name}
                        required={field.required}
                        rows={4}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
                        }
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    ) : (
                      <input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
                        }
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    )}
                  </div>
                ))}
                {submitError && <p className="text-sm text-destructive">{submitError}</p>}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-xl py-4 font-bold text-white shadow-lg disabled:opacity-70"
                  style={{
                    background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                  }}
                >
                  {isSubmitting ? UI_DEFAULTS.contactSubmittingLabel : content.form.submitLabel}
                </motion.button>
              </form>
            )}
          </motion.div>
        )}

        {content.cta && !formEnabled && (
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
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              }}
            >
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {content.cta.heading}
                </h3>
                <p className="text-lg text-white/90 mb-8">{content.cta.description}</p>
                <motion.a
                  href={content.cta.button.href || emailHref}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white rounded-xl font-bold shadow-2xl transition-all"
                  style={{ color: colors.primary }}
                >
                  {content.cta.button.text || content.cta.button.label}
                  {(() => {
                    const CTAIcon = getIcon(content.cta.button.icon || 'send');
                    return <CTAIcon size={20} />;
                  })()}
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
