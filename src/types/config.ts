// ============================================================================
// Meta & Site Configuration Types
// ============================================================================

export interface Meta {
  version: string;
  lastUpdated: string;
  siteId: string;
  language: string;
  locales: string[];
  title: string;
  description: string;
}

export interface Brand {
  name: string;
  tagline: string;
  logo?: {
    type: 'svg' | 'image';
    width?: number;
    height?: number;
    textColor?: string;
    iconPrimaryColor?: string;
    iconSecondaryColor?: string;
    iconStrokeColor?: string;
    url?: string;
  };
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  muted: string;
}

export interface Typography {
  fontFamily: string;
  headingFontFamily: string;
  fontSize: {
    base: string;
    heading1: string;
    heading2: string;
    heading3: string;
  };
}

export interface Spacing {
  sectionPadding: string;
  containerMaxWidth: string;
}

export interface BorderRadius {
  small: string;
  medium: string;
  large: string;
}

export interface Theme {
  colors: ThemeColors;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  // Legacy support - computed from colors
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
}

export interface SEO {
  keywords: string[];
  author: string;
  ogImage: string;
  favicon: string;
}

export interface Analytics {
  googleAnalyticsId: string;
  facebookPixelId: string;
  enabled: boolean;
}

export interface SiteConfig {
  brand: Brand;
  theme: Theme;
  seo: SEO;
  analytics: Analytics;
}

// ============================================================================
// Navigation Types
// ============================================================================

export interface NavItem {
  id: string;
  label: string;
  href: string;
  type: 'link' | 'dropdown';
  children?: NavItem[];
}

export interface NavigationCTA {
  enabled: boolean;
  label: string;
  href: string;
  style: 'primary' | 'secondary';
}

export interface HeaderNavigation {
  enabled: boolean;
  position: 'fixed' | 'sticky' | 'static';
  style: 'transparent' | 'solid';
  items: NavItem[];
  cta: NavigationCTA;
}

export interface FooterColumn {
  id: string;
  type: 'brand' | 'links' | 'social';
  heading?: string;
  content?: string;
  links?: Array<{ label: string; href: string }>;
  socialMedia?: Array<{ platform: string; url: string; icon: string }>;
}

export interface Newsletter {
  enabled: boolean;
  heading: string;
  placeholder: string;
  buttonText: string;
}

export interface FooterBottomBar {
  copyrightText: string;
  links: string[];
  customText: {
    madeWith: string;
    by: string;
  };
}

export interface FooterNavigation {
  enabled: boolean;
  columns: FooterColumn[];
  newsletter: Newsletter;
  bottomBar: FooterBottomBar;
}

export interface Navigation {
  header: HeaderNavigation;
  footer: FooterNavigation;
}

// ============================================================================
// Section Content Types
// ============================================================================

export interface ImageContent {
  url: string;
  alt: string;
}

export interface CTAButton {
  text: string;
  href: string;
  style?: 'primary' | 'secondary' | 'gradient' | 'glass' | 'outline';
  icon?: string;
}

// Hero Section
export interface HeroContent {
  badge: {
    text: string;
    icon: string;
    visible: boolean;
  };
  heading: {
    text: string;
    gradient: boolean;
    splitAt?: number;
  };
  subheading: {
    text: string;
  };
  cta: {
    primary: CTAButton;
    secondary: CTAButton;
  };
  features: Array<{ icon: string; text: string }>;
  backgroundImage: ImageContent;
  scrollIndicator: {
    visible: boolean;
    text: string;
  };
}

// Card Grid Section (Generic - can be used for products, services, team, portfolio, blog, etc.)
export interface CardItem {
  id: string;
  title: string;              // Main heading (e.g., product name, service name, person name, etc.)
  subtitle?: string;           // Optional subtitle (e.g., job title, category, etc.)
  description: string;         // Description text
  media: ImageContent;         // Image or visual content
  cta?: CTAButton;            // Call-to-action button (optional)
  tags?: string[];            // Tags/categories (optional)
  featured?: boolean;         // Highlight this card (optional)
  metadata?: {                // Flexible key-value pairs for any data you need to display
    [key: string]: string | number | boolean | undefined;
    // Use any field names that make sense for your business:
    // - E-commerce: "amount", "cost", "value", "rate"
    // - Blog: "publishDate", "readTime", "author"
    // - Events: "eventDate", "venue", "capacity"
    // - Services: "duration", "availability", "level"
    // - Portfolio: "client", "year", "stack"
    // - Team: "role", "department", "contact"
    // - Courses: "hours", "lessons", "difficulty"
    // First defined value will be displayed as primary metadata
  };
}

