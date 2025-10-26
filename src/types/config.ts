export interface Brand {
  name: string;
  logoUrl?: string; // Optional external logo URL
  tagline: string;
  logo?: {
    type: 'svg' | 'image'; // 'svg' for generated, 'image' for external URL
    width?: number;
    height?: number;
    textColor?: string;
    iconPrimaryColor?: string;
    iconSecondaryColor?: string;
    iconStrokeColor?: string;
  };
}

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
}

export interface NavItem {
  label: string;
  href: string;
}

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

export interface SiteConfig {
  brand: Brand;
  theme: Theme;
  navigation: NavItem[];
  hero: Hero;
  products: Product[];
  about: About;
  contact: Contact;
  footer: Footer;
}
