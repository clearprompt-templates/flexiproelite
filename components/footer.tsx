'use client'

import { motion } from 'framer-motion'
import { useSiteData } from '@/components/site-data-provider'
import { globalFieldAttrs, jsonPath, shouldBlockPreviewNavigation } from '@/lib/cp-edit'
import { useThemeColors } from '@/lib/use-theme-colors'
import { getIcon } from '@/lib/icon-map'
import { UI_DEFAULTS } from '@/lib/site-ui-defaults'

export function Footer() {
  const { data } = useSiteData()
  const colors = useThemeColors()
  const navigation = data.navigation.footer
  const brandName = data.siteConfig.brand.name
  const currentYear = new Date().getFullYear()
  const HeartIcon = getIcon('heart')
  const ArrowUpIcon = getIcon('arrowUp')

  if (!navigation.enabled) return null

  const brandColIdx = navigation.columns.findIndex((col) => col.type === 'brand')
  const linksColIdx = navigation.columns.findIndex((col) => col.type === 'links')
  const socialColIdx = navigation.columns.findIndex((col) => col.type === 'social')
  const brandColumn = brandColIdx >= 0 ? navigation.columns[brandColIdx] : undefined
  const linksColumn = linksColIdx >= 0 ? navigation.columns[linksColIdx] : undefined
  const socialColumn = socialColIdx >= 0 ? navigation.columns[socialColIdx] : undefined

  const copyrightText = navigation.bottomBar.copyrightText.replace('{year}', String(currentYear))

  const bottomLinks = (navigation.bottomBar.links || []).map((link) =>
    typeof link === 'string' ? { label: link, href: '#' } : link,
  )

  const scrollToTop = () => {
    if (shouldBlockPreviewNavigation()) return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleHashClick = (e: React.MouseEvent) => {
    if (shouldBlockPreviewNavigation()) e.preventDefault()
  }

  const newsletterSubmitLabel =
    navigation.newsletter.buttonText || navigation.newsletter.submitLabel
  const newsletterSubmitPath = navigation.newsletter.buttonText
    ? jsonPath('navigation', 'footer', 'newsletter', 'buttonText')
    : jsonPath('navigation', 'footer', 'newsletter', 'submitLabel')

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: `${colors.primary}1a` }}
        data-cp-decorative=""
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: `${colors.secondary}1a` }}
        data-cp-decorative=""
      />

      <div className="relative z-10">
        <div className="container mx-auto container-padding py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {brandColumn && brandColIdx >= 0 && (
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
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    }}
                    data-cp-decorative=""
                  >
                    <span className="text-2xl font-bold" data-cp-decorative="">
                      {brandName.charAt(0)}
                    </span>
                  </div>
                  <h3
                    className="text-3xl font-bold text-gradient"
                    {...globalFieldAttrs(
                      navigation.wordmark
                        ? jsonPath('navigation', 'footer', 'wordmark')
                        : jsonPath('siteConfig', 'brand', 'name'),
                      'text',
                    )}
                  >
                    {navigation.wordmark || brandName}
                  </h3>
                </div>
                {brandColumn.content && (
                  <p
                    className="text-gray-400 mb-6 leading-relaxed max-w-md"
                    {...globalFieldAttrs(
                      jsonPath('navigation', 'footer', 'columns', brandColIdx, 'content'),
                      'textarea',
                    )}
                  >
                    {brandColumn.content}
                  </p>
                )}

                {navigation.newsletter.enabled && (
                  <div className="space-y-3 max-w-md">
                    {navigation.newsletter.heading && (
                      <h4
                        className="text-lg font-bold text-white"
                        {...globalFieldAttrs(
                          jsonPath('navigation', 'footer', 'newsletter', 'heading'),
                          'text',
                        )}
                      >
                        {navigation.newsletter.heading}
                      </h4>
                    )}
                    {navigation.newsletter.description && (
                      <p
                        className="text-sm text-gray-400"
                        {...globalFieldAttrs(
                          jsonPath('navigation', 'footer', 'newsletter', 'description'),
                          'textarea',
                        )}
                      >
                        {navigation.newsletter.description}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder={navigation.newsletter.placeholder}
                        className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none text-white placeholder-gray-500 transition-all"
                        aria-label={
                          navigation.newsletter.placeholder ||
                          UI_DEFAULTS.newsletterEmailAriaLabel
                        }
                        {...globalFieldAttrs(
                          jsonPath('navigation', 'footer', 'newsletter', 'placeholder'),
                          'text',
                        )}
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 rounded-xl font-semibold shadow-lg transition-all text-white"
                        style={{
                          background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                        }}
                      >
                        <span {...globalFieldAttrs(newsletterSubmitPath, 'text')}>
                          {newsletterSubmitLabel}
                        </span>
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {linksColumn?.links && linksColIdx >= 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h4
                  className="text-lg font-bold mb-6 text-white"
                  {...globalFieldAttrs(
                    jsonPath('navigation', 'footer', 'columns', linksColIdx, 'heading'),
                    'text',
                  )}
                >
                  {linksColumn.heading}
                </h4>
                <ul className="space-y-3">
                  {linksColumn.links.map((link, linkIndex) => (
                    <li key={link.label}>
                      <motion.a
                        href={link.href}
                        className="text-gray-400 transition-colors inline-flex items-center gap-2 group hover:text-[var(--primary-color)]"
                        whileHover={{ x: 4 }}
                        onClick={handleHashClick}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ backgroundColor: colors.primary }}
                          data-cp-decorative=""
                        />
                        <span
                          {...globalFieldAttrs(
                            jsonPath(
                              'navigation',
                              'footer',
                              'columns',
                              linksColIdx,
                              'links',
                              linkIndex,
                              'label',
                            ),
                            'text',
                          )}
                        >
                          {link.label}
                        </span>
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {socialColumn?.socialMedia && socialColIdx >= 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h4
                  className="text-lg font-bold mb-6 text-white"
                  {...globalFieldAttrs(
                    jsonPath('navigation', 'footer', 'columns', socialColIdx, 'heading'),
                    'text',
                  )}
                >
                  {socialColumn.heading}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {socialColumn.socialMedia.map((social, socialIndex) => {
                    const Icon = getIcon(social.icon || social.platform)
                    return (
                      <motion.a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label || social.platform}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center transition-all hover:border-[var(--primary-color)]"
                        onClick={handleHashClick}
                        {...globalFieldAttrs(
                          jsonPath(
                            'navigation',
                            'footer',
                            'columns',
                            socialColIdx,
                            'socialMedia',
                            socialIndex,
                            'url',
                          ),
                          'text',
                        )}
                      >
                        <Icon size={20} className="text-gray-400" data-cp-decorative="" />
                      </motion.a>
                    )
                  })}
                </div>

                <motion.button
                  onClick={scrollToTop}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="mt-8 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  }}
                  aria-label={UI_DEFAULTS.scrollToTopAriaLabel}
                >
                  <ArrowUpIcon size={20} data-cp-decorative="" />
                </motion.button>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="border-t border-gray-800 pt-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm flex items-center gap-2 flex-wrap justify-center">
                <span
                  {...globalFieldAttrs(
                    jsonPath('navigation', 'footer', 'bottomBar', 'copyrightText'),
                    'text',
                  )}
                >
                  {copyrightText}
                </span>
                {navigation.bottomBar.customText && (
                  <>
                    <span
                      {...globalFieldAttrs(
                        jsonPath('navigation', 'footer', 'bottomBar', 'customText', 'madeWith'),
                        'text',
                      )}
                    >
                      {navigation.bottomBar.customText.madeWith}
                    </span>
                    <HeartIcon
                      size={14}
                      className="text-red-500"
                      fill="currentColor"
                      data-cp-decorative=""
                    />
                    <span>
                      <span
                        {...globalFieldAttrs(
                          jsonPath('navigation', 'footer', 'bottomBar', 'customText', 'by'),
                          'text',
                        )}
                      >
                        {navigation.bottomBar.customText.by}
                      </span>{' '}
                      <span {...globalFieldAttrs(jsonPath('siteConfig', 'brand', 'name'), 'text')}>
                        {brandName}
                      </span>
                    </span>
                  </>
                )}
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                {bottomLinks.map((link, index) => (
                  <span key={link.label} className="flex items-center gap-6">
                    {index > 0 && (
                      <span className="w-1 h-1 rounded-full bg-gray-700" data-cp-decorative="" />
                    )}
                    <a
                      href={link.href}
                      className="transition-colors hover:text-[var(--primary-color)]"
                      onClick={handleHashClick}
                    >
                      <span
                        {...globalFieldAttrs(
                          jsonPath('navigation', 'footer', 'bottomBar', 'links', index, 'label'),
                          'text',
                        )}
                      >
                        {link.label}
                      </span>
                    </a>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div
          className="h-1"
          style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary}, ${colors.primary})`,
          }}
          data-cp-decorative=""
        />
      </div>
    </footer>
  )
}