export interface CardGridContent {
  badge: string;               // Section badge/label
  heading: string;             // Section heading
  description: string;         // Section description
  items: CardItem[];          // Array of cards
  footer?: {                  // Optional footer CTA
    text: string;
    cta: CTAButton;
  };
  labels?: {                  // Customizable labels for UI elements
    featuredBadge?: string;   // Badge text for featured items (e.g., "Popular", "Featured", "Best Seller")
    metadataLabel?: string;   // Label for metadata display (e.g., "Starting at", "Posted on", "Duration")
  };
}

// About Section
export interface StatItem {
  id: string;
  icon: string;
  value: string;
  label: string;
}

export interface AboutContent {
  badge: string;
  heading: string;
  description: string;
  mission: {
    heading: string;
    text: string;
    icon: string;
  };
  stats: StatItem[];
  image: ImageContent;
  experience: {
    years: string;
    label: string;
  };
}

// Contact Section
export interface ContactInfoItem {
  id: string;
  type: 'email' | 'phone' | 'address';
  icon: string;
  label: string;
  value: string;
  href: string | null;
  color: {
    from: string;
    to: string;
  };
}

export interface ContactContent {
  badge: string;
  heading: string;
  description: string;
  contactInfo: ContactInfoItem[];
  cta: {
    heading: string;
    description: string;
    button: {
      text: string;
      icon: string;
    };
  };
}

// ============================================================================
// Section Types
// ============================================================================

export interface SectionSettings {
  [key: string]: string | number | boolean | object | undefined;
}

export interface BaseSection {
  id: string;
  type: string;
  enabled: boolean;
  order: number;
  settings: SectionSettings;
}

export interface HeroSection extends BaseSection {
  type: 'hero';
  content: HeroContent;
}

export interface CardGridSection extends BaseSection {
  type: 'cardGrid';
  content: CardGridContent;
}

export interface AboutSection extends BaseSection {
  type: 'about';
  content: AboutContent;
}

export interface ContactSection extends BaseSection {
  type: 'contact';
  content: ContactContent;
}

export type Section = HeroSection | CardGridSection | AboutSection | ContactSection;

// ============================================================================
// Page Types
// ============================================================================

export interface Page {
  id: string;
  path: string;
  title: string;
  description: string;
  enabled: boolean;
  sections: Section[];
}

// ============================================================================
// Content Library Types
// ============================================================================

export interface ButtonStyle {
  style: string;
  rounded: boolean;
  shadow: boolean;
}

export interface AnimationConfig {
  initial: Record<string, string | number | boolean | number[]>;
  animate: Record<string, string | number | boolean | number[]>;
  transition: Record<string, string | number | boolean>;
}

export interface ContentLibrary {
  buttons: {
    primary: ButtonStyle;
    secondary: ButtonStyle;
  };
  animations: Record<string, AnimationConfig>;
}

// ============================================================================
// Root Configuration Type
// ============================================================================

export interface SiteConfiguration {
  meta: Meta;
  siteConfig: SiteConfig;
  navigation: Navigation;
  pages: Page[];
  contentLibrary: ContentLibrary;
}

// ============================================================================
// API Response Type
// ============================================================================

export interface ApiResponse {
  id: number;
  url: string;
  contents: SiteConfiguration;
}

// ============================================================================
// Legacy Type Support (for backward compatibility)
// ============================================================================

export interface Hero {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

export interface About {
  title: string;
  description: string;
  mission: string;
  image: string;
}

export interface Contact {
  title: string;
  description: string;
  email: string;
  phone: string;
  address: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface SocialMedia {
  platform: string;
  url: string;
}

export interface Footer {
  copyright: string;
  links: FooterLink[];
  socialMedia: SocialMedia[];
}

export interface UIText {
  header: {
    getStartedButton: string;
  };
  hero: {
    badge: string;
    learnMoreButton: string;
    scrollIndicator: string;
    features: Array<{ icon: string; text: string }>;
  };
  products: {
    badge: string;
    heading: string;
    description: string;
    popularBadge: string;
    priceLabel: string;
    ctaFooter: string;
    ctaButton: string;
  };
  about: {
    badge: string;
    missionHeading: string;
    stats: Array<{ label: string; value: string }>;
    experienceBadge: string;
    experienceLabel: string;
  };
  contact: {
    badge: string;
    infoLabels: {
      email: string;
      phone: string;
      address: string;
    };
    ctaHeading: string;
    ctaDescription: string;
    ctaButton: string;
  };
  footer: {
    description: string;
    newsletterPlaceholder: string;
    newsletterButton: string;
    quickLinksHeading: string;
    followUsHeading: string;
    madeWithText: string;
    byText: string;
    bottomLinks: string[];
  };
}

// Legacy config type (for backward compatibility during migration)
export interface LegacySiteConfig {
  brand: Brand;
  theme: Theme;
  uiText: UIText;
  navigation: NavItem[];
  hero: Hero;
  products: Product[];
  about: About;
  contact: Contact;
  footer: Footer;
}
