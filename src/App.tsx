import { useEffect } from 'react';
import { useConfig } from './hooks/useConfig';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProductGrid } from './components/ProductGrid';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorFallback } from './components/ErrorFallback';

function App() {
  const { config, loading, error } = useConfig();

  useEffect(() => {
    if (config) {
      document.documentElement.style.setProperty('--primary-color', config.theme.primaryColor);
      document.documentElement.style.setProperty('--secondary-color', config.theme.secondaryColor);
      document.documentElement.style.setProperty('--accent-color', config.theme.accentColor);
      document.documentElement.style.setProperty('--background-color', config.theme.backgroundColor);
      document.documentElement.style.setProperty('--text-color', config.theme.textColor);

      document.body.style.fontFamily = config.theme.fontFamily;
      document.body.style.backgroundColor = config.theme.backgroundColor;
      document.body.style.color = config.theme.textColor;

      document.title = `${config.brand.name} - ${config.brand.tagline}`;
    }
  }, [config]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !config) {
    return <ErrorFallback error={error || 'Unknown error occurred'} />;
  }

  return (
    <div className="min-h-screen">
      <Header
        brand={config.brand}
        navigation={config.navigation}
        theme={config.theme}
      />

      <HeroSection hero={config.hero} theme={config.theme} />

      <ProductGrid products={config.products} theme={config.theme} />

      <About about={config.about} theme={config.theme} />

      <Contact contact={config.contact} theme={config.theme} />

      <Footer
        footer={config.footer}
        theme={config.theme}
        brandName={config.brand.name}
      />
    </div>
  );
}

export default App;
