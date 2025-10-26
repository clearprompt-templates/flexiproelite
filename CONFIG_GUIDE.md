# Dynamic Configuration Guide

This website is fully dynamic and loads all content from `/public/config.json`. You can customize every aspect of the site by editing this single file. The configuration uses a **generic, reusable structure** that works for any type of business or static website.

## Key Features

- ✅ **Generic Naming Convention**: Use the same structure for products, services, team members, blog posts, portfolio items, and more
- ✅ **Flexible Metadata**: Add custom fields for different business types
- ✅ **Section-Based Layout**: Enable/disable and reorder sections as needed
- ✅ **Type-Safe Configuration**: Full TypeScript support with intellisense
- ✅ **No Code Changes Required**: Update content without rebuilding

---

## Configuration Structure

### 1. Meta Information
Basic site metadata and settings.

```json
"meta": {
  "version": "2.0.0",
  "lastUpdated": "2025-10-26",
  "siteId": "your-site-id",
  "language": "en",
  "locales": ["en", "es", "fr"],
  "title": "Your Site Title",
  "description": "Your site description"
}
```

---

### 2. Site Configuration

#### Brand Settings
```json
"siteConfig": {
  "brand": {
    "name": "Your Company Name",
    "tagline": "Your company tagline",
    "logo": {
      "type": "svg",
      "width": 200,
      "height": 60,
      "textColor": "#6366f1",
      "iconPrimaryColor": "#6366f1",
      "iconSecondaryColor": "#8b5cf6"
    }
  }
}
```

#### Theme Configuration
```json
"theme": {
  "colors": {
    "primary": "#6366f1",
    "secondary": "#8b5cf6",
    "accent": "#ec4899",
    "background": "#ffffff",
    "text": "#1e293b",
    "muted": "#64748b"
  },
  "typography": {
    "fontFamily": "Inter, system-ui, sans-serif",
    "headingFontFamily": "Inter, system-ui, sans-serif",
    "fontSize": {
      "base": "16px",
      "heading1": "3.5rem",
      "heading2": "2.5rem",
      "heading3": "1.875rem"
    }
  },
  "spacing": {
    "sectionPadding": "6rem",
    "containerMaxWidth": "1280px"
  },
  "borderRadius": {
    "small": "0.5rem",
    "medium": "1rem",
    "large": "1.5rem"
  }
}
```

#### SEO Settings
```json
"seo": {
  "keywords": ["technology", "workflow", "innovation"],
  "author": "Your Company Inc.",
  "ogImage": "https://your-og-image.jpg",
  "favicon": "/favicon.ico"
}
```

---

### 3. Navigation

#### Header Navigation
```json
"navigation": {
  "header": {
    "enabled": true,
    "position": "fixed",
    "style": "transparent",
    "items": [
      { "id": "nav-1", "label": "Home", "href": "#home", "type": "link" },
      { "id": "nav-2", "label": "Products", "href": "#cards", "type": "link" }
    ],
    "cta": {
      "enabled": true,
      "label": "Get Started",
      "href": "#contact",
      "style": "primary"
    }
  }
}
```

#### Footer Navigation
```json
"footer": {
  "enabled": true,
  "columns": [
    {
      "id": "footer-col-1",
      "type": "brand",
      "heading": "Your Company",
      "content": "Your company description"
    },
    {
      "id": "footer-col-2",
      "type": "links",
      "heading": "Quick Links",
      "links": [
        { "label": "Privacy Policy", "href": "#" },
        { "label": "Terms of Service", "href": "#" }
      ]
    },
    {
      "id": "footer-col-3",
      "type": "social",
      "heading": "Follow Us",
      "socialMedia": [
        { "platform": "twitter", "url": "https://twitter.com", "icon": "twitter" },
        { "platform": "linkedin", "url": "https://linkedin.com", "icon": "linkedin" }
      ]
    }
  ]
}
```

---

