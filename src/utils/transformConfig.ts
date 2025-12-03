import type { SiteConfiguration, Section, AboutContent, ContactContent, CardGridContent } from '../types/config';

/**
 * Transforms API response data to match the expected internal structure
 * Handles differences between API response and internal types
 */
export function transformConfig(data: SiteConfiguration): SiteConfiguration {
  // Validate data structure
  if (!data) {
    throw new Error('Configuration data is undefined or null');
  }
  
  if (!data.pages || !Array.isArray(data.pages)) {
    throw new Error('Configuration missing pages array. Please ensure the config has a valid pages structure.');
  }
  
  // Transform pages and their sections
  const transformedPages = data.pages.map(page => {
    // Ensure page has sections array
    if (!page.sections || !Array.isArray(page.sections)) {
      console.warn(`Page ${page.id} missing sections array, using empty array`);
      return {
        ...page,
        sections: []
      };
    }
    
    return {
      ...page,
      sections: page.sections
        .map(section => transformSection(section))
        .filter((section): section is Section => section !== null)
    };
  });

  return {
    ...data,
    pages: transformedPages
  };
}

/**
 * Transforms a section to match expected structure
 * Returns null if section type is unknown (should be skipped)
 */
function transformSection(section: any): Section | null {
  // Skip unknown section types
  const knownTypes = ['hero', 'about', 'contact', 'cardGrid', 'services'];
  if (!knownTypes.includes(section.type)) {
    console.warn(`Skipping unknown section type: ${section.type}`);
    return null;
  }

  // Transform services type to cardGrid
  if (section.type === 'services') {
    return transformServicesToCardGrid(section);
  }

  // Transform about section
  if (section.type === 'about') {
    return transformAboutSection(section);
  }

  // Transform contact section
  if (section.type === 'contact') {
    return transformContactSection(section);
  }

  // Other sections (hero, cardGrid) pass through as-is
  return section as Section;
}

/**
 * Transforms services section to cardGrid section
 */
function transformServicesToCardGrid(section: any): Section {
  const content = section.content as CardGridContent;
  
  // Transform services array to items array
  if (content.services && !content.items) {
    content.items = content.services.map((service: any) => ({
      id: service.id,
      title: service.title,
      description: service.description,
      // Services don't have images in the JSON - use a placeholder or empty
      // CardGrid component should handle missing images gracefully
      media: {
        url: 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(service.title),
        alt: service.title
      },
      // Convert features array to tags if needed
      tags: service.features || []
    }));
    // Remove services property after transformation
    delete content.services;
  }

  return {
    ...section,
    type: 'cardGrid',
    content: content as CardGridContent
  } as Section;
}

/**
 * Transforms about section to handle mission as string or object
 */
function transformAboutSection(section: any): Section {
  const content = section.content as AboutContent;
  
  // Handle mission as string (convert to object format)
  if (typeof content.mission === 'string') {
    content.mission = {
      heading: 'Our Mission',
      text: content.mission,
      icon: 'Target'
    };
  }

  // Handle null experience
  if (content.experience === null || content.experience === undefined) {
    content.experience = {
      years: '',
      label: ''
    };
  }

  return section as Section;
}

/**
 * Transforms contact section to handle different structures
 */
function transformContactSection(section: any): Section {
  const content = section.content as ContactContent;
  
  // Transform contactInfo items to ensure color is properly set
  content.contactInfo = content.contactInfo.map(item => {
    // If color is null, provide default gradient colors
    if (!item.color) {
      return {
        ...item,
        color: {
          from: '#1A1A2E',
          to: '#16213E'
        }
      };
    }
    return item;
  });

  // Handle null cta
  if (!content.cta) {
    // Create a default CTA from contact info
    const emailItem = content.contactInfo.find(item => item.type === 'email');
    if (emailItem) {
      content.cta = {
        heading: 'Ready to Get Started?',
        description: 'Send us a message and we\'ll get back to you as soon as possible.',
        button: {
          text: 'Send Message',
          icon: 'Send',
          href: emailItem.href || `mailto:${emailItem.value}`,
          style: 'primary'
        }
      };
    }
  }

  return section as Section;
}

