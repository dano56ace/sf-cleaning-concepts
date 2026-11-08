import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileActionBar } from './components/layout/MobileActionBar';
import { QuoteModal } from './components/ui/QuoteModal';
import { GlobalCTA } from './components/ui/GlobalCTA';
import { SEOHead } from './components/seo/SEOHead';
import { ScrollToTop } from './components/seo/ScrollToTop';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesOverviewPage } from './pages/ServicesOverviewPage';
import { ServiceDirectoryPage } from './pages/ServiceDirectoryPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { ServiceAreaDirectoryPage } from './pages/ServiceAreaDirectoryPage';
import { ServiceAreaDetailPage } from './pages/ServiceAreaDetailPage';
import { PublicationsPage } from './pages/PublicationsPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { ContactPage } from './pages/ContactPage';
import { FaqsPage } from './pages/FaqsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const handleOpenQuoteModal = (serviceTitle = '') => {
    setSelectedService(serviceTitle);
    setIsQuoteModalOpen(true);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 antialiased selection:bg-[#2a8655] selection:text-white">
        <SEOHead />
        <ScrollToTop />
        <Header onOpenQuoteModal={() => handleOpenQuoteModal('')} />

        <main id="main-content" className="flex-grow pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={<HomePage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/index.html" element={<HomePage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/about-us.html" element={<AboutPage />} />
            <Route path="/our-services" element={<ServicesOverviewPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/our-services.html" element={<ServicesOverviewPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/service" element={<ServiceDirectoryPage />} />
            <Route path="/service/index.html" element={<ServiceDirectoryPage />} />
            <Route path="/service/:slug" element={<ServiceDetailPage />} />
            <Route path="/service-areas" element={<ServiceAreaDirectoryPage />} />
            <Route path="/service-areas.html" element={<ServiceAreaDirectoryPage />} />
            <Route path="/service-area/:slug" element={<ServiceAreaDetailPage />} />
            <Route path="/our-publications" element={<PublicationsPage />} />
            <Route path="/our-publications.html" element={<PublicationsPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/contact-us" element={<ContactPage />} />
            <Route path="/contact-us.html" element={<ContactPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/contact.html" element={<ContactPage />} />
            <Route path="/faqs" element={<FaqsPage />} />
            <Route path="/faqs.html" element={<FaqsPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="/404.html" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <GlobalCTA onOpenQuoteModal={() => handleOpenQuoteModal('')} />
        <Footer />
        <MobileActionBar onOpenQuoteModal={() => handleOpenQuoteModal('')} />

        <QuoteModal
          isOpen={isQuoteModalOpen}
          onClose={() => setIsQuoteModalOpen(false)}
          serviceTitle={selectedService}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