### 4. Page Sections

Each page contains sections that can be enabled/disabled and reordered.

#### Hero Section
```json
{
  "id": "hero-section",
  "type": "hero",
  "enabled": true,
  "order": 1,
  "settings": {
    "fullHeight": true,
    "parallax": true,
    "overlay": true
  },
  "content": {
    "badge": { "text": "Welcome", "icon": "sparkles", "visible": true },
    "heading": { "text": "Transform Your Business", "gradient": true },
    "subheading": { "text": "Discover cutting-edge solutions" },
    "cta": {
      "primary": { "text": "Get Started", "href": "#cards", "style": "gradient" },
      "secondary": { "text": "Learn More", "href": "#about", "style": "glass" }
    }
  }
}
```

---

### 5. Card Grid Section (Universal Component)

The **Card Grid** is a generic, reusable component that can display:
- 🛍️ **Products/Services** (with price)
- 📝 **Blog Posts** (with date and author)
- 👥 **Team Members** (with position and social links)
- 💼 **Portfolio Items** (with client and technologies)
- 📅 **Events** (with date and location)
- 🎓 **Courses** (with duration and level)
- ⭐ **Testimonials** (with rating and company)

#### Basic Structure
```json
{
  "id": "cards-section",
  "type": "cardGrid",
  "enabled": true,
  "order": 2,
  "settings": {
    "columns": { "mobile": 1, "tablet": 2, "desktop": 3 },
    "animation": "fadeInUp",
    "featuredIndex": 1
  },
  "content": {
    "badge": "Section Label",
    "heading": "Section Heading",
    "description": "Section description text",
    "items": [/* card items */],
    "footer": {
      "text": "Can't find what you're looking for?",
      "cta": { "text": "Contact Us", "href": "#contact" }
    },
    "labels": {
      "featuredBadge": "Popular",
      "metadataLabel": "Starting at"
    }
  }
}
```

#### Card Item Structure
```json
{
  "id": "card-1",
  "title": "Main Heading",
  "subtitle": "Optional Subtitle (e.g., job title, category)",
  "description": "Detailed description text",
  "media": {
    "url": "https://image-url.jpg",
    "alt": "Image description"
  },
  "cta": {
    "text": "Button Text",
    "href": "#"
  },
  "tags": ["tag1", "tag2"],
  "featured": false,
  "metadata": {
    "value": "$29.99/mo"
  }
}
```

**Note**: The `metadata` object accepts any key-value pairs you define. Use field names that make sense for your specific business needs. The first value in metadata will be displayed prominently on the card.

---

## Use Cases & Examples

### Example 1: E-Commerce Products
```json
{
  "title": "CloudSync Pro",
  "description": "Seamlessly sync your files across all devices",
  "media": { "url": "product-image.jpg", "alt": "CloudSync Pro" },
  "cta": { "text": "Buy Now", "href": "/checkout" },
  "tags": ["cloud", "storage"],
  "featured": true,
  "metadata": {
    "amount": "$29.99/mo",
    "rating": "4.8/5",
    "customers": "1,250+"
  }
}
```

**Field naming flexibility**: Use `"amount"`, `"cost"`, `"value"`, `"rate"`, or any term that fits your business. The first field will be displayed prominently.

### Example 2: Blog Posts
```json
{
  "title": "10 Tips for Better Productivity",
  "subtitle": "Productivity",
  "description": "Learn how to optimize your workflow and get more done",
  "media": { "url": "blog-image.jpg", "alt": "Productivity tips" },
  "cta": { "text": "Read More", "href": "/blog/productivity-tips" },
  "tags": ["productivity", "tips"],
  "featured": false,
  "metadata": {
    "published": "Oct 26, 2025",
    "author": "John Doe",
    "duration": "5 min read"
  }
}
```

**Field naming flexibility**: Use `"published"`, `"posted"`, `"date"`, or any term you prefer. First field displays prominently.

