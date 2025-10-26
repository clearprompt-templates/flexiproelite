# Dynamic Configuration Guide

This website is fully dynamic and loads all content from `/public/config.json`. You can customize every aspect of the site by editing this single file.

## Configuration Structure

### Brand Settings
```json
"brand": {
  "name": "Your Company Name",
  "logoUrl": "URL to your logo image",
  "tagline": "Your company tagline"
}
```

### Theme Colors
```json
"theme": {
  "primaryColor": "#0ea5e9",
  "secondaryColor": "#3b82f6",
  "accentColor": "#06b6d4",
  "backgroundColor": "#ffffff",
  "textColor": "#1f2937",
  "fontFamily": "Inter, system-ui, sans-serif"
}
```

### Navigation Menu
```json
"navigation": [
  { "label": "Home", "href": "#home" },
  { "label": "Products", "href": "#products" }
]
```

### Hero Section
```json
"hero": {
  "title": "Main headline",
  "subtitle": "Supporting text",
  "ctaText": "Button text",
  "ctaLink": "#products",
  "backgroundImage": "URL to hero background image"
}
```

### Products
```json
"products": [
  {
    "id": 1,
    "name": "Product Name",
    "description": "Product description",
    "price": "$29.99/mo",
    "image": "URL to product image",
    "ctaText": "Learn More",
    "ctaLink": "#"
  }
]
```

### About Section
```json
"about": {
  "title": "About Us",
  "description": "Company description",
  "mission": "Mission statement",
  "image": "URL to about section image"
}
```

### Contact Information
```json
"contact": {
  "title": "Get in Touch",
  "description": "Contact description",
  "email": "email@example.com",
  "phone": "+1 (555) 123-4567",
  "address": "Your address"
}
```

### Footer
```json
"footer": {
  "copyright": "Company Name. All rights reserved.",
  "links": [
    { "label": "Privacy Policy", "href": "#" }
  ],
  "socialMedia": [
    { "platform": "twitter", "url": "https://twitter.com" },
    { "platform": "linkedin", "url": "https://linkedin.com" },
    { "platform": "github", "url": "https://github.com" },
    { "platform": "facebook", "url": "https://facebook.com" }
  ]
}
```

## Supported Social Media Platforms
- twitter
- linkedin
- github
- facebook

## Image Guidelines
- Use high-quality images from stock photo sites
- Recommended hero image size: 1920x1080px
- Recommended product images: 600x400px
- Logo should have transparent background
- About section image: 800x600px

## Color Guidelines
- Use hex color codes (e.g., #0ea5e9)
- Ensure sufficient contrast for text readability
- Primary color is used for main CTAs and headings
- Secondary color is used for hover states
- Accent color is used for decorative elements

## Font Guidelines
- Specify web-safe fonts or Google Fonts
- Use fallback fonts for better compatibility
- Example: "Inter, system-ui, sans-serif"

## Making Changes
1. Edit `/public/config.json`
2. Save the file
3. Refresh the browser
4. Changes appear instantly (no rebuild needed)

## Error Handling
If the configuration fails to load:
- Check that config.json is valid JSON
- Verify all URLs are accessible
- Check browser console for specific errors
- Use the retry button on the error page
