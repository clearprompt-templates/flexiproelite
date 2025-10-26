# Dynamic Web Builder

A fully configurable, JSON-driven website builder with a **universal, reusable structure** that works for any type of business or static website.

## ✨ Key Features

- **🎯 Universal Card Grid System**: One component that works for products, services, blog posts, team members, portfolio items, events, and more
- **🔧 Zero Hardcoded Names**: No "price" or business-specific fields - use ANY field names you want
- **📝 JSON-Driven Content**: Update your entire website by editing a single config file
- **🎨 Fully Themeable**: Colors, typography, spacing - all customizable
- **📱 Responsive Design**: Beautiful on all devices
- **⚡ Instant Updates**: Changes appear immediately without rebuilding
- **♿ Accessible**: Built with semantic HTML and ARIA attributes
- **🚀 TypeScript**: Full type safety with detailed interfaces

## 🏗️ Architecture Overview

### Generic Naming Convention

This project uses a **universal, scalable naming structure** that avoids business-specific terms:

| Instead of... | We use... | Why? |
|--------------|-----------|------|
| `ProductGrid` | `CardGrid` | Works for any type of content grid |
| `price` | `metadata.value` or `metadata.amount` | Use any field name that fits your business |
| `popularBadge` | `featuredBadge` | Generic highlight that works for any context |
| `priceLabel` | `metadataLabel` | Adapts to any type of metadata |

### Component Structure

```
src/
├── components/
│   ├── CardGrid.tsx      # Universal grid component (products, services, blog, etc.)
│   ├── HeroSection.tsx   # Hero/banner section
│   ├── About.tsx         # About section
│   ├── Contact.tsx       # Contact section
│   ├── Header.tsx        # Site header with navigation
│   └── Footer.tsx        # Site footer
├── types/
│   └── config.ts         # TypeScript type definitions
└── hooks/
    └── useConfig.ts      # Configuration hook
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Edit Configuration

Open `/public/config.json` and customize your site:

```json
{
  "siteConfig": {
    "brand": {
      "name": "Your Business Name",
      "tagline": "Your tagline"
    }
  },
  "pages": [
    {
      "sections": [
        {
          "type": "cardGrid",
          "content": {
            "items": [
              {
                "title": "Your Item",
                "description": "Item description",
                "metadata": {
                  "value": "Your data"
                }
              }
            ]
          }
        }
      ]
    }
  ]
}
```

### 4. See Changes Instantly

Refresh your browser - no rebuild needed!

## 📖 Documentation

See **[CONFIG_GUIDE.md](./CONFIG_GUIDE.md)** for comprehensive documentation including:
- Complete configuration structure
- Field naming guidelines
- Examples for different business types
- Metadata field reference
- Best practices

## 🎯 Use Cases

This structure works for any type of website:

### E-Commerce
```json
"metadata": {
  "amount": "$29.99/mo",
  "rating": "4.8/5"
}
```

### Blog
```json
"metadata": {
  "published": "Oct 26, 2025",
  "duration": "5 min read"
}
```

### Events
```json
"metadata": {
  "when": "Dec 15, 2025",
  "where": "San Francisco"
}
```

### Team Directory
```json
"metadata": {
  "experience": "15+ years",
  "department": "Engineering"
}
```

### Portfolio
```json
"metadata": {
  "client": "ABC Corp",
  "completed": "2025"
}
```

## 🎨 Customization

### Theme Colors

Edit `siteConfig.theme.colors` in config.json:

```json
"colors": {
  "primary": "#6366f1",
  "secondary": "#8b5cf6",
  "accent": "#ec4899"
}
```

### Section Order

Change the `order` field in any section:

```json
{
  "id": "hero-section",
  "order": 1
},
{
  "id": "cards-section",
  "order": 2
}
```

### Enable/Disable Sections

Toggle the `enabled` field:

```json
{
  "id": "about-section",
  "enabled": false
}
```

## 🔧 Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Vite** - Build tool
- **Lucide React** - Icons

## 📝 Metadata Flexibility

The `metadata` object accepts **any key-value pairs**:

- No reserved field names
- Use natural, descriptive names
- First field displays prominently
- Perfect for any business type

Example field names:
- E-commerce: `amount`, `cost`, `value`, `savings`
- Blog: `published`, `author`, `duration`, `category`
- Events: `when`, `where`, `tickets`, `capacity`
- Services: `duration`, `availability`, `delivery`
- Portfolio: `client`, `year`, `stack`, `industry`

## 🌐 Multi-Language Support

The configuration includes locale support:

```json
"meta": {
  "language": "en",
  "locales": ["en", "es", "fr"]
}
```

## 🔄 Migration Guide

Migrating from older versions? See the migration section in CONFIG_GUIDE.md.

## 📦 Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## 🤝 Contributing

This is a template project. Feel free to:
- Fork and customize for your needs
- Add new section types
- Extend the metadata system
- Create additional layouts

## 📄 License

MIT License - Use freely for any project!

## 🆘 Support

For help:
1. Check [CONFIG_GUIDE.md](./CONFIG_GUIDE.md)
2. Review type definitions in `src/types/config.ts`
3. See examples in `public/config.json`

---

**Made with ❤️ for maximum flexibility and reusability**