### Example 3: Team Members
```json
{
  "title": "Jane Smith",
  "subtitle": "CEO & Founder",
  "description": "Jane has over 15 years of experience in the tech industry",
  "media": { "url": "team-member.jpg", "alt": "Jane Smith" },
  "cta": { "text": "Connect", "href": "https://linkedin.com/in/janesmith" },
  "tags": ["leadership", "tech"],
  "featured": true,
  "metadata": {
    "experience": "15+ years",
    "contact": "jane@company.com",
    "social": "LinkedIn"
  }
}
```

**Field naming flexibility**: Use any descriptive field names like `"experience"`, `"department"`, `"specialization"`, etc.

### Example 4: Portfolio Projects
```json
{
  "title": "Modern E-commerce Platform",
  "subtitle": "Web Development",
  "description": "A full-featured e-commerce solution built with React and Node.js",
  "media": { "url": "project-screenshot.jpg", "alt": "E-commerce platform" },
  "cta": { "text": "View Project", "href": "/portfolio/ecommerce" },
  "tags": ["react", "nodejs", "ecommerce"],
  "featured": true,
  "metadata": {
    "client": "ABC Corp",
    "completed": "2025",
    "stack": "React, Node.js, MongoDB",
    "timeline": "3 months"
  }
}
```

**Field naming flexibility**: Use `"client"`, `"company"`, `"project"`, `"stack"`, `"tech"`, etc. - whatever makes sense for your portfolio.

### Example 5: Events
```json
{
  "title": "Tech Conference 2025",
  "subtitle": "Annual Conference",
  "description": "Join us for three days of learning and networking",
  "media": { "url": "event-banner.jpg", "alt": "Tech Conference" },
  "cta": { "text": "Register Now", "href": "/events/tech-conference" },
  "tags": ["conference", "networking"],
  "featured": true,
  "metadata": {
    "when": "Dec 15-17, 2025",
    "where": "San Francisco, CA",
    "tickets": "$499",
    "seats": "500 available"
  }
}
```

**Field naming flexibility**: Use natural, conversational field names like `"when"`, `"where"`, `"tickets"`, `"admission"`, etc.

---

## Metadata Field Reference

### Flexible Metadata Naming

**Key Principle**: Use any field names that make sense for your business. There are no required or reserved field names. The system automatically displays the first metadata value prominently on each card.

### Suggested Field Names by Use Case

| Use Case | Suggested Fields | Example Values |
|----------|-----------------|----------------|
| **E-commerce** | `amount`, `cost`, `value`, `rate`, `monthly` | `"$29.99/mo"`, `"From $99"` |
| **Blog/Articles** | `published`, `posted`, `date`, `author`, `duration` | `"Oct 26, 2025"`, `"5 min read"` |
| **Events** | `when`, `date`, `where`, `venue`, `tickets`, `seats` | `"Dec 15, 2025"`, `"SF, CA"` |
| **Services** | `duration`, `timeline`, `availability`, `commitment` | `"3 months"`, `"24/7"` |
| **Portfolio** | `client`, `company`, `completed`, `year`, `stack` | `"ABC Corp"`, `"2025"` |
| **Team Members** | `experience`, `years`, `department`, `role`, `contact` | `"15+ years"`, `"Engineering"` |
| **Courses** | `hours`, `lessons`, `level`, `difficulty`, `students` | `"40 hours"`, `"Beginner"` |
| **Testimonials** | `rating`, `company`, `role`, `verified` | `"5/5 stars"`, `"CEO, ABC Inc"` |
| **Real Estate** | `bedrooms`, `area`, `year`, `status` | `"3 BR"`, `"2,000 sq ft"` |
| **Restaurants** | `cuisine`, `hours`, `rating`, `delivery` | `"Italian"`, `"Open Now"` |

---

## Label Customization

Customize UI labels to match your content context. Labels help users understand what the metadata represents.

