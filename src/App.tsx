import { useEffect } from 'react';
import { useConfig } from './hooks/useConfig';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CardGrid } from './components/CardGrid';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorFallback } from './components/ErrorFallback';
import type { Section } from './types/config';

function App() {
  const { config, loading, error, getEnabledSections, theme, brand, navigation } = useConfig();

  useEffect(() => {
    if (config && theme) {
      // Set CSS variables for theme
      document.documentElement.style.setProperty('--primary-color', theme.primaryColor || '');
      document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor || '');
      document.documentElement.style.setProperty('--accent-color', theme.accentColor || '');
      document.documentElement.style.setProperty('--background-color', theme.backgroundColor || '');
      document.documentElement.style.setProperty('--text-color', theme.textColor || '');

      // Set body styles
      document.body.style.fontFamily = theme.fontFamily || '';
      document.body.style.backgroundColor = theme.backgroundColor || '';
      document.body.style.color = theme.textColor || '';

      // Set document title
      if (config.meta) {
        document.title = config.meta.title;
      }
    }
  }, [config, theme]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !config || !theme || !brand || !navigation) {
    return <ErrorFallback error={error || 'Configuration not found'} />;
  }

  // Get the home page sections
  const homeSections = getEnabledSections('home');

  // Render a section based on its type
  const renderSection = (section: Section) => {
    switch (section.type) {
      case 'hero':
        return (
          <HeroSection
            key={section.id}
            section={section}
            theme={theme}
          />
        );
      case 'cardGrid':
        return (
          <CardGrid
            key={section.id}
            section={section}
            theme={theme}
          />
        );
      case 'about':
        return (
          <About
            key={section.id}
            section={section}
            theme={theme}
          />
        );
      case 'contact':
        return (
          <Contact
            key={section.id}
            section={section}
            theme={theme}
          />
        );
      default:
        console.warn(`Unknown section type: ${section.type}`);
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        brand={brand}
        navigation={navigation.header}
        theme={theme}
      />

      {homeSections.map((section) => renderSection(section))}

      <Footer
        navigation={navigation.footer}
        theme={theme}
        brandName={brand.name}
      />
    </div>
  );
}

export default App;
