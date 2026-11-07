import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileActionBar } from './components/layout/MobileActionBar';
import { QuoteModal } from './components/ui/QuoteModal';
import { ScrollToTop } from './components/seo/ScrollToTop';
import { SEOHead } from './components/seo/SEOHead';

// Page Components
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesOverviewPage } from './pages/ServicesOverviewPage';
import { ServiceDirectoryPage } from './pages/ServiceDirectoryPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { PublicationsPage } from './pages/PublicationsPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { ContactPage } from './pages/ContactPage';
import { FaqsPage } from './pages/FaqsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [modalServiceTitle, setModalServiceTitle] = useState<string | undefined>(undefined);

  const handleOpenQuoteModal = (serviceTitle?: string) => {
    setModalServiceTitle(serviceTitle);
    setQuoteModalOpen(true);
  };

  const handleCloseQuoteModal = () => {
    setQuoteModalOpen(false);
    setModalServiceTitle(undefined);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <SEOHead />
      <div className="flex flex-col min-h-screen bg-[#f8fafc] text-slate-800 antialiased">
        <Header onOpenQuoteModal={() => handleOpenQuoteModal()} />
        <main id="main-content" className="flex-grow pb-20 lg:pb-0">
          <Routes>
            {/* 6 Core Routes (both clean and .html for universal routing) */}
            <Route path="/" element={<HomePage onOpenQuoteModal={() => handleOpenQuoteModal()} />} />
            <Route path="/index.html" element={<HomePage onOpenQuoteModal={() => handleOpenQuoteModal()} />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/about-us.html" element={<AboutPage />} />
            <Route path="/our-services" element={<ServicesOverviewPage />} />
            <Route path="/our-services.html" element={<ServicesOverviewPage />} />
            <Route path="/contact-us" element={<ContactPage />} />
            <Route path="/contact-us.html" element={<ContactPage />} />
            <Route path="/faqs" element={<FaqsPage />} />
            <Route path="/faqs.html" element={<FaqsPage />} />
            <Route path="/our-publications" element={<PublicationsPage />} />
            <Route path="/our-publications.html" element={<PublicationsPage />} />

            {/* 11 Service Routes */}
            <Route path="/service" element={<ServiceDirectoryPage />} />
            <Route path="/service/index.html" element={<ServiceDirectoryPage />} />
            <Route path="/service/:slug" element={<ServiceDetailPage />} />

            {/* 11 Educational Blog Routes */}
            <Route path="/blog/:slug" element={<BlogPostPage />} />

            {/* 404 Routes */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <MobileActionBar onOpenQuoteModal={() => handleOpenQuoteModal()} />

        {/* Global Interactive Quote Modal */}
        <QuoteModal
          isOpen={quoteModalOpen}
          onClose={handleCloseQuoteModal}
          serviceTitle={modalServiceTitle}
        />
      </div>
    </BrowserRouter>
  );
}