### For Products/Services
```json
"labels": {
  "featuredBadge": "Popular",
  "metadataLabel": "Starting at"
}
```

### For Blog Posts
```json
"labels": {
  "featuredBadge": "Featured Post",
  "metadataLabel": "Published"
}
```

### For Events
```json
"labels": {
  "featuredBadge": "Upcoming",
  "metadataLabel": "Event Date"
}
```

### For Team Members
```json
"labels": {
  "featuredBadge": "Core Team",
  "metadataLabel": "Experience"
}
```

### For Portfolio
```json
"labels": {
  "featuredBadge": "Award Winning",
  "metadataLabel": "Client"
}
```

**Note**: The `metadataLabel` appears above the first metadata value to provide context (e.g., "Starting at: $29.99").

---

## Making Changes

1. **Edit** `/public/config.json`
2. **Save** the file
3. **Refresh** your browser
4. Changes appear **instantly** (no rebuild needed!)

---

## Best Practices

### 1. Image Guidelines
- Use high-quality images (stock photos or professional photography)
- **Hero images**: 1920x1080px or larger
- **Card images**: 600x400px (landscape) or 400x400px (square)
- Use compressed images for faster loading
- Always include descriptive `alt` text for accessibility

### 2. Color Guidelines
- Use hex color codes (e.g., `#6366f1`)
- Ensure sufficient contrast for text readability (WCAG AA standard)
- Primary color: Main CTAs and brand elements
- Secondary color: Hover states and accents
- Test colors in both light and dark environments

### 3. Typography Guidelines
- Use web-safe fonts or Google Fonts
- Include fallback fonts: `"Inter, system-ui, sans-serif"`
- Maintain consistent font sizes across sections
- Use font weights purposefully (400 for body, 600-700 for headings)

### 4. Content Guidelines
- Keep titles concise (5-8 words)
- Descriptions should be 2-3 sentences
- Use action-oriented CTA text ("Get Started" vs "Click Here")
- Include relevant tags for filtering/categorization
- Ensure all URLs are absolute and valid

### 5. Metadata Guidelines
- Only include relevant metadata fields
- Use consistent date formats across all cards
- Keep metadata values short and scannable
- Use the first metadata value as primary display if no `price` field exists

---

## Error Handling

If the configuration fails to load:
1. **Validate JSON**: Use [jsonlint.com](https://jsonlint.com) to check syntax
2. **Check URLs**: Ensure all image URLs are accessible
3. **Browser Console**: Check for specific error messages
4. **Use Retry**: Click the retry button on the error page
5. **Backup**: Keep a working version of config.json

---

## TypeScript Support

Full TypeScript definitions are available in `src/types/config.ts`:
- `CardItem`: Individual card structure
- `CardGridContent`: Card grid section content
- `CardGridSection`: Complete section with settings
- All fields are documented with JSDoc comments

---

## Migration from Old Structure

If migrating from the old product-specific structure:

| Old Field | New Field | Notes |
|-----------|-----------|-------|
| `type: "productGrid"` | `type: "cardGrid"` | Section type renamed for flexibility |
| `name` | `title` | Main heading - more universal |
| `image` | `media` | Image content - supports future media types |
| `price` | `metadata.value` or `metadata.amount` | Use any field name you prefer |
| `popularBadge` | `featuredBadge` | More generic - works for any highlight |
| `priceLabel` | `metadataLabel` | More generic - adapts to any metadata type |
| `popularIndex` | `featuredIndex` | Settings field renamed |

**Important**: You can use ANY field names in `metadata`. Examples: `cost`, `value`, `amount`, `rate`, `date`, `duration` - whatever fits your business model.

---

## Support

For additional help:
- Check TypeScript definitions in `src/types/config.ts`
- Review examples in this guide
- See the default `config.json` for a working example

**Version**: 2.0.0  
**Last Updated**: October 26, 2025
